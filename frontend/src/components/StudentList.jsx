/**
 * Student List Component
 * 
 * Displays all students in a table/card format with options to view performance
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../services/api'
import './StudentList.css'

function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getAll()
      setStudents(response.data || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="student-list-page">
        <div className="card">
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="student-list-page">
        <div className="card error">
          <p>Error: {error}</p>
          <button onClick={fetchStudents} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="student-list-page">
      <div className="page-header">
        <h2 className="page-title">All Students</h2>
        <Link to="/add-student" className="btn-primary">
          ➕ Add New Student
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, roll number, or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Students Count */}
      <div className="students-count">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="card empty-state">
          <p>No students found. Add your first student to get started!</p>
          <Link to="/add-student" className="btn-primary">
            Add Student
          </Link>
        </div>
      ) : (
        <div className="students-grid">
          {filteredStudents.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-header">
                <h3>{student.name}</h3>
                <span className="roll-number">{student.rollNumber}</span>
              </div>
              <div className="student-details">
                <p><strong>Class:</strong> {student.class}</p>
                <p><strong>Section:</strong> {student.section}</p>
              </div>
              <div className="student-actions">
                <Link
                  to={`/performance/${student._id}`}
                  className="btn-view"
                >
                  View Performance →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentList

