/**
 * API Service Layer
 * 
 * This file contains all functions to communicate with the backend API.
 * It centralizes all API calls, making it easier to maintain and update.
 */

const API_BASE_URL = 'http://localhost:5000/api'

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong')
    }

    return result
  } catch (error) {
    throw error
  }
}

/**
 * Student API Functions
 */
export const studentAPI = {
  // Get all students
  getAll: () => apiRequest('/students'),

  // Get student by ID
  getById: (id) => apiRequest(`/students/${id}`),

  // Get student by roll number
  getByRollNumber: (rollNumber) => apiRequest(`/students/roll/${rollNumber}`),

  // Create a new student
  create: (studentData) => apiRequest('/students', 'POST', studentData),
}

/**
 * Performance API Functions
 */
export const performanceAPI = {
  // Add or update marks for a student
  addMarks: (studentId, marks) => 
    apiRequest(`/performance/marks/${studentId}`, 'POST', { marks }),

  // Add or update attendance for a student
  addAttendance: (studentId, attendancePercentage) => 
    apiRequest(`/performance/attendance/${studentId}`, 'POST', { attendancePercentage }),

  // Get performance summary for a student
  getSummary: (studentId) => 
    apiRequest(`/performance/summary/${studentId}`),

  // Get students with low attendance
  getLowAttendance: (threshold = 75) => 
    apiRequest(`/performance/low-attendance?threshold=${threshold}`),
}

