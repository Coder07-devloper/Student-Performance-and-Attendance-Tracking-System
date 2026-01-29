/**
 * Performance Controller
 * 
 * This file contains business logic for performance-related operations:
 * - Adding/updating marks
 * - Adding/updating attendance
 * - Calculating averages and performance status
 * - Fetching performance summaries
 */

const Performance = require('../models/Performance');
const Student = require('../models/Student');
const { calculateAverage, classifyPerformance, isLowAttendance } = require('../utils/performanceUtils');

/**
 * Add or update marks for a student
 * POST /api/performance/marks/:studentId
 */
const addMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { marks } = req.body;

    // Validate input
    if (!marks || typeof marks !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Please provide marks as an object (e.g., {math: 85, science: 90})'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Validate marks (all values must be numbers between 0 and 100)
    const marksArray = Object.entries(marks);
    for (const [subject, mark] of marksArray) {
      if (typeof mark !== 'number' || mark < 0 || mark > 100) {
        return res.status(400).json({
          success: false,
          message: `Invalid marks for ${subject}. Marks must be a number between 0 and 100.`
        });
      }
    }

    // Calculate average marks
    const averageMarks = calculateAverage(marks);

    // Classify performance status
    const performanceStatus = classifyPerformance(averageMarks);

    // Find existing performance record or create new one
    let performance = await Performance.findOne({ studentId });

    if (performance) {
      // Update existing record
      // Merge new marks with existing marks
      performance.marks = { ...performance.marks, ...marks };
      performance.averageMarks = averageMarks;
      performance.performanceStatus = performanceStatus;
      performance.lastUpdated = new Date();
      await performance.save();
    } else {
      // Create new performance record
      performance = await Performance.create({
        studentId,
        marks: marks, // Store as plain object
        averageMarks,
        performanceStatus,
        attendancePercentage: 0 // Default attendance, can be updated later
      });
    }

    res.status(200).json({
      success: true,
      message: 'Marks updated successfully',
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating marks',
      error: error.message
    });
  }
};

/**
 * Add or update attendance for a student
 * POST /api/performance/attendance/:studentId
 */
const addAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { attendancePercentage } = req.body;

    // Validate input
    if (attendancePercentage === undefined || attendancePercentage === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide attendancePercentage (0-100)'
      });
    }

    if (typeof attendancePercentage !== 'number' || attendancePercentage < 0 || attendancePercentage > 100) {
      return res.status(400).json({
        success: false,
        message: 'Attendance percentage must be a number between 0 and 100'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find existing performance record or create new one
    let performance = await Performance.findOne({ studentId });

    if (performance) {
      // Update attendance
      performance.attendancePercentage = attendancePercentage;
      performance.lastUpdated = new Date();
      await performance.save();
    } else {
      // Create new performance record with default values
      performance = await Performance.create({
        studentId,
        marks: new Map(),
        attendancePercentage,
        averageMarks: 0,
        performanceStatus: 'Poor'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message
    });
  }
};

/**
 * Get complete performance summary for a student
 * GET /api/performance/summary/:studentId
 */
const getPerformanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find performance record
    const performance = await Performance.findOne({ studentId });

    // If no performance record exists, return student info with default values
    if (!performance) {
      return res.status(200).json({
        success: true,
        data: {
          student: {
            id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            class: student.class,
            section: student.section
          },
          performance: {
            marks: {},
            averageMarks: 0,
            attendancePercentage: 0,
            performanceStatus: 'No data available',
            hasData: false
          }
        }
      });
    }

    // Marks are already stored as object, so use directly
    const marksObject = performance.marks || {};

    // Check if attendance is low
    const lowAttendance = isLowAttendance(performance.attendancePercentage);

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          class: student.class,
          section: student.section
        },
        performance: {
          marks: marksObject,
          averageMarks: performance.averageMarks,
          attendancePercentage: performance.attendancePercentage,
          performanceStatus: performance.performanceStatus,
          lowAttendance: lowAttendance,
          lastUpdated: performance.lastUpdated,
          hasData: true
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance summary',
      error: error.message
    });
  }
};

/**
 * Get all students with low attendance
 * GET /api/performance/low-attendance?threshold=75
 */
const getLowAttendanceStudents = async (req, res) => {
  try {
    // Get threshold from query parameter (default: 75)
    const threshold = parseFloat(req.query.threshold) || 75;

    // Validate threshold
    if (threshold < 0 || threshold > 100) {
      return res.status(400).json({
        success: false,
        message: 'Threshold must be between 0 and 100'
      });
    }

    // Find all performance records with attendance below threshold
    const lowAttendanceRecords = await Performance.find({
      attendancePercentage: { $lt: threshold } // MongoDB query: less than threshold
    }).populate('studentId', 'name rollNumber class section'); // Populate student details

    // Format response
    const students = lowAttendanceRecords.map(record => ({
      student: {
        id: record.studentId._id,
        name: record.studentId.name,
        rollNumber: record.studentId.rollNumber,
        class: record.studentId.class,
        section: record.studentId.section
      },
      attendancePercentage: record.attendancePercentage,
      performanceStatus: record.performanceStatus
    }));

    res.status(200).json({
      success: true,
      threshold: threshold,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low attendance students',
      error: error.message
    });
  }
};

module.exports = {
  addMarks,
  addAttendance,
  getPerformanceSummary,
  getLowAttendanceStudents
};

