/**
 * Add Student Component
 * 
 * Form to add a new student to the system
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../services/api'
import './AddStudent.css'

function AddStudent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await studentAPI.create(formData)
      setSuccess(true)
      setFormData({
        name: '',
        rollNumber: '',
        class: '',
        section: ''
      })
      
      // Redirect to students list after 2 seconds
      setTimeout(() => {
        navigate('/students')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-student-page">
      <h2 className="page-title">Add New Student</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Student Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter student's full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number *</label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              placeholder="e.g., R001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="class">Class *</label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
              placeholder="e.g., 10th, 12th"
            />
          </div>

          <div className="form-group">
            <label htmlFor="section">Section *</label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
              placeholder="e.g., A, B, C"
              maxLength="1"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {error && (
            <div className="alert error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert success">
              ✅ Student added successfully! Redirecting...
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
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

export default AddStudent

