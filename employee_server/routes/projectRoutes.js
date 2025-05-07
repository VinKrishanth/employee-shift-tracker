import express from 'express';
import authEmployee from '../middlewares/authEmployee.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import {
  createProject,
  getEmployeeProjects,
  getProjectById,
} from '../controllers/projectController.js';

const router = express.Router();

/**
 * @route   POST /api/projects/create
 * @desc    Create a new project
 * @access  Private (Employee)
 */
router.post('/create', authEmployee, authorizeRole('employee'), createProject);

/**
 * @route   GET /api/projects/employee
 * @desc    Get all projects
 * @access  Private (Employee)
 */
router.get('/employee', authEmployee, authorizeRole('employee'), getEmployeeProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Private (Employee)
 */
router.get('/:id', authEmployee, authorizeRole('employee'), getProjectById);

export default router;
