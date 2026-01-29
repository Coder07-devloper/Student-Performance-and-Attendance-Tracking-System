# API Testing Guide

This guide helps you test all the API endpoints using different tools.

## 🛠️ Testing Tools

### Option 1: Postman (Recommended)
1. Download Postman from https://www.postman.com/
2. Create a new collection called "Student Tracking API"
3. Add requests for each endpoint
4. Save and test

### Option 2: Thunder Client (VS Code Extension)
1. Install Thunder Client extension in VS Code
2. Create a new collection
3. Add requests and test directly in VS Code

### Option 3: cURL (Command Line)
Use the examples below in your terminal

### Option 4: Browser
Only works for GET requests - just open the URL in your browser

---

## 📋 Step-by-Step Testing Workflow

### Step 1: Start the Server
```bash
cd backend
npm start
```

### Step 2: Create a Student

**Postman/Thunder Client:**
- Method: `POST`
- URL: `http://localhost:5000/api/students`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "John Doe",
  "rollNumber": "R001",
  "class": "10th",
  "section": "A"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "rollNumber": "R001",
    "class": "10th",
    "section": "A"
  }'
```

**Expected Response:**
- Status: 201 Created
- You'll get the student object with `_id` - **SAVE THIS ID** for next steps!

---

### Step 3: Get All Students

**Postman/Thunder Client:**
- Method: `GET`
- URL: `http://localhost:5000/api/students`

**cURL:**
```bash
curl http://localhost:5000/api/students
```

**Browser:**
Just open: `http://localhost:5000/api/students`

---

### Step 4: Add Marks for the Student

**Postman/Thunder Client:**
- Method: `POST`
- URL: `http://localhost:5000/api/performance/marks/YOUR_STUDENT_ID`
  - Replace `YOUR_STUDENT_ID` with the `_id` from Step 2
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "marks": {
    "math": 85,
    "science": 90,
    "english": 78,
    "history": 82
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/performance/marks/YOUR_STUDENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "marks": {
      "math": 85,
      "science": 90,
      "english": 78,
      "history": 82
    }
  }'
```

**Expected Response:**
- Status: 200 OK
- Check `averageMarks` (should be 83.75)
- Check `performanceStatus` (should be "Good")

---

### Step 5: Add Attendance

**Postman/Thunder Client:**
- Method: `POST`
- URL: `http://localhost:5000/api/performance/attendance/YOUR_STUDENT_ID`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "attendancePercentage": 85
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/performance/attendance/YOUR_STUDENT_ID \
  -H "Content-Type: application/json" \
  -d '{"attendancePercentage": 85}'
```

---

### Step 6: Get Performance Summary

**Postman/Thunder Client:**
- Method: `GET`
- URL: `http://localhost:5000/api/performance/summary/YOUR_STUDENT_ID`

**cURL:**
```bash
curl http://localhost:5000/api/performance/summary/YOUR_STUDENT_ID
```

**Browser:**
Open: `http://localhost:5000/api/performance/summary/YOUR_STUDENT_ID`

**Expected Response:**
- Complete student info + performance data
- Average marks and performance status
- Low attendance flag

---

### Step 7: Test Low Attendance Feature

First, create another student with low attendance:

**Create Student 2:**
```json
{
  "name": "Jane Smith",
  "rollNumber": "R002",
  "class": "10th",
  "section": "B"
}
```

**Add Low Attendance:**
```json
{
  "attendancePercentage": 65
}
```

**Get Low Attendance Students:**
- Method: `GET`
- URL: `http://localhost:5000/api/performance/low-attendance?threshold=75`

**cURL:**
```bash
curl "http://localhost:5000/api/performance/low-attendance?threshold=75"
```

**Expected Response:**
- Should return Jane Smith (65% attendance)
- Should NOT return John Doe (85% attendance)

---

## 🧪 Test Scenarios

### Test 1: Validation - Missing Fields
Try creating a student without `name`:
```json
{
  "rollNumber": "R003",
  "class": "10th",
  "section": "A"
}
```
**Expected:** 400 Bad Request with error message

### Test 2: Validation - Duplicate Roll Number
Try creating two students with the same roll number.
**Expected:** 400 Bad Request - "Student with this roll number already exists"

### Test 3: Invalid Marks
Try adding marks > 100:
```json
{
  "marks": {
    "math": 150
  }
}
```
**Expected:** 400 Bad Request

### Test 4: Non-existent Student
Try getting performance for a fake ID:
```
GET /api/performance/summary/507f1f77bcf86cd799439011
```
**Expected:** 404 Not Found

### Test 5: Performance Status Calculation
Test different average marks:
- 95 → "Excellent"
- 80 → "Good"
- 65 → "Average"
- 50 → "Poor"

---

## 📊 Sample Test Data

### Create Multiple Students
```json
// Student 1
{
  "name": "Alice Johnson",
  "rollNumber": "R001",
  "class": "10th",
  "section": "A"
}

// Student 2
{
  "name": "Bob Williams",
  "rollNumber": "R002",
  "class": "10th",
  "section": "B"
}

// Student 3
{
  "name": "Charlie Brown",
  "rollNumber": "R003",
  "class": "12th",
  "section": "A"
}
```

### Add Different Performance Levels
```json
// Excellent Student (95 average)
{
  "marks": {
    "math": 95,
    "science": 98,
    "english": 92
  }
}

// Good Student (80 average)
{
  "marks": {
    "math": 80,
    "science": 85,
    "english": 75
  }
}

// Average Student (65 average)
{
  "marks": {
    "math": 65,
    "science": 70,
    "english": 60
  }
}

// Poor Student (50 average)
{
  "marks": {
    "math": 50,
    "science": 45,
    "english": 55
  }
}
```

---

## ✅ Testing Checklist

- [ ] Server starts successfully
- [ ] Can create a student
- [ ] Can get all students
- [ ] Can get student by ID
- [ ] Can get student by roll number
- [ ] Can add marks for a student
- [ ] Average marks calculated correctly
- [ ] Performance status classified correctly
- [ ] Can add attendance
- [ ] Can get performance summary
- [ ] Can get low attendance students
- [ ] Validation works (missing fields, invalid data)
- [ ] Error handling works (non-existent student)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Make sure MongoDB is running
- Check your `.env` file has correct `MONGODB_URI`
- For local MongoDB: `mongodb://localhost:27017/student-tracking`

### Issue: "Port already in use"
**Solution:**
- Change PORT in `.env` file
- Or stop the process using port 5000

### Issue: "Module not found"
**Solution:**
- Run `npm install` in the backend folder

### Issue: "Student not found"
**Solution:**
- Make sure you're using the correct student ID
- Check if student exists: `GET /api/students`

---

Happy Testing! 🚀

