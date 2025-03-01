import React from 'react'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import '../styles/ProjectsGrid.css'

function ProjectsGrid() {
  return (
    <div className="main-content">
    <div className="container">
        <header>
            <h1>Project Details</h1>
        </header>
        <div className="projects-grid">
            <ProjectForm />
            <ProjectList />
        </div>
    </div>
    </div>
  )
}

export default ProjectsGrid