/**
 * Main App Component
 * 
 * This is the root component that sets up routing and navigation
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import StudentList from './components/StudentList'
import AddStudent from './components/AddStudent'
import AddMarks from './components/AddMarks'
import AddAttendance from './components/AddAttendance'
import PerformanceSummary from './components/PerformanceSummary'
import LowAttendance from './components/LowAttendance'
import './App.css'

// Navigation component
function Navigation() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🎓 Student Tracking System</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/students" className={isActive('/students')}>
              Students
            </Link>
          </li>
          <li>
            <Link to="/add-student" className={isActive('/add-student')}>
              Add Student
            </Link>
          </li>
          <li>
            <Link to="/add-marks" className={isActive('/add-marks')}>
              Add Marks
            </Link>
          </li>
          <li>
            <Link to="/add-attendance" className={isActive('/add-attendance')}>
              Add Attendance
            </Link>
          </li>
          <li>
            <Link to="/low-attendance" className={isActive('/low-attendance')}>
              Low Attendance
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/add-marks" element={<AddMarks />} />
            <Route path="/add-attendance" element={<AddAttendance />} />
            <Route path="/performance/:studentId" element={<PerformanceSummary />} />
            <Route path="/low-attendance" element={<LowAttendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

