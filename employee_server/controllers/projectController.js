import Project from '../models/Project.js';
import Employee from '../models/Employee.js';

/**
 * @route   POST /api/auth/projects/create
 * @desc    Create a new project
 * @access  Private (Employee)
 */
export const createProject = async (req, res) => {
  try {
    const {
      taskName,
      description,
      startDate,
      endDate,
      process,
      status,
      priority,
      assignedTo,
    } = req.body;

    // Validate required fields
    if (!taskName || !description || !startDate || !endDate || !process || !status || !priority || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Check for duplicate task name
    const existingProject = await Project.findOne({ taskName });
    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: 'A project with this task name already exists.',
      });
    }

    // Find assigned employee by username
    const assignedEmployee = await Employee.findOne({ name: assignedTo });
    if (!assignedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Assigned employee not found.',
      });
    }

    // Create and save the new project
    const newProject = new Project({
      userId: req.employeeId,
      taskName,
      description,
      startDate,
      endDate,
      process,
      status,
      priority,
      assignedTo,
    });

    await newProject.save();

    return res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project: newProject,
    });
  } catch (error) {
    console.error('[Create Project Error]:', error.message);

    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the project.',
    });
  }
};


/**
 * @route   GET /api/auth/projects/employee
 * @desc    Get all projects created by the current employee
 * @access  Private (Employee)
 */
export const getEmployeeProjects = async (req, res) => {
  try {
    const employeeId = req.employeeId;

    const projects = await Project.find({ userId: employeeId });

    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully for current employee.',
      projects,
    });
  } catch (error) {
    console.error('[Get Employee Projects Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee projects.',
    });
  }
};



/**
 * @route   GET /api/auth/project/:id
 * @desc    Get a single project by ID
 * @access  Private (Employee)
 */

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project fetched successfully.',
      project,
    });
  } catch (error) {
    console.error('[Get Project By ID Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch the project.',
    });
  }
};


/**
 * @route   PUT /api/auth/project/:id
 * @desc    Update specific fields of a project (priority, description, process, endDate)
 * @access  Private (Employee)
 */

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, description, process, endDate } = req.body;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (priority) project.priority = priority;
    if (description) project.description = description;
    if (process) project.process = process;
    if (endDate) project.endDate = endDate;

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    console.error('[Update Project Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update the project.',
    });
  }
};
