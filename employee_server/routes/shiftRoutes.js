import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import { startShift, endShift, startBreak, endBreak } from '../controllers/shiftController.js';

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

export default router;
