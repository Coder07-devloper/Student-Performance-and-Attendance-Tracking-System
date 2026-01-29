# Quick Start Guide

Get your Student Performance and Attendance Tracking System up and running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB on your computer
2. Start MongoDB service
3. Create `.env` file in `backend` folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/student-tracking
   PORT=5000
   ```

**Option B: MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (free tier available)
4. Get your connection string
5. Create `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-tracking
   PORT=5000
   ```

### Step 3: Start the Server

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

### Step 4: Test the API

**Option 1: Use the HTML Frontend**
1. Open `frontend/index.html` in your browser
2. Start using the interface!

**Option 2: Use Postman/Thunder Client**
- See `API_TESTING_GUIDE.md` for detailed instructions

**Option 3: Use cURL**
```bash
# Test if server is running
curl http://localhost:5000

# Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","rollNumber":"R001","class":"10th","section":"A"}'
```

## 🎯 First 5 API Calls to Try

1. **Create a student**
   ```
   POST /api/students
   Body: {"name":"Alice","rollNumber":"R001","class":"10th","section":"A"}
   ```

2. **Get all students**
   ```
   GET /api/students
   ```

3. **Add marks** (use student ID from step 2)
   ```
   POST /api/performance/marks/YOUR_STUDENT_ID
   Body: {"marks":{"math":85,"science":90,"english":78}}
   ```

4. **Add attendance**
   ```
   POST /api/performance/attendance/YOUR_STUDENT_ID
   Body: {"attendancePercentage":85}
   ```

5. **Get performance summary**
   ```
   GET /api/performance/summary/YOUR_STUDENT_ID
   ```

## 🐛 Common Issues

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running (local) or connection string is correct (Atlas)
- Check your `.env` file exists and has correct `MONGODB_URI`

**"Port 5000 already in use"**
- Change `PORT=5001` in `.env` file
- Or stop the process using port 5000

**"Module not found"**
- Run `npm install` in the `backend` folder

## 📚 Next Steps

- Read `README.md` for full documentation
- Check `API_TESTING_GUIDE.md` for detailed testing instructions
- Review `PROJECT_PLAN.md` to understand the architecture

Happy coding! 🚀

