# Student Performance and Attendance Tracking System

A simple, clean, and interview-friendly backend-focused project for tracking student academic performance and attendance.

## 📋 Project Overview

This system allows you to:
- Add and manage student information
- Record subject-wise marks for students
- Track attendance percentages
- Automatically calculate average marks
- Classify performance status (Excellent, Good, Average, Poor)
- Identify students with low attendance

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** React 18 with React Router
- **Build Tool:** Vite

## 📁 Project Structure

```
student-tracking-system/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API route definitions
│   ├── controllers/         # Business logic
│   ├── config/              # Configuration files
│   ├── utils/               # Helper functions
│   ├── server.js            # Express server entry point
│   ├── test.js              # API test script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/         # API service layer
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `backend` folder
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017/student-tracking
     PORT=5000
     ```
   - For MongoDB Atlas, use:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-tracking
     ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify server is running:**
   - Open browser: `http://localhost:5000`
   - You should see a welcome message

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

### Running Both Backend and Frontend

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Now you can access the full-stack application at `http://localhost:3000`!

## 📡 API Endpoints

### Student Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create a new student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| GET | `/api/students/roll/:rollNumber` | Get student by roll number |

### Performance Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/performance/marks/:studentId` | Add/update marks for a student |
| POST | `/api/performance/attendance/:studentId` | Add/update attendance for a student |
| GET | `/api/performance/summary/:studentId` | Get complete performance summary |
| GET | `/api/performance/low-attendance?threshold=75` | Get students with low attendance |

## 📝 API Usage Examples

### 1. Create a Student

**Request:**
```bash
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "John Doe",
  "rollNumber": "R001",
  "class": "10th",
  "section": "A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "rollNumber": "R001",
    "class": "10th",
    "section": "A",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Add Marks for a Student

**Request:**
```bash
POST http://localhost:5000/api/performance/marks/:studentId
Content-Type: application/json

{
  "marks": {
    "math": 85,
    "science": 90,
    "english": 78,
    "history": 82
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Marks updated successfully",
  "data": {
    "studentId": "...",
    "marks": {
      "math": 85,
      "science": 90,
      "english": 78,
      "history": 82
    },
    "averageMarks": 83.75,
    "performanceStatus": "Good",
    "attendancePercentage": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Add Attendance

**Request:**
```bash
POST http://localhost:5000/api/performance/attendance/:studentId
Content-Type: application/json

{
  "attendancePercentage": 85
}
```

### 4. Get Performance Summary

**Request:**
```bash
GET http://localhost:5000/api/performance/summary/:studentId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "...",
      "name": "John Doe",
      "rollNumber": "R001",
      "class": "10th",
      "section": "A"
    },
    "performance": {
      "marks": {
        "math": 85,
        "science": 90,
        "english": 78,
        "history": 82
      },
      "averageMarks": 83.75,
      "attendancePercentage": 85,
      "performanceStatus": "Good",
      "lowAttendance": false,
      "lastUpdated": "2024-01-01T00:00:00.000Z",
      "hasData": true
    }
  }
}
```

### 5. Get Students with Low Attendance

**Request:**
```bash
GET http://localhost:5000/api/performance/low-attendance?threshold=75
```

**Response:**
```json
{
  "success": true,
  "threshold": 75,
  "count": 2,
  "data": [
    {
      "student": {
        "id": "...",
        "name": "Jane Smith",
        "rollNumber": "R002",
        "class": "10th",
        "section": "B"
      },
      "attendancePercentage": 65,
      "performanceStatus": "Average"
    }
  ]
}
```

## 🎯 Business Logic Rules

### Performance Status Classification

- **Excellent:** Average marks ≥ 90
- **Good:** Average marks ≥ 75 and < 90
- **Average:** Average marks ≥ 60 and < 75
- **Poor:** Average marks < 60

### Average Marks Calculation

- Sum of all subject marks divided by number of subjects
- Rounded to 2 decimal places

### Low Attendance Threshold

- Default: 75%
- Can be customized via query parameter


## 🔍 Project Features Checklist

- ✅ Add a student (name, roll number, class/section)
- ✅ Add marks for a student (subject-wise)
- ✅ Add attendance percentage for a student
- ✅ Calculate average marks automatically
- ✅ Classify performance status (Excellent, Good, Average, Poor)
- ✅ Identify students with low attendance
- ✅ Fetch student performance summary via APIs

