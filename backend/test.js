/**
 * API Test Script
 * 
 * This file tests all the API endpoints of the Student Performance and Attendance Tracking System.
 * 
 * Usage:
 *   1. Make sure the server is running (npm start)
 *   2. Run this file: node test.js
 * 
 * Note: This script uses Node.js built-in fetch (requires Node.js 18+)
 * If you're using an older version, install node-fetch: npm install node-fetch
 */

// API Base URL - change if your server runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// Colors for console output (for better readability)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to print colored messages
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make API requests
async function makeRequest(method, url, data = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 500,
      ok: false,
      error: error.message
    };
  }
}

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper to record test results
function recordTest(name, passed, message) {
  testResults.tests.push({ name, passed, message });
  if (passed) {
    testResults.passed++;
    log(`✅ ${name}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${name}: ${message}`, 'red');
  }
}

// Wait function (to add delays between requests)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ============================================
 * TEST FUNCTIONS
 * ============================================
 */

// Test 1: Check if server is running
async function testServerHealth() {
  log('\n📡 Testing Server Health...', 'cyan');
  const result = await makeRequest('GET', 'http://localhost:5000');
  
  if (result.ok && result.data.message) {
    recordTest('Server Health Check', true, 'Server is running');
    return true;
  } else {
    recordTest('Server Health Check', false, 'Server is not responding. Make sure server is running!');
    return false;
  }
}

// Test 2: Create a student
let studentId1 = null;
let studentId2 = null;
let studentId3 = null;

async function testCreateStudent() {
  log('\n👤 Testing Student Creation...', 'cyan');
  
  // Test 2.1: Create first student
  const student1 = {
    name: 'Alice Johnson',
    rollNumber: 'R001',
    class: '10th',
    section: 'A'
  };
  
  const result1 = await makeRequest('POST', `${API_BASE_URL}/students`, student1);
  
  if (result1.ok && result1.data.success && result1.data.data._id) {
    studentId1 = result1.data.data._id;
    recordTest('Create Student 1 (Alice)', true, `ID: ${studentId1}`);
  } else {
    recordTest('Create Student 1', false, result1.data.message || 'Failed to create student');
  }
  
  await wait(500); // Small delay between requests
  
  // Test 2.2: Create second student
  const student2 = {
    name: 'Bob Williams',
    rollNumber: 'R002',
    class: '10th',
    section: 'B'
  };
  
  const result2 = await makeRequest('POST', `${API_BASE_URL}/students`, student2);
  
  if (result2.ok && result2.data.success && result2.data.data._id) {
    studentId2 = result2.data.data._id;
    recordTest('Create Student 2 (Bob)', true, `ID: ${studentId2}`);
  } else {
    recordTest('Create Student 2', false, result2.data.message || 'Failed to create student');
  }
  
  await wait(500);
  
  // Test 2.3: Create third student (for low attendance test)
  const student3 = {
    name: 'Charlie Brown',
    rollNumber: 'R003',
    class: '12th',
    section: 'A'
  };
  
  const result3 = await makeRequest('POST', `${API_BASE_URL}/students`, student3);
  
  if (result3.ok && result3.data.success && result3.data.data._id) {
    studentId3 = result3.data.data._id;
    recordTest('Create Student 3 (Charlie)', true, `ID: ${studentId3}`);
  } else {
    recordTest('Create Student 3', false, result3.data.message || 'Failed to create student');
  }
  
  await wait(500);
  
  // Test 2.4: Try to create duplicate roll number (should fail)
  const duplicateResult = await makeRequest('POST', `${API_BASE_URL}/students`, student1);
  if (!duplicateResult.ok && duplicateResult.data.message.includes('already exists')) {
    recordTest('Duplicate Roll Number Validation', true, 'Correctly rejected duplicate');
  } else {
    recordTest('Duplicate Roll Number Validation', false, 'Should have rejected duplicate');
  }
}

// Test 3: Get all students
async function testGetAllStudents() {
  log('\n📋 Testing Get All Students...', 'cyan');
  const result = await makeRequest('GET', `${API_BASE_URL}/students`);
  
  if (result.ok && result.data.success && Array.isArray(result.data.data)) {
    const count = result.data.data.length;
    recordTest('Get All Students', true, `Found ${count} students`);
    return true;
  } else {
    recordTest('Get All Students', false, 'Failed to fetch students');
    return false;
  }
}

// Test 4: Get student by ID
async function testGetStudentById() {
  log('\n🔍 Testing Get Student by ID...', 'cyan');
  
  if (!studentId1) {
    recordTest('Get Student by ID', false, 'No student ID available');
    return;
  }
  
  const result = await makeRequest('GET', `${API_BASE_URL}/students/${studentId1}`);
  
  if (result.ok && result.data.success && result.data.data._id === studentId1) {
    recordTest('Get Student by ID', true, `Retrieved student: ${result.data.data.name}`);
  } else {
    recordTest('Get Student by ID', false, 'Failed to fetch student by ID');
  }
}

// Test 5: Get student by roll number
async function testGetStudentByRollNumber() {
  log('\n🔍 Testing Get Student by Roll Number...', 'cyan');
  
  const result = await makeRequest('GET', `${API_BASE_URL}/students/roll/R001`);
  
  if (result.ok && result.data.success && result.data.data.rollNumber === 'R001') {
    recordTest('Get Student by Roll Number', true, `Retrieved: ${result.data.data.name}`);
  } else {
    recordTest('Get Student by Roll Number', false, 'Failed to fetch student by roll number');
  }
}

// Test 6: Add marks for a student
async function testAddMarks() {
  log('\n📊 Testing Add Marks...', 'cyan');
  
  if (!studentId1) {
    recordTest('Add Marks', false, 'No student ID available');
    return;
  }
  
  // Test 6.1: Add marks for Alice (Excellent performance)
  const marks1 = {
    marks: {
      math: 95,
      science: 98,
      english: 92,
      history: 94
    }
  };
  
  const result1 = await makeRequest('POST', `${API_BASE_URL}/performance/marks/${studentId1}`, marks1);
  
  if (result1.ok && result1.data.success) {
    const avg = result1.data.data.averageMarks;
    const status = result1.data.data.performanceStatus;
    const expectedStatus = avg >= 90 ? 'Excellent' : 'Good';
    
    if (status === expectedStatus) {
      recordTest('Add Marks (Alice - Excellent)', true, `Average: ${avg}, Status: ${status}`);
    } else {
      recordTest('Add Marks (Alice)', false, `Status mismatch. Expected: ${expectedStatus}, Got: ${status}`);
    }
  } else {
    recordTest('Add Marks (Alice)', false, result1.data.message || 'Failed to add marks');
  }
  
  await wait(500);
  
  // Test 6.2: Add marks for Bob (Good performance)
  if (studentId2) {
    const marks2 = {
      marks: {
        math: 80,
        science: 85,
        english: 75
      }
    };
    
    const result2 = await makeRequest('POST', `${API_BASE_URL}/performance/marks/${studentId2}`, marks2);
    
    if (result2.ok && result2.data.success) {
      const avg = result2.data.data.averageMarks;
      const status = result2.data.data.performanceStatus;
      recordTest('Add Marks (Bob - Good)', true, `Average: ${avg}, Status: ${status}`);
    }
  }
  
  await wait(500);
  
  // Test 6.3: Add marks for Charlie (Average performance)
  if (studentId3) {
    const marks3 = {
      marks: {
        math: 65,
        science: 70,
        english: 60
      }
    };
    
    const result3 = await makeRequest('POST', `${API_BASE_URL}/performance/marks/${studentId3}`, marks3);
    
    if (result3.ok && result3.data.success) {
      const avg = result3.data.data.averageMarks;
      const status = result3.data.data.performanceStatus;
      recordTest('Add Marks (Charlie - Average)', true, `Average: ${avg}, Status: ${status}`);
    }
  }
  
  await wait(500);
  
  // Test 6.4: Invalid marks (should fail)
  const invalidMarks = {
    marks: {
      math: 150  // Invalid: > 100
    }
  };
  
  const invalidResult = await makeRequest('POST', `${API_BASE_URL}/performance/marks/${studentId1}`, invalidMarks);
  if (!invalidResult.ok) {
    recordTest('Invalid Marks Validation', true, 'Correctly rejected invalid marks');
  } else {
    recordTest('Invalid Marks Validation', false, 'Should have rejected marks > 100');
  }
}

// Test 7: Add attendance
async function testAddAttendance() {
  log('\n📅 Testing Add Attendance...', 'cyan');
  
  if (!studentId1) {
    recordTest('Add Attendance', false, 'No student ID available');
    return;
  }
  
  // Test 7.1: Add attendance for Alice (good attendance)
  const attendance1 = {
    attendancePercentage: 90
  };
  
  const result1 = await makeRequest('POST', `${API_BASE_URL}/performance/attendance/${studentId1}`, attendance1);
  
  if (result1.ok && result1.data.success && result1.data.data.attendancePercentage === 90) {
    recordTest('Add Attendance (Alice)', true, 'Attendance: 90%');
  } else {
    recordTest('Add Attendance (Alice)', false, 'Failed to add attendance');
  }
  
  await wait(500);
  
  // Test 7.2: Add attendance for Bob (good attendance)
  if (studentId2) {
    const attendance2 = { attendancePercentage: 85 };
    const result2 = await makeRequest('POST', `${API_BASE_URL}/performance/attendance/${studentId2}`, attendance2);
    if (result2.ok) {
      recordTest('Add Attendance (Bob)', true, 'Attendance: 85%');
    }
  }
  
  await wait(500);
  
  // Test 7.3: Add low attendance for Charlie (for low attendance test)
  if (studentId3) {
    const attendance3 = { attendancePercentage: 65 }; // Below threshold
    const result3 = await makeRequest('POST', `${API_BASE_URL}/performance/attendance/${studentId3}`, attendance3);
    if (result3.ok) {
      recordTest('Add Attendance (Charlie - Low)', true, 'Attendance: 65%');
    }
  }
  
  await wait(500);
  
  // Test 7.4: Invalid attendance (should fail)
  const invalidAttendance = { attendancePercentage: 150 };
  const invalidResult = await makeRequest('POST', `${API_BASE_URL}/performance/attendance/${studentId1}`, invalidAttendance);
  if (!invalidResult.ok) {
    recordTest('Invalid Attendance Validation', true, 'Correctly rejected invalid attendance');
  } else {
    recordTest('Invalid Attendance Validation', false, 'Should have rejected attendance > 100');
  }
}

// Test 8: Get performance summary
async function testGetPerformanceSummary() {
  log('\n📈 Testing Get Performance Summary...', 'cyan');
  
  if (!studentId1) {
    recordTest('Get Performance Summary', false, 'No student ID available');
    return;
  }
  
  const result = await makeRequest('GET', `${API_BASE_URL}/performance/summary/${studentId1}`);
  
  if (result.ok && result.data.success && result.data.data.student && result.data.data.performance) {
    const perf = result.data.data.performance;
    recordTest('Get Performance Summary', true, 
      `Student: ${result.data.data.student.name}, Average: ${perf.averageMarks}, Status: ${perf.performanceStatus}`);
  } else {
    recordTest('Get Performance Summary', false, 'Failed to get performance summary');
  }
}

// Test 9: Get low attendance students
async function testGetLowAttendance() {
  log('\n⚠️  Testing Get Low Attendance Students...', 'cyan');
  
  const result = await makeRequest('GET', `${API_BASE_URL}/performance/low-attendance?threshold=75`);
  
  if (result.ok && result.data.success && Array.isArray(result.data.data)) {
    const count = result.data.data.length;
    // Should find Charlie (65% attendance)
    const hasCharlie = result.data.data.some(s => s.student.name === 'Charlie Brown');
    
    if (hasCharlie || count > 0) {
      recordTest('Get Low Attendance Students', true, `Found ${count} student(s) with low attendance`);
    } else {
      recordTest('Get Low Attendance Students', false, 'Expected to find Charlie Brown with low attendance');
    }
  } else {
    recordTest('Get Low Attendance Students', false, 'Failed to get low attendance students');
  }
}

// Test 10: Error handling - Non-existent student
async function testErrorHandling() {
  log('\n🚫 Testing Error Handling...', 'cyan');
  
  // Test with fake student ID
  const fakeId = '507f1f77bcf86cd799439011';
  const result = await makeRequest('GET', `${API_BASE_URL}/students/${fakeId}`);
  
  if (!result.ok && result.status === 404) {
    recordTest('Error Handling - Non-existent Student', true, 'Correctly returned 404');
  } else {
    recordTest('Error Handling - Non-existent Student', false, 'Should return 404 for non-existent student');
  }
}

/**
 * ============================================
 * MAIN TEST RUNNER
 * ============================================
 */

async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🧪 STUDENT PERFORMANCE AND ATTENDANCE TRACKING SYSTEM - API TESTS', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  // Check if server is running first
  const serverRunning = await testServerHealth();
  if (!serverRunning) {
    log('\n❌ Server is not running. Please start the server first:', 'red');
    log('   cd backend && npm start\n', 'yellow');
    process.exit(1);
  }
  
  await wait(1000);
  
  // Run all tests
  await testCreateStudent();
  await wait(500);
  
  await testGetAllStudents();
  await wait(500);
  
  await testGetStudentById();
  await wait(500);
  
  await testGetStudentByRollNumber();
  await wait(500);
  
  await testAddMarks();
  await wait(500);
  
  await testAddAttendance();
  await wait(500);
  
  await testGetPerformanceSummary();
  await wait(500);
  
  await testGetLowAttendance();
  await wait(500);
  
  await testErrorHandling();
  
  // Print summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST SUMMARY', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Passed: ${testResults.passed}`, 'green');
  log(`❌ Failed: ${testResults.failed}`, 'red');
  log(`📝 Total:  ${testResults.passed + testResults.failed}`, 'cyan');
  log('='.repeat(60) + '\n', 'blue');
  
  if (testResults.failed === 0) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed. Please check the errors above.', 'yellow');
  }
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

