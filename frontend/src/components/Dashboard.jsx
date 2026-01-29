/**
 * Dashboard Component
 * 
 * Main overview page showing statistics and quick actions
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI, performanceAPI } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    excellentStudents: 0,
    lowAttendanceCount: 0,
    averageMarks: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all students
      const studentsRes = await studentAPI.getAll()
      const students = studentsRes.data || []
      
      // Fetch low attendance students
      const lowAttendanceRes = await performanceAPI.getLowAttendance(75)
      const lowAttendance = lowAttendanceRes.data || []

      // Calculate statistics
      let excellentCount = 0
      let totalMarks = 0
      let marksCount = 0

      // Fetch performance for each student to calculate stats
      for (const student of students) {
        try {
          const perfRes = await performanceAPI.getSummary(student._id)
          if (perfRes.data?.performance?.hasData) {
            const perf = perfRes.data.performance
            if (perf.performanceStatus === 'Excellent') {
              excellentCount++
            }
            if (perf.averageMarks > 0) {
              totalMarks += perf.averageMarks
              marksCount++
            }
          }
        } catch (err) {
          // Skip if no performance data
        }
      }

      setStats({
        totalStudents: students.length,
        excellentStudents: excellentCount,
        lowAttendanceCount: lowAttendance.length,
        averageMarks: marksCount > 0 ? (totalMarks / marksCount).toFixed(2) : 0
      })
      
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="card error">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard Overview</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.excellentStudents}</h3>
            <p>Excellent Performers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.lowAttendanceCount}</h3>
            <p>Low Attendance</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.averageMarks}%</h3>
            <p>Average Marks</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/add-student" className="action-btn">
            ➕ Add New Student
          </Link>
          <Link to="/add-marks" className="action-btn">
            📝 Add Marks
          </Link>
          <Link to="/add-attendance" className="action-btn">
            📅 Add Attendance
          </Link>
          <Link to="/students" className="action-btn">
            👀 View All Students
          </Link>
          <Link to="/low-attendance" className="action-btn warning">
            ⚠️ Low Attendance Alert
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="info-section">
        <h3>📚 System Information</h3>
        <div className="info-card">
          <p><strong>Welcome to Student Performance and Attendance Tracking System!</strong></p>
          <p>Use the navigation menu above to:</p>
          <ul>
            <li>Add and manage students</li>
            <li>Record marks and attendance</li>
            <li>View performance summaries</li>
            <li>Identify students needing attention</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

