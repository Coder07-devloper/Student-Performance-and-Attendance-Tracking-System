/**
 * Student Routes
 * 
 * This file defines all the API endpoints (URLs) for student operations.
 * Routes are like the "addresses" that clients use to access different features.
 */

const express = require('express');
const router = express.Router();

// Import controller functions (the actual business logic)
const {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByRollNumber
} = require('../controllers/studentController');

/**
 * Route Definitions:
 * 
 * POST   /api/students              - Create a new student
 * GET    /api/students              - Get all students
 * GET    /api/students/:id          - Get student by ID
 * GET    /api/students/roll/:rollNumber - Get student by roll number
 */

// Create a new student
router.post('/', createStudent);

// Get all students
router.get('/', getAllStudents);

// Get student by ID
router.get('/:id', getStudentById);

// Get student by roll number (must be before /:id route to avoid conflicts)
router.get('/roll/:rollNumber', getStudentByRollNumber);

module.exports = router;

