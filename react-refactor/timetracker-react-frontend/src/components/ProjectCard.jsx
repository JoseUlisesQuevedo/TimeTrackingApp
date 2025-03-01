import React from 'react'
import '../styles/ProjectCard.css'

function ProjectCard() {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-card-title">Project Name</h3>
        <small>(ID: 1)</small>
        <span className="project-status status-active">Active</span>
      </div>
      <div className="project-card-body">
        Project description
        <div className="project-details">
          <div className="detail-item">
            <strong>Area:</strong> Area
          </div>
          <div className="detail-item">
            <strong>Tech Lead:</strong> Tech Lead
          </div>
          <div className="detail-item">
            <strong>Business Lead:</strong> Business Lead
          </div>
        </div>
      </div>
      <div className="project-card-footer">
        <span>Start Date - End Date</span>
        <div className="project-actions">
          <button className="edit-project">Edit</button>
          <button className="delete-project">Delete</button>
        </div>
      </div>
    </div>
  )
};

export default ProjectCard
