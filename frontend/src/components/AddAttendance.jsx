/**
 * Add Attendance Component
 * 
 * Form to add or update attendance for a student
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI, performanceAPI } from '../services/api'
import './AddAttendance.css'

function AddAttendance() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [attendancePercentage, setAttendancePercentage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll()
      setStudents(response.data || [])
      setLoadingStudents(false)
    } catch (err) {
      setError(err.message)
      setLoadingStudents(false)
    }
  }

  const handleStudentChange = async (e) => {
    const studentId = e.target.value
    setSelectedStudentId(studentId)
    setError(null)

    // Try to fetch existing attendance
    if (studentId) {
      try {
        const response = await performanceAPI.getSummary(studentId)
        if (response.data?.performance?.hasData) {
          setAttendancePercentage(response.data.performance.attendancePercentage.toString())
        } else {
          setAttendancePercentage('')
        }
      } catch (err) {
        // No existing data, clear the field
        setAttendancePercentage('')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedStudentId) {
      setError('Please select a student')
      return
    }

    const attendance = parseFloat(attendancePercentage)
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      setError('Attendance must be a number between 0 and 100')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await performanceAPI.addAttendance(selectedStudentId, attendance)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingStudents) {
    return (
      <div className="add-attendance-page">
        <div className="card">
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="add-attendance-page">
      <h2 className="page-title">Add/Update Attendance</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label htmlFor="student">Select Student *</label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={handleStudentChange}
              required
            >
              <option value="">-- Select a student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.rollNumber}) - {student.class} {student.section}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="attendance">Attendance Percentage *</label>
            <div className="input-with-info">
              <input
                type="number"
                id="attendance"
                value={attendancePercentage}
                onChange={(e) => {
                  setAttendancePercentage(e.target.value)
                  setError(null)
                }}
                min="0"
                max="100"
                step="0.01"
                required
                placeholder="Enter attendance percentage (0-100)"
              />
              <span className="input-suffix">%</span>
            </div>
            <small className="hint">
              Enter a value between 0 and 100. Students below 75% are flagged as low attendance.
            </small>
          </div>

          {selectedStudentId && attendancePercentage && (
            <div className="attendance-preview">
              <div className={`preview-card ${parseFloat(attendancePercentage) < 75 ? 'low' : 'good'}`}>
                <span className="preview-icon">
                  {parseFloat(attendancePercentage) < 75 ? '⚠️' : '✅'}
                </span>
                <div>
                  <strong>
                    {parseFloat(attendancePercentage) < 75 
                      ? 'Low Attendance Alert' 
                      : 'Good Attendance'}
                  </strong>
                  <p>
                    {parseFloat(attendancePercentage) < 75
                      ? 'This student will appear in the low attendance list.'
                      : 'Attendance is above the threshold.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="alert error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert success">
              ✅ Attendance updated successfully!
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !selectedStudentId}
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/students')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAttendance

