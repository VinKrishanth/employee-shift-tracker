import Employee from '../models/Employee.js';  
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { cookieOptions } from '../utils/cookieOptions.js';


export const register = async (req, res) => {
  try {
    const {
      salutation, name, lastName, birthName, email, password, nationality, job,
      street, city, pinCode, telephoneNumber,
      branchName, accountNumber, bankName
    } = req.body;

    if (
      !salutation || !name || !lastName || !birthName || !email || !password ||
      !nationality || !job || !street || !city || !pinCode || !telephoneNumber 
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'User already exists.'
      });
    }

    const employee = await Employee.create({
      salutation,
      name,
      lastName,
      birthName,
      email,
      password,
      nationality,
      job,
      telephoneNumber,
      address: {
        street,
        city,
        pinCode,
      },
      bankDetails: {
        branchName,
        accountNumber,
        bankName,
      }
    });


    const employeeResponse = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    return res.status(201).json({
      success: true,
      user: employeeResponse,
      message: 'Employee information has been saved successfully',
    });
  } catch (error) {
    console.error('[Register Error]:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};





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


/**
 * @route   GET /api/auth/employees/profile
 * @desc    Returns the authenticated employee's full profile
 * @access  Private (Employee or Admin)
 */
export const getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.employee?.id;

    const employee = await Employee.findById(employeeId).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      profile: employee,
    });

  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee profile',
    });
  }
};


/**
 * @route   GET /api/auth/employees/allProfile
 * @desc    Returns all employee profiles (excluding admins)
 * @access  Private (Admin only)
 */
export const getAllEmployeeProfiles = async (req, res) => {
  try {
    const employees = await Employee.find({ role: { $ne: 'admin' } }).select('-password');

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });

  } catch (error) {
    console.error('[Get All Profiles Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee profiles',
    });
  }
};
