import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import {
  createProject,
  getEmployeeProjects,
  getProjectById,
  updateProject
} from '../controllers/projectController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/project/create
 * @desc    Create a new project
 * @access  Private (Employee)
 */
router.post('/create', authEmployee, authorizeRole('employee'), createProject);

/**
 * @route   GET /api/auth/project/employee
 * @desc    Get all projects
 * @access  Private (Employee)
 */
router.get('/employee', authEmployee, authorizeRole('employee'), getEmployeeProjects);

/**
 * @route   GET /api/auth/project/:id
 * @desc    Get a single project by ID
 * @access  Private (Employee)
 */
router.get('/:id', authEmployee, authorizeRole('employee'), getProjectById);

/**
 * @route   Put /api/auth/project/:id
 * @desc    Update a single project by ID
 * @access  Private (Employee)
 */
router.put('/:id', authEmployee, authorizeRole('employee'), updateProject);

export default router;
