import React from 'react'
import Sidebar from '../components/Sidebar'
import ProjectsGrid from '../components/ProjectsGrid'
import '../styles/ProjectEditPage.css'

function ProjectEditPage() {
  return (
    <div className='app-container'>
        <Sidebar />
        <ProjectsGrid />
    </div>
  )
}

export default ProjectEditPage