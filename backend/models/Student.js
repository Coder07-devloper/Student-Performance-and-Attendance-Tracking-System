/**
 * Student Model (Schema)
 * 
 * This defines the structure of student data in MongoDB.
 * Each student document will have: name, rollNumber, class, section
 */

const mongoose = require('mongoose');

// Define the Student Schema
// Schema is like a blueprint that tells MongoDB what fields each student document should have
const studentSchema = new mongoose.Schema({
  // Student's full name
  name: {
    type: String,
    required: [true, 'Student name is required'], // This field must be provided
    trim: true // Removes extra spaces from beginning and end
  },
  
  // Unique roll number to identify each student
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true, // No two students can have the same roll number
    trim: true
  },
  
  // Class/Grade (e.g., "10th", "12th", "9th")
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  
  // Section (e.g., "A", "B", "C")
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true // Always store as uppercase (A, B, C)
  },
  
  // Automatically add creation date
  createdAt: {
    type: Date,
    default: Date.now // Set to current date/time when student is created
  }
}, {
  // Schema options
  timestamps: false // We're manually handling createdAt, so disable automatic timestamps
});

// Create and export the Student model
// This model allows us to perform CRUD operations on the 'students' collection
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

