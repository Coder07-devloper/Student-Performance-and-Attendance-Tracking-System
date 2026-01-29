/**
 * Express Server Setup
 * 
 * This is the main entry point of the application.
 * It sets up the Express server, connects to MongoDB, and registers all routes.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const performanceRoutes = require('./routes/performanceRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// CORS allows frontend to make requests to this backend
app.use(cors());

// Body parser middleware - allows us to read JSON from request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Student Performance and Attendance Tracking System API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      performance: '/api/performance'
    }
  });
});

// Register routes
// All student-related routes will be prefixed with /api/students
app.use('/api/students', studentRoutes);

// All performance-related routes will be prefixed with /api/performance
app.use('/api/performance', performanceRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (catches any unhandled errors)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Get port from environment variable or use default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   - Students: http://localhost:${PORT}/api/students`);
  console.log(`   - Performance: http://localhost:${PORT}/api/performance`);
});

