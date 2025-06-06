import Shift from '../models/Shift.js';


/**
 * @route   POST /api/shifts/start
 * @desc    Start a new shift entry for a user
 * @access  Private (Employee)
 */

export const startShift = async (req, res) => {
  try {
    const employeeId = req.employee?.id;
    const {
      projectId = null,
      date,
      startTime,
      startLocation,
      notes = '',
    } = req.body;

    if (!employeeId || !date || !startTime || !startLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newShift = await Shift.create({
      employeeId,
      projectId,
      date,
      startTime,
      startLocation,
      notes,
    });
    return res.status(201).json({
      success: true,
      message: 'Shift started successfully',
      shift: newShift,
    });
  } catch (error) {
    console.error('Error starting shift:', error);
    return res.status(500).json({ message: 'Server error while starting shift' });
  }
};


/**
 * @route   POST /api/shift/end
 * @desc    End an ongoing shift entry for a user
 * @access  Private (Employee)
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export const endShift = async (req, res) => {
  try {
    const employeeId = req.employee?.id;
    const { _id, endTime, endLocation, notes = '' } = req.body;

    if (!employeeId || !_id || !endTime || !endLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingShift = await Shift.findOne({ _id, employeeId });

    if (!existingShift || !existingShift.startTime) {
      return res.status(404).json({ message: 'Shift not found or missing start time' });
    }

    const shiftDurationMs = new Date(endTime) - new Date(existingShift.startTime);
    const shiftHours = formatDuration(shiftDurationMs);

    const shift = await Shift.findOneAndUpdate(
      { _id: _id, employeeId: employeeId },
      {
        endTime,
        endLocation,
        notes,
        shiftHours,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Your work session has been recorded successfully.',
      shift,
    });
  } catch (error) {
    console.error('Error ending shift:', error);
    return res.status(500).json({ message: 'Server error while ending shift' });
  }
};


/**
* @route   PUT /api/shifts/break/start
* @desc    Start a break manually or at current time
* @access  Private (Employee)
*/

export const startBreak = async (req, res) => {
  try {
    const employeeId = req.employee?.id;
    const { id: shiftId, type, startTime } = req.body;

    if (!employeeId || !shiftId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const shift = await Shift.findOne({ _id: shiftId, employeeId });

    if (!shift || shift.endTime) {
      return res.status(404).json({
        success: false,
        message: 'Active shift not found',
      });
    }

    const activeBreak = shift.breaks.find((brk) => brk.endTime === null);
    if (activeBreak) {
      return res.status(400).json({
        success: false,
        message: 'An active break is already in progress',
      });
    }

    const breakStartTime = startTime ? new Date(startTime) : new Date();

    const newBreak = {
      startTime: breakStartTime,
      type,
    };

    shift.breaks.push(newBreak);
    const updatedShift = await shift.save(); 

    return res.status(200).json({
      success: true,
      message: 'Break started successfully',
      shift: updatedShift, 
    });
  } catch (error) {
    console.error('Error starting break:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while starting break',
    });
  }
};





/**
 * @route   PUT /api/shifts/break/end
 * @desc    End the active break for a shift
 * @access  Private (Employee)
 */
export const endBreak = async (req, res) => {
  try {
    const employeeId = req.employee?.id;
    const { id: shiftId, endTime } = req.body;
    if (!employeeId || !shiftId || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const shift = await Shift.findOne({ _id: shiftId, employeeId });

    if (!shift || shift.endTime) {
      return res.status(404).json({
        success: false,
        message: 'Active shift not found',
      });
    }

    // Find the active break (break with no endTime)
    const activeBreak = shift.breaks.find((brk) => !brk.endTime);

    if (!activeBreak) {
      return res.status(400).json({
        success: false,
        message: 'No active break found',
      });
    }

    activeBreak.endTime = endTime ? new Date(endTime) : new Date();

    const updatedShift = await shift.save();

    return res.status(200).json({
      success: true,
      message: 'Welcome back! Your work session has resumed.',
      shift: updatedShift,
    });
  } catch (error) {
    console.error('Error ending break:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while ending break',
    });
  }
};




/**
 * @route   GET /api/shifts/user/:employeeId
 * @desc    Get all shifts for a specific user (optional filter: only active)
 * @access  Private (Employee or Admin)
 */
export const getUserShifts = async (req, res) => {
  try {
    const employeeId = req.employee?.id;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    // Optionally filter by ongoing only via query param
    const { activeOnly } = req.query;
    const filter = { employeeId };
    if (activeOnly === 'true') {
      filter.endTime = null;
    }

    const shifts = await Shift.find(filter).sort({ startTime: -1 });

    return res.status(200).json({
      success: true,
      shifts,
    });
  } catch (error) {
    console.error('Error fetching user shifts:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user shifts',
    });
  }
};


/**
 * @route   GET /api/shifts/history
 * @desc    Get completed shift history for the logged-in employee
 * @access  Private (Employee)
 */
export const getEmployeeShiftHistory = async (req, res) => {
  try {
    const employeeId = req.employee?.id;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const completedShifts = await Shift.find({
      employeeId,
      endTime: { $ne: null }
    }).sort({ startTime: -1 });

    return res.status(200).json({
      success: true,
      message: 'Completed shift history retrieved successfully',
      shifts: completedShifts
    });
  } catch (error) {
    console.error('Error fetching shift history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching shift history'
    });
  }
};


/**
 * @route   Post /api/shifts/admin/employee/history
 * @desc    Get completed shift history for the All employee
 * @access  Private (Employee)
 */
export const getAdminViewShiftHistory = async (req, res) => {
  try {
    const { id: employeeId} = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const completedShifts = await Shift.find({
      employeeId,
      endTime: { $ne: null }
    }).sort({ startTime: -1 });

    return res.status(200).json({
      success: true,
      message: 'Completed shift history retrieved successfully',
      shifts: completedShifts
    });
  } catch (error) {
    console.error('Error fetching shift history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching shift history'
    });
  }
};




/**
 * @route   GET /api/shifts/all
 * @desc    Get all employee shifts with check-in/out times, duration, and locations
 * @access  Private (Admin)
 */
export const getAllEmployeeShifts = async (req, res) => {
  try {
    // You could enhance this with query filters: by date, employeeId, projectId, etc.
    const shifts = await Shift.find()
      .populate('employeeId', 'name email') // Optional: populate employee info
      .sort({ date: -1, startTime: -1 });

    return res.status(200).json({
      success: true,
      message: 'All employee shifts retrieved successfully',
      shifts: shifts.map(shift => ({
        employee: shift.employeeId,
        date: shift.date,
        checkIn: shift.startTime,
        checkOut: shift.endTime,
        duration: shift.shiftHours,
        startLocation: shift.startLocation,
        endLocation: shift.endLocation,
        projectId: shift.projectId,
        notes: shift.notes || '',
      }))
    });
  } catch (error) {
    console.error('Error fetching all employee shifts:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching shifts'
    });
  }
};
