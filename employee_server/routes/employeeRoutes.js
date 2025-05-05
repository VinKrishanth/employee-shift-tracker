import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import {
  login,
  logout,
  getAuthenticatedEmployee
} from '../controllers/employeeController.js'; 

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', login);


// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authEmployee, logout); 


/**
 * @route   GET /api/employees/me
 * @desc    Check user authentication status (used in frontend to auto-login)
 * @access  Private
 */
router.get('/employees/me', authEmployee, authorizeRole('employee') , getAuthenticatedEmployee);


/**
 * @route   GET /api/employees/me
 * @desc    Check user authentication status (used in frontend to auto-login)
 * @access  Private
 */
router.get('/admins/me', authEmployee, authorizeRole('admin') , getAuthenticatedEmployee); 


export default router;