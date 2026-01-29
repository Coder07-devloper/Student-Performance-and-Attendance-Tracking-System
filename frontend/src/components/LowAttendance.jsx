/**
 * Low Attendance Component
 * 
 * Displays all students with attendance below the threshold
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { performanceAPI } from '../services/api'
import './LowAttendance.css'

function LowAttendance() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [threshold, setThreshold] = useState(75)

  useEffect(() => {
    fetchLowAttendanceStudents()
  }, [threshold])

  const fetchLowAttendanceStudents = async () => {
    try {
      setLoading(true)
      const response = await performanceAPI.getLowAttendance(threshold)
      setStudents(response.data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleThresholdChange = (e) => {
    const newThreshold = parseInt(e.target.value)
    if (!isNaN(newThreshold) && newThreshold >= 0 && newThreshold <= 100) {
      setThreshold(newThreshold)
    }
  }

  if (loading) {
    return (
      <div className="low-attendance-page">
        <div className="card">
          <p>Loading low attendance students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="low-attendance-page">
        <div className="card error">
          <p>Error: {error}</p>
          <button onClick={fetchLowAttendanceStudents} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="low-attendance-page">
      <div className="page-header">
        <h2 className="page-title">⚠️ Low Attendance Students</h2>
        <div className="threshold-control">
          <label htmlFor="threshold">Threshold:</label>
          <input
            type="number"
            id="threshold"
            value={threshold}
            onChange={handleThresholdChange}
            min="0"
            max="100"
            className="threshold-input"
          />
          <span>%</span>
        </div>
      </div>

      <div className="info-banner">
        <p>
          Showing students with attendance below <strong>{threshold}%</strong>
        </p>
        <p className="count">{students.length} student(s) found</p>
      </div>

      {students.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">✅</div>
          <h3>Great News!</h3>
          <p>No students have attendance below {threshold}%</p>
        </div>
      ) : (
        <div className="students-list">
          {students.map((item, index) => (
            <div key={item.student.id} className="student-alert-card">
              <div className="alert-number">{index + 1}</div>
              <div className="student-info">
                <h3>{item.student.name}</h3>
                <div className="student-details">
                  <span className="detail-item">
                    <strong>Roll:</strong> {item.student.rollNumber}
                  </span>
                  <span className="detail-item">
                    <strong>Class:</strong> {item.student.class} {item.student.section}
                  </span>
                </div>
              </div>
              <div className="attendance-info">
                <div className="attendance-badge low">
                  {item.attendancePercentage}%
                </div>
                <div className="performance-status">
                  Status: <span className={`status ${item.performanceStatus.toLowerCase()}`}>
                    {item.performanceStatus}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                <Link
                  to={`/performance/${item.student.id}`}
                  className="btn-view"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LowAttendance

