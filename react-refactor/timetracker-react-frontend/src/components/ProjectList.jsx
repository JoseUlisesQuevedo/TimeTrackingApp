import React from 'react'
import ProjectCard from './ProjectCard'
import '../styles/ProjectList.css' 

function ProjectList() {
  return (
    <div className='projects-list-container'>
        <h2 style={{ marginBottom: '20px' }}>Proyectos</h2>
        <div className='projects-list'>
            <ProjectCard/>
            <ProjectCard/>
            <ProjectCard/>
            <ProjectCard/>
        </div>
    </div>
  )
}

export default ProjectList