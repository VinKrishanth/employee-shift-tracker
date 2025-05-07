import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';

import {
  login,
  logout,
  getAuthenticatedEmployee,
  register,
  getEmployeeProfile,
  getAllEmployeeProfiles
} from '../controllers/employeeController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new employee
// @access  Private (Admin only)
router.post('/register', authEmployee, authorizeRole('admin'), register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', authEmployee, logout);

// @route   GET /api/auth/employees/me
// @desc    Get employee authentication status
// @access  Private (Employee only)
router.get('/employees/me', authEmployee, authorizeRole('employee'), getAuthenticatedEmployee);

// @route   GET /api/auth/admins/me
// @desc    Get admin authentication status
// @access  Private (Admin only)
router.get('/admins/me', authEmployee, authorizeRole('admin'), getAuthenticatedEmployee);

// @route   GET /api/auth/employees/profile
// @desc    Get authenticated employee's profile
// @access  Private
router.get('/employees/profile', authEmployee, authorizeRole('employee'), getEmployeeProfile);

// @route   GET /api/auth/employees/allProfile
// @desc    Get all employee profiles (excluding admins)
// @access  Private (Admin only)
router.get('/employees/allProfile', authEmployee, authorizeRole('admin'), getAllEmployeeProfiles);

export default router;
