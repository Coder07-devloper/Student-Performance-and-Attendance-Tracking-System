# React Frontend - Student Performance and Attendance Tracking System

This is the React frontend for the Student Performance and Attendance Tracking System.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── StudentList.jsx
│   │   ├── AddStudent.jsx
│   │   ├── AddMarks.jsx
│   │   ├── AddAttendance.jsx
│   │   ├── PerformanceSummary.jsx
│   │   └── LowAttendance.jsx
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx             # Main app component with routing
│   ├── App.css             # App styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json
```

## 🎯 Features

- **Dashboard**: Overview with statistics and quick actions
- **Student Management**: Add and view all students
- **Marks Management**: Add/update subject-wise marks
- **Attendance Tracking**: Add/update attendance percentage
- **Performance Summary**: View complete student performance
- **Low Attendance Alert**: Identify students with low attendance

## 🔧 Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000`.

To change the API URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:port/api'
```

## 📱 Responsive Design

The frontend is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling (no external CSS frameworks)

## 📝 Notes

- Make sure the backend server is running before using the frontend
- The frontend uses React Router for navigation
- All API calls are centralized in `src/services/api.js`
- Components are organized by feature/functionality

