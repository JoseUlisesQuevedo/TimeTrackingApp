import api from './api.js';
import { AREA_MAPPING, STATUS_MAPPING, CACHE_EXPIRY } from './constants.js';

async function getUsers() {
    try {
        const response = await api.get('users/');
        if (response.status===200) {
            return await response.data;
        }
        throw new Error('Failed to get users');
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

async function getProjects() {
    try {
        const response = await api.get('projects/');
        if (response.status===200) {
            return await response.data;
        }
        throw new Error('Failed to get projects');
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}

//TODO: Change username to name when model is updated
function formatProjects(projects,users) {

    return projects.map(project => {
        const techLead = users.find(user => user.id === project.tech_lead);
        const businessLead = users.find(user => user.id === project.business_lead);
        return {
            ...project,
            techLead: techLead ? techLead.username : 'None',
            businessLead: businessLead ? businessLead.username : 'None',
            area: AREA_MAPPING[project.area] || 'Unknown',
            status: STATUS_MAPPING[project.status] || 'Unknown'
        };
    });
}


async function fetchUsers() {
    const cachedUsers = JSON.parse(localStorage.getItem("cached_users"));
    const cacheTime = localStorage.getItem("user_cache_timestamp");

    if (cachedUsers && cacheTime && Date.now() - cacheTime < CACHE_EXPIRY) {
        console.log("Using cached users");
        return cachedUsers;
    }

    try {
        const users = await getUsers();
    
        localStorage.setItem("cached_users", JSON.stringify(users));
        localStorage.setItem("user_cache_timestamp", Date.now()); // Save timestamp
        console.log("Fetched users from API");
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}


document.addEventListener('DOMContentLoaded', async () => {

    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    let editingProjectId = null;
    
    // Get projects from the API
    console.log('Getting projects...');
    let projects = await getProjects();
    console.log(projects);

    // Get users from the API
    console.log('Getting users...');
    let users = await fetchUsers();
    console.log(users);


    projects = formatProjects(projects, users);
    localStorage.setItem("formatted_projects",JSON.stringify(projects));


    

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const statusClass = `status-${project.status.toLowerCase().replace(" ","-")}`;
        const dates = formatProjectDates(project.start_date, project.end_date);

        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-title">${project.project_name}</h3>
                <span class="project-status ${statusClass}">${capitalizeFirstLetter(project.status)}</span>
            </div>
            <div class="project-card-body">
                ${project.description || 'No description provided'}
                <div class="project-details">
                    <div class="detail-item">
                        <strong>Area:</strong> ${capitalizeFirstLetter(project.area)}
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

        card.querySelector('.delete-project').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this project?')) {
                projects = projects.filter(p => p.id !== project.id);
                saveProjects();
                renderProjects();
            }
        });

        card.querySelector('.edit-project').addEventListener('click', () => {
            editingProjectId = project.id;
            populateFormForEdit(project);
            document.querySelector('.submit-button').textContent = 'Update Project';
            document.querySelector('.project-form-container h2').textContent = 'Edit Project';
            projectForm.scrollIntoView({ behavior: 'smooth' });
        });

        return card;
    }


    function populateFormForEdit(project) {
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

    function selectOptionByText(selectId, text) {
        const select = document.getElementById(selectId);
        for (let option of select.options) {
            if (option.text === text) {
                select.value = option.value;
                break;
            }
        }
    }

    function resetForm() {
        projectForm.reset();
        editingProjectId = null;
        document.querySelector('.submit-button').textContent = 'Create Project';
        document.querySelector('.project-form-container h2').textContent = 'Add New Project';
    }

    function formatProjectDates(start, end) {
        if (!start && !end) return 'No dates set';
        if (!start) return `Due by ${formatDate(end)}`;
        if (!end) return `Started ${formatDate(start)}`;
        return `${formatDate(start)} - ${formatDate(end)}`;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function renderProjects() {
        projectsList.innerHTML = '';
        projects.forEach(project => {
            projectsList.appendChild(createProjectCard(project));
        });
    }

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectData = {
            project_name: document.getElementById('project-name').value,
            description: document.getElementById('project-description').value,
            start_date: document.getElementById('project-start').value,
            end_date: document.getElementById('project-end').value,
            status: document.getElementById('project-status').value,
            techLead: document.getElementById('tech-lead').options[
                document.getElementById('tech-lead').selectedIndex
            ].text,
            businessLead: document.getElementById('business-lead').options[
                document.getElementById('business-lead').selectedIndex
            ].text,
            area: document.getElementById('project-area').value
        };

        if (editingProjectId) {
            // Update existing project
            const index = projects.findIndex(p => p.id === editingProjectId);
            if (index !== -1) {
                projects[index] = { ...projects[index], ...projectData };
            }
        } else {
            // Create new project
            projectData.id = Date.now().toString();
            projects.push(projectData);
        }

        saveProjects();
        renderProjects();
        resetForm();
    });

    // Add cancel button to form
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = resetForm;
    document.querySelector('.submit-button').insertAdjacentElement('beforebegin', cancelButton);

    // Initial render
    renderProjects();
}); 