# Frontend Setup Guide

Complete guide to set up and run the React frontend.

## ✅ Prerequisites

- Node.js 18+ (for built-in fetch API)
- Backend server running on `http://localhost:5000`

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

## 📱 Available Pages

1. **Dashboard** (`/`) - Overview with statistics
2. **Students** (`/students`) - View all students
3. **Add Student** (`/add-student`) - Add new student
4. **Add Marks** (`/add-marks`) - Add/update marks
5. **Add Attendance** (`/add-attendance`) - Add/update attendance
6. **Performance Summary** (`/performance/:id`) - View student performance
7. **Low Attendance** (`/low-attendance`) - Students with low attendance

## 🎨 Features

### Dashboard
- Statistics overview (total students, excellent performers, etc.)
- Quick action buttons
- System information

### Student Management
- List all students with search functionality
- Add new students with form validation
- View student details

### Performance Management
- Add subject-wise marks dynamically
- Add/update attendance percentage
- View complete performance summary
- Automatic average calculation
- Performance status classification

### Low Attendance Alert
- Filterable threshold
- Visual alerts for students below threshold
- Quick access to student details

## 🔧 Configuration

### Change API URL

Edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:port/api'
```

### Change Port

Edit `vite.config.js`:

```javascript
server: {
  port: 3000,  // Change this
}
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Make sure backend server is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in `src/services/api.js`

### "Module not found"
- Run `npm install` in the frontend folder
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port already in use
- Change port in `vite.config.js`
- Or stop the process using port 3000

## 📦 Build for Production

```bash
npm run build
```

Built files will be in the `dist` folder. You can deploy this to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🎯 Key Components Explained

### API Service Layer (`src/services/api.js`)
- Centralized API calls
- Error handling
- Easy to maintain and update

### Components
- **Dashboard**: Main overview page
- **StudentList**: Displays all students
- **AddStudent**: Form to add students
- **AddMarks**: Dynamic form for subject marks
- **AddAttendance**: Attendance input form
- **PerformanceSummary**: Complete student performance view
- **LowAttendance**: Alert system for low attendance

## 💡 Tips

1. **Development**: Use `npm run dev` for hot-reload during development
2. **Testing**: Test all features after backend is running
3. **Responsive**: Test on different screen sizes
4. **Error Handling**: Check browser console for errors

## 📚 Next Steps

- Add data visualization (charts)
- Add export functionality
- Add bulk operations
- Add search and filters
- Add pagination for large datasets

Happy coding! 🚀

