import { fetchProjects, fetchUsers } from './api.js';
import { AREA_MAPPING, STATUS_MAPPING } from './constants.js';
import  {formatProjects, createProjectCard} from './projectCards.js';


document.addEventListener('DOMContentLoaded', async () => {

    //Identifies Form and List
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    const techLeadSelect = document.getElementById('tech-lead');
    const businessLeadSelect = document.getElementById('business-lead');
    //Flag for project edition
    let editingProjectId = null;

    //Tries initial fetches and renderings
    try {

        //API Calls
        let projects = await fetchProjects();
        let users = await fetchUsers();

        // Populate Tech Lead and Business Lead options
        populateUserOptions(users, techLeadSelect);
        populateUserOptions(users, businessLeadSelect);

        //Formats projects to card format
        projects = formatProjects(projects, users);
        //initial render
        renderProjects(projects);
    } catch (error) {
        console.error('Error during initialization:', error);
    }

    function populateUserOptions(users, selectElement) {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            selectElement.appendChild(option);
        });
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

   


  
    function renderProjects(projects) {
        console.log("Rendering projects", projects);
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
        renderProjects(projects);
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

});