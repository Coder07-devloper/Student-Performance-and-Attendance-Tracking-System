/**
 * Performance Routes
 * 
 * This file defines all the API endpoints for performance-related operations.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  addMarks,
  addAttendance,
  getPerformanceSummary,
  getLowAttendanceStudents
} = require('../controllers/performanceController');

/**
 * Route Definitions:
 * 
 * POST   /api/performance/marks/:studentId        - Add/update marks
 * POST   /api/performance/attendance/:studentId   - Add/update attendance
 * GET    /api/performance/summary/:studentId      - Get performance summary
 * GET    /api/performance/low-attendance          - Get students with low attendance
 */

// Add or update marks for a student
router.post('/marks/:studentId', addMarks);

// Add or update attendance for a student
router.post('/attendance/:studentId', addAttendance);

// Get performance summary for a student
router.get('/summary/:studentId', getPerformanceSummary);

// Get students with low attendance
router.get('/low-attendance', getLowAttendanceStudents);

module.exports = router;

