/**
 * This module provides functions to format project data and create project cards for display in the project details section of the app
 * It includes utility functions for formatting dates and capitalizing strings, as well as functions to create and manage project cards.
 * 
 * @module projectCards
 */


import { AREA_MAPPING } from './constants.js';
import api from './api.js';
import { fetchProjects,fetchUsers} from './api.js';
import { populateFormForEdit } from './projectForm.js';


/**
    * Formats an array of projects by adding tech lead, business lead, area, and status information.
    * 
    * @param {Array} projects - The array of project objects to format.
    * @param {Array} users - The array of user objects to find tech and business leads.
    * @returns {Array} The formatted array of project objects.
    */
//TODO: Change username to name when model is updated
export function formatProjects(projects, users) {
    return projects.map(project => {
        const techLead = users.find(user => user.id === project.tech_lead);
        const businessLead = users.find(user => user.id === project.business_lead);
        return {
            ...project,
            techLead: techLead ? techLead.username : 'None',
            businessLead: businessLead ? businessLead.username : 'None',
            cleanArea: AREA_MAPPING[project.area] || 'Unknown',
        };
    });
}



export function renderProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach(project => {
        projectsList.appendChild(createProjectCard(project));
    });
}


/**
 * Creates a project card element for a given project.
 * 
 * @param {Object} project - The project object to create a card for.
 * @returns {HTMLElement} The created project card element.
 */
export function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const statusClass = `status-${project.status}`;
    const dates = formatProjectDates(project.start_date, project.end_date);

    card.innerHTML = `
        <div class="project-card-header">
            <h3 class="project-card-title">${project.project_name}</h3>
            <small>(ID: ${project.id})</small>
            <span class="project-status ${statusClass}">${capitalizeFirstLetter(project.status)}</span>
        </div>
        <div class="project-card-body">
            ${project.description || 'No description provided'}
            <div class="project-details">
                <div class="detail-item">
                    <strong>Area:</strong> ${capitalizeFirstLetter(project.cleanArea)}
                </div>
                <div class="detail-item">
                    <strong>Tech Lead:</strong> ${project.techLead}
                </div>
                <div class="detail-item">
                    <strong>Business Lead:</strong> ${project.businessLead}
                </div>
            </div>
        </div>
        <div class="project-card-footer">
            <span>${dates}</span>
            <div class="project-actions">
                <button class="edit-project" data-id="${project.id}">Edit</button>
                <button class="delete-project" data-id="${project.id}">Delete</button>
            </div>
        </div>
    `;

    card.querySelector('.delete-project').addEventListener('click', async (event) => {
        // Prevent any default behavior
        event.preventDefault();
        
        // Immediate visual feedback
        alert("Starting delete process"); // This will help us confirm the handler is running
        
        try {
          if (!confirm(`Are you sure you want to delete this project?`)) {
            alert("Delete cancelled");
            return;
          }
      
          // Add visual feedback before API call
          alert("Sending delete request");
          
          // Log the project ID we're trying to delete
          alert(`Attempting to delete project ${project.id}`);
          
          const response = await api.delete(`projects/delete/${project.id}/`);
          
          // Immediate check of response
          alert(`Delete response received: ${response.status}`);
      
          if (response.status === 204) {
            // Explicitly handle each async operation
            let projects;
            try {
              projects = await fetchProjects(true);
              alert("Projects fetched successfully");
            } catch (fetchError) {
              alert(`Error fetching projects: ${fetchError.message}`);
              throw fetchError;
            }
      
            let users;
            try {
              users = await fetchUsers();
              alert("Users fetched successfully");
            } catch (fetchError) {
              alert(`Error fetching users: ${fetchError.message}`);
              throw fetchError;
            }
      
            try {
              const formattedProjects = formatProjects(projects, users);
              renderProjects(formattedProjects);
              alert("Render complete");
            } catch (formatError) {
              alert(`Error formatting/rendering: ${formatError.message}`);
              throw formatError;
            }
          } else {
            alert(`Unexpected response status: ${response.status}`);
          }
        } catch (error) {
          alert(`Error in delete handler: ${error.message}`);
          console.error("Full error:", error);
        }
    });

    card.querySelector('.edit-project').addEventListener('click', () => {
        localStorage.setItem('editingProjectId', project.id);
        populateFormForEdit(project);
        document.querySelector('.submit-button').textContent = 'Update Project';
        document.querySelector('.project-form-container h2').textContent = 'Edit Project';
    });

    return card;
}


/**
 * Capitalizes the first letter of a given string.
 * 
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Formats a date string into a more readable format.
 * 
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
    if (!dateString) return '';
    //Adds 6 hours to the date to avoid timezone issues
    const date = new Date(dateString+ 'T07:00:00');
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}



/**
 * Formats the start and end dates of a project into a readable string.
 * 
 * @param {string} start - The start date of the project.
 * @param {string} end - The end date of the project.
 * @returns {string} The formatted date range string.
 */
function formatProjectDates(start, end) {
    if (!start && !end) return 'No dates set';
    if (!start) return `Due by ${formatDate(end)}`;
    if (!end) return `Started ${formatDate(start)}`;
    return `${formatDate(start)} - ${formatDate(end)}`;
}
