import Employee from '../models/Employee.js';  
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { cookieOptions } from '../utils/cookieOptions.js';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate employee & get token
 * @access  Public
 */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT token for the employee
    const token = generateToken(employee);

    // Set cookie with the token
    res.cookie('token', token, cookieOptions);

    const employeeResponse = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: employeeResponse,  
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error.' });
  }
};



// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};



/**
 * GET /auth/employees/me
 * GET /auth/admin/me
 * 
 * Returns the authenticated employee's profile.
 * Requires authentication via middleware that populates req.employee.
 */
export const getAuthenticatedEmployee = async (req, res) => {
  try {
    const employeeId = req.employee?.id;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Employee ID not found in token.',
      });
    }

    const employee = await Employee.findById(employeeId).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const employeeResponse = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };
    
    return res.status(200).json({
      success: true,
      user: employeeResponse,
    });

  } catch (error) {
    console.error('[Auth] Failed to fetch authenticated employee:', error);

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};
