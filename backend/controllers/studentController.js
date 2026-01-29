/**
 * Student Controller
 * 
 * This file contains all the business logic for student-related operations.
 * Controllers handle the actual work, while routes just define the endpoints.
 */

const Student = require('../models/Student');

/**
 * Create a new student
 * POST /api/students
 */
const createStudent = async (req, res) => {
  try {
    // Extract data from request body
    const { name, rollNumber, class: studentClass, section } = req.body;

    // Validate required fields
    if (!name || !rollNumber || !studentClass || !section) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, rollNumber, class, section'
      });
    }

    // Check if student with same roll number already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists'
      });
    }

    // Create new student
    const student = await Student.create({
      name,
      rollNumber,
      class: studentClass,
      section
    });

    // Return success response with created student
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

/**
 * Get all students
 * GET /api/students
 */
const getAllStudents = async (req, res) => {
  try {
    // Fetch all students from database
    const students = await Student.find().sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

/**
 * Get a single student by ID
 * GET /api/students/:id
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find student by ID
    const student = await Student.findById(id);

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

/**
 * Get a student by roll number
 * GET /api/students/roll/:rollNumber
 */
const getStudentByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    // Find student by roll number
    const student = await Student.findOne({ rollNumber });

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByRollNumber
};

