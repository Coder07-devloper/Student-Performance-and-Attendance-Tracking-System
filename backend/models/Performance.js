/**
 * Performance Model (Schema)
 * 
 * This stores academic performance data for each student:
 * - Marks for different subjects
 * - Attendance percentage
 * - Calculated average marks
 * - Performance status (Excellent, Good, Average, Poor)
 */

const mongoose = require('mongoose');

// Define the Performance Schema
const performanceSchema = new mongoose.Schema({
  // Reference to the Student model
  // This creates a relationship between Student and Performance
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB's unique ID type
    ref: 'Student', // Reference to Student model
    required: [true, 'Student ID is required'],
    unique: true // Each student can have only one performance record
  },
  
  // Marks stored as an object where keys are subject names and values are marks
  // Example: { math: 85, science: 90, english: 78 }
  marks: {
    type: mongoose.Schema.Types.Mixed, // Mixed type allows flexible object structure
    default: {} // Default to empty object
  },
  
  // Attendance percentage (0 to 100)
  attendancePercentage: {
    type: Number,
    required: [true, 'Attendance percentage is required'],
    min: [0, 'Attendance cannot be negative'],
    max: [100, 'Attendance cannot exceed 100%']
  },
  
  // Average marks (calculated automatically)
  averageMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Performance status based on average marks
  // Values: "Excellent", "Good", "Average", "Poor"
  performanceStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'], // Only these values allowed
    default: 'Poor'
  },
  
  // Last update timestamp
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Create and export the Performance model
const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;

