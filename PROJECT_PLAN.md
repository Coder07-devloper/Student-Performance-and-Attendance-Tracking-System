# Student Performance and Attendance Tracking System - Project Plan

## 📁 Simple Folder Structure

```
student-tracking-system/
├── backend/
│   ├── models/
│   │   ├── Student.js          # Student schema (name, rollNumber, class, section)
│   │   └── Performance.js      # Performance schema (marks, attendance, calculations)
│   ├── routes/
│   │   ├── studentRoutes.js    # Student CRUD operations
│   │   └── performanceRoutes.js # Marks, attendance, and performance APIs
│   ├── controllers/
│   │   ├── studentController.js # Business logic for students
│   │   └── performanceController.js # Business logic for performance
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── utils/
│   │   └── performanceUtils.js  # Helper functions (calculate average, classify status)
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/                    # Optional minimal React app
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   └── package.json
└── README.md
```

**Why this structure?**
- `models/`: Define data structure (MongoDB schemas)
- `routes/`: Define API endpoints
- `controllers/`: Handle business logic (separate from routes for clarity)
- `config/`: Database connection setup
- `utils/`: Reusable helper functions

---

## 🗄️ MongoDB Schema Design

### 1. Student Schema
```javascript
{
  name: String (required),
  rollNumber: String (required, unique),
  class: String (required),      // e.g., "10th", "12th"
  section: String (required),    // e.g., "A", "B"
  createdAt: Date
}
```

**Why this design?**
- `rollNumber` is unique to identify each student
- `class` and `section` help organize students
- Simple structure, easy to understand

### 2. Performance Schema
```javascript
{
  studentId: ObjectId (reference to Student, required),
  marks: {
    subject1: Number,  // e.g., { math: 85, science: 90 }
    subject2: Number,
    // ... more subjects
  },
  attendancePercentage: Number (0-100, required),
  averageMarks: Number (calculated automatically),
  performanceStatus: String (calculated: "Excellent", "Good", "Average", "Poor"),
  lastUpdated: Date
}
```

**Why this design?**
- `studentId` links performance to a student
- `marks` stored as object for flexibility (can add subjects dynamically)
- `averageMarks` and `performanceStatus` calculated in backend
- `attendancePercentage` stored as single number

**Alternative Approach (Simpler):**
We could store marks as an array: `[{subject: "Math", marks: 85}, ...]`
But object format is easier to query and update.

---

## 🔄 Data Flow Explanation

### Flow 1: Adding a Student
```
User → POST /api/students → studentController.createStudent()
  → Student Model → MongoDB → Return created student
```

### Flow 2: Adding Marks
```
User → POST /api/performance/marks/:studentId
  → performanceController.addMarks()
  → Calculate averageMarks (sum all marks / count)
  → Determine performanceStatus based on average
  → Update Performance Model → MongoDB
```

### Flow 3: Getting Performance Summary
```
User → GET /api/performance/summary/:studentId
  → performanceController.getSummary()
  → Fetch Student + Performance data
  → Return combined summary
```

### Flow 4: Finding Low Attendance Students
```
User → GET /api/performance/low-attendance
  → performanceController.getLowAttendance()
  → Query Performance collection (attendancePercentage < threshold)
  → Populate student details → Return list
```

---

## 📡 API Endpoints Design

### Student Management APIs

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/students` | Add a new student | `{name, rollNumber, class, section}` | Created student object |
| GET | `/api/students` | Get all students | - | Array of students |
| GET | `/api/students/:id` | Get student by ID | - | Single student object |
| GET | `/api/students/roll/:rollNumber` | Get student by roll number | - | Single student object |

### Performance & Marks APIs

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/performance/marks/:studentId` | Add/update marks for a student | `{marks: {math: 85, science: 90}}` | Updated performance |
| POST | `/api/performance/attendance/:studentId` | Add/update attendance | `{attendancePercentage: 75}` | Updated performance |
| GET | `/api/performance/summary/:studentId` | Get complete performance summary | - | Student + performance data |
| GET | `/api/performance/low-attendance` | Get students with low attendance | Query param: `?threshold=75` | Array of students |

### Business Logic Rules

1. **Average Marks Calculation:**
   - Sum all subject marks
   - Divide by number of subjects
   - Round to 2 decimal places

2. **Performance Status Classification:**
   - Excellent: averageMarks >= 90
   - Good: averageMarks >= 75 and < 90
   - Average: averageMarks >= 60 and < 75
   - Poor: averageMarks < 60

3. **Low Attendance Threshold:**
   - Default: 75%
   - Can be customized via query parameter

---

## 🎯 Implementation Steps

1. **Step 1:** Initialize project (package.json, install dependencies)
2. **Step 2:** Set up MongoDB connection
3. **Step 3:** Create Student model
4. **Step 4:** Create Performance model
5. **Step 5:** Create utility functions (calculate average, classify status)
6. **Step 6:** Create student controllers and routes
7. **Step 7:** Create performance controllers and routes
8. **Step 8:** Set up Express server with all routes
9. **Step 9:** Create minimal frontend (optional) or API testing setup

---

## 💡 Key Concepts Explained

### Why Separate Models?
- **Student Model:** Stores basic student info (doesn't change often)
- **Performance Model:** Stores academic data (changes frequently)
- This separation makes it easier to update marks without touching student info

### Why Controllers Separate from Routes?
- **Routes:** Define URLs and HTTP methods (thin layer)
- **Controllers:** Handle business logic (thick layer)
- This makes code easier to test and maintain

### Why Calculate Average in Backend?
- Ensures consistency (same calculation everywhere)
- Prevents frontend manipulation
- Can add validation and error handling

---

## 🚀 Next Steps

Now we'll start building the project step by step, beginning with the server setup!

