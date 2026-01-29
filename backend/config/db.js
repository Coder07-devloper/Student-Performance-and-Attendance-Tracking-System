/**
 * MongoDB Database Connection
 * 
 * This file handles the connection to MongoDB using Mongoose.
 * Mongoose is an ODM (Object Data Modeling) library that makes it easy
 * to work with MongoDB in Node.js.
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Function to connect to MongoDB
 * This function is called when the server starts
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-tracking', {
      // These options are recommended for Mongoose 7.x
      // They help with connection stability
    });

    // Log success message with connection details
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the Node.js process with error code 1
  }
};

module.exports = connectDB;

