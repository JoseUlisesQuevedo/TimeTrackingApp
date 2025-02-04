import api from './api.js';
import { fetchProjects, fetchUsers } from './api.js';
import { formatProjects, renderProjects } from './projectCards.js';



  export function addFormListeners(projectForm) {

        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            //Gets all the data from the form
            const projectData = {
                project_name: document.getElementById('project-name').value,
                description: document.getElementById('project-description').value,
                start_date: document.getElementById('project-start').value,
                end_date: document.getElementById('project-end').value,
                status: document.getElementById('project-status').value,
                tech_lead: document.getElementById('tech-lead').value,
                business_lead: document.getElementById('business-lead').value,
                area: document.getElementById('project-area').value
            };

            let editingProjectId = localStorage.getItem('editingProjectId');

            if (editingProjectId !== "null") {
                // Update existing project
                // Remove any null or empty values from projectData
                Object.keys(projectData).forEach(key => {
                    if (projectData[key] === null || projectData[key] === '') {
                        delete projectData[key];
                    }
                });
                // Use api.put to update the project
                api.patch(`projects/update/${editingProjectId}/`, projectData)
                    .then(async response => {
                        if (response.status === 200) {
                            let projects = await fetchProjects();
                            let users = await fetchUsers();
                            projects = formatProjects(projects, users);
                            renderProjects(projects);
                            resetForm();
                        }
                    })
                    .catch(error => {
                        console.error('Error updating project:', error);
            });
            } else {
                // Create new project
                // Remove any null or empty values from projectData
                Object.keys(projectData).forEach(key => {
                    if (projectData[key] === null || projectData[key] === '') {
                        delete projectData[key];
                    }
                });
                // Use api.post to create a new project
                api.post("projects/", projectData)
                    .then(async response => {
                        if (response.status === 201) {
                            let projects = await fetchProjects();
                            let users = await fetchUsers();
                            projects = formatProjects(projects, users);
                            renderProjects(projects);
                            resetForm();
                            
                        }
                    })
                    .catch(error => {
                        console.error('Error creating project:', error);
                    });
            }
        });

        // Add cancel button to form
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = resetForm;
        document.querySelector('.submit-button').insertAdjacentElement('beforebegin', cancelButton);
    }

export function populateUserOptions(users, selectElement) {
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.username;
        selectElement.appendChild(option);
    });
}



function resetForm() {
    const projectForm = document.getElementById('project-form');
    localStorage.setItem('editingProjectId', null);
    projectForm.reset();
    document.querySelector('.submit-button').textContent = 'Create Project';
    document.querySelector('.project-form-container h2').textContent = 'Add New Project';
}


function selectOptionByText(selectId, text) {
    const select = document.getElementById(selectId);
    for (let option of select.options) {
        if (option.text === text) {
            select.value = option.value;
            break;
        }
    }
}



export function populateFormForEdit(project) {
    document.getElementById('project-name').value = project.project_name;
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-start').value = project.start_date || '';
    document.getElementById('project-end').value = project.end_date || '';
    document.getElementById('project-status').value = project.status;
    
    // Find and select the correct option for tech lead and business lead
    selectOptionByText('tech-lead', project.techLead);
    selectOptionByText('business-lead', project.businessLead);
    
    document.getElementById('project-area').value = project.area;
}