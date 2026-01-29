/**
 * Performance Utility Functions
 * 
 * These are helper functions used to calculate and classify student performance.
 * Keeping them separate makes the code reusable and easier to test.
 */

/**
 * Calculate average marks from an object of subject marks
 * 
 * @param {Object|Map} marks - Object or Map containing subject names and marks
 * @returns {Number} - Average marks rounded to 2 decimal places
 * 
 * Example:
 * calculateAverage({ math: 85, science: 90, english: 75 })
 * Returns: 83.33
 */
const calculateAverage = (marks) => {
  // Handle both Map and Object types
  const marksArray = marks instanceof Map 
    ? Array.from(marks.values()) 
    : Object.values(marks);
  
  // If no marks provided, return 0
  if (marksArray.length === 0) {
    return 0;
  }
  
  // Calculate sum of all marks
  const sum = marksArray.reduce((total, mark) => total + mark, 0);
  
  // Calculate average and round to 2 decimal places
  const average = sum / marksArray.length;
  return Math.round(average * 100) / 100; // Round to 2 decimal places
};

/**
 * Classify performance status based on average marks
 * 
 * Business Rules:
 * - Excellent: >= 90
 * - Good: >= 75 and < 90
 * - Average: >= 60 and < 75
 * - Poor: < 60
 * 
 * @param {Number} averageMarks - Average marks of the student
 * @returns {String} - Performance status
 */
const classifyPerformance = (averageMarks) => {
  if (averageMarks >= 90) {
    return 'Excellent';
  } else if (averageMarks >= 75) {
    return 'Good';
  } else if (averageMarks >= 60) {
    return 'Average';
  } else {
    return 'Poor';
  }
};

/**
 * Check if attendance is low based on threshold
 * 
 * @param {Number} attendancePercentage - Student's attendance percentage
 * @param {Number} threshold - Minimum acceptable attendance (default: 75)
 * @returns {Boolean} - True if attendance is below threshold
 */
const isLowAttendance = (attendancePercentage, threshold = 75) => {
  return attendancePercentage < threshold;
};

module.exports = {
  calculateAverage,
  classifyPerformance,
  isLowAttendance
};

