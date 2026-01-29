/**
 * Add Marks Component
 * 
 * Form to add or update marks for a student
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI, performanceAPI } from '../services/api'
import './AddMarks.css'

function AddMarks() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [marks, setMarks] = useState({})
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

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value)
    setMarks({})
    setError(null)
  }

  const handleMarkChange = (subject, value) => {
    setMarks({
      ...marks,
      [subject]: value === '' ? '' : parseFloat(value)
    })
    setError(null)
  }

  const addSubject = () => {
    const subject = prompt('Enter subject name:')
    if (subject && subject.trim()) {
      setMarks({
        ...marks,
        [subject.trim()]: ''
      })
    }
  }

  const removeSubject = (subject) => {
    const newMarks = { ...marks }
    delete newMarks[subject]
    setMarks(newMarks)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedStudentId) {
      setError('Please select a student')
      return
    }

    // Filter out empty marks
    const validMarks = {}
    Object.entries(marks).forEach(([subject, mark]) => {
      if (mark !== '' && !isNaN(mark) && mark >= 0 && mark <= 100) {
        validMarks[subject] = mark
      }
    })

    if (Object.keys(validMarks).length === 0) {
      setError('Please enter at least one valid mark (0-100)')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await performanceAPI.addMarks(selectedStudentId, validMarks)
      setSuccess(true)
      setMarks({})
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
      <div className="add-marks-page">
        <div className="card">
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="add-marks-page">
      <h2 className="page-title">Add/Update Marks</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="marks-form">
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

          {selectedStudentId && (
            <>
              <div className="marks-section">
                <div className="marks-header">
                  <h3>Subject Marks (0-100)</h3>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="btn-add-subject"
                  >
                    ➕ Add Subject
                  </button>
                </div>

                <div className="marks-inputs">
                  {Object.entries(marks).map(([subject, mark]) => (
                    <div key={subject} className="mark-input-row">
                      <input
                        type="text"
                        value={subject}
                        readOnly
                        className="subject-name"
                        placeholder="Subject name"
                      />
                      <input
                        type="number"
                        value={mark}
                        onChange={(e) => handleMarkChange(subject, e.target.value)}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Marks"
                        className="mark-value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {Object.keys(marks).length === 0 && (
                  <p className="hint">Click "Add Subject" to add marks for subjects</p>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="alert error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert success">
              ✅ Marks added successfully!
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !selectedStudentId || Object.keys(marks).length === 0}
            >
              {loading ? 'Saving...' : 'Save Marks'}
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

export default AddMarks

