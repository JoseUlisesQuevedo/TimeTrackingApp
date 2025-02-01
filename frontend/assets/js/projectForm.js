



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
                techLead: document.getElementById('tech-lead').options[
                    document.getElementById('tech-lead').selectedIndex
                ].text,
                businessLead: document.getElementById('business-lead').options[
                    document.getElementById('business-lead').selectedIndex
                ].text,
                area: document.getElementById('project-area').value
            };


            console.log("Project Data", projectData);
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
    projectForm.reset();
    editingProjectId = null;
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