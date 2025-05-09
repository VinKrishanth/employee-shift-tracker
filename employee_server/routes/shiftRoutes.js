import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import {
    startShift,
    endShift,
    startBreak,
    endBreak,
    getUserShifts,
    getEmployeeShiftHistory,
    getAdminViewShiftHistory,
    getAllEmployeeShifts
  } from '../controllers/shiftController.js';
  

const router = express.Router();

/**
 * @route   POST  /api/shift/start
 * @desc    Create a new shift
 * @access  Private (Employee)
 */
router.post('/start', authEmployee, authorizeRole('employee'), startShift);

/**
 * @route   POST  /api/shift/end
 * @desc    End an ongoing shift
 * @access  Private (Employee)
 */
router.put('/end', authEmployee, authorizeRole('employee'), endShift);



/**
* @route   PUT /api/shift/break/start
* @desc    Start a break manually or at current time
* @access  Private (Employee)
*/
router.put('/break/start', authEmployee, authorizeRole('employee'), startBreak);

/**
* @route  PUT /api/shifts/break/end
* @desc    End the active break for a shift
* @access  Private (Employee)
*/
router.put('/break/end', authEmployee, authorizeRole('employee'), endBreak);

/**
* @route  PUT /api/shifts
* @desc    Get all shifts for a specific employee
* @access  Private (Employee)
*/
router.get('/', authEmployee, authorizeRole('employee'), getUserShifts);


router.get('/history', authEmployee, authorizeRole('employee'), getEmployeeShiftHistory);

/**
 * @route   Post /api/shifts/admin/employee/history
 * @desc    Get completed shift history for the All employee
 * @access  Private (Employee)
 */

router.post('/admin/employee/history', authEmployee, authorizeRole('admin'), getAdminViewShiftHistory);


/**
 * @route   GET /api/shifts/all
 * @desc    Get all employee shifts with check-in/out times, duration, and locations
 * @access  Private (Admin)
*/
router.get('/all',authEmployee, authorizeRole('admin'), getAllEmployeeShifts);

export default router;
