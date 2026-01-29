/**
 * Performance Summary Component
 * 
 * Displays complete performance summary for a specific student
 */

import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { performanceAPI } from '../services/api'
import './PerformanceSummary.css'

function PerformanceSummary() {
  const { studentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPerformanceSummary()
  }, [studentId])

  const fetchPerformanceSummary = async () => {
    try {
      setLoading(true)
      const response = await performanceAPI.getSummary(studentId)
      setData(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="performance-summary-page">
        <div className="card">
          <p>Loading performance data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="performance-summary-page">
        <div className="card error">
          <p>Error: {error}</p>
          <Link to="/students" className="btn-primary">
            Back to Students
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="performance-summary-page">
        <div className="card">
          <p>No data found</p>
        </div>
      </div>
    )
  }

  const { student, performance } = data
  const hasData = performance.hasData

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
        return '#4caf50'
      case 'Good':
        return '#2196f3'
      case 'Average':
        return '#ff9800'
      case 'Poor':
        return '#f44336'
      default:
        return '#666'
    }
  }

  return (
    <div className="performance-summary-page">
      <div className="page-header">
        <h2 className="page-title">Performance Summary</h2>
        <Link to="/students" className="btn-secondary">
          ← Back to Students
        </Link>
      </div>

      <div className="summary-container">
        {/* Student Info Card */}
        <div className="info-card student-info">
          <h3>👤 Student Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{student.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Roll Number:</span>
              <span className="info-value">{student.rollNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Class:</span>
              <span className="info-value">{student.class}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Section:</span>
              <span className="info-value">{student.section}</span>
            </div>
          </div>
        </div>

        {/* Performance Data */}
        {hasData ? (
          <>
            {/* Performance Status Card */}
            <div className="info-card performance-status">
              <h3>📊 Performance Overview</h3>
              <div className="status-display">
                <div className="status-badge" style={{ backgroundColor: getStatusColor(performance.performanceStatus) }}>
                  {performance.performanceStatus}
                </div>
                <div className="status-details">
                  <div className="stat-item">
                    <span className="stat-label">Average Marks:</span>
                    <span className="stat-value">{performance.averageMarks}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Attendance:</span>
                    <span className={`stat-value ${performance.lowAttendance ? 'warning' : ''}`}>
                      {performance.attendancePercentage}%
                      {performance.lowAttendance && ' ⚠️'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Marks Card */}
            {Object.keys(performance.marks).length > 0 && (
              <div className="info-card marks-card">
                <h3>📝 Subject-wise Marks</h3>
                <div className="marks-grid">
                  {Object.entries(performance.marks).map(([subject, mark]) => (
                    <div key={subject} className="mark-item">
                      <span className="subject-name">{subject}</span>
                      <span className="mark-value">{mark}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Alert */}
            {performance.lowAttendance && (
              <div className="info-card alert-card warning">
                <h3>⚠️ Low Attendance Alert</h3>
                <p>
                  This student's attendance ({performance.attendancePercentage}%) is below the threshold (75%).
                  Consider taking necessary action.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="info-card empty-state">
            <h3>📋 No Performance Data</h3>
            <p>This student doesn't have any performance data yet.</p>
            <div className="action-buttons">
              <Link to="/add-marks" className="btn-primary">
                Add Marks
              </Link>
              <Link to="/add-attendance" className="btn-primary">
                Add Attendance
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceSummary

