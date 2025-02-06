import { fetchProjects, fetchUsers } from './api.js';
import { formatProjects, createProjectCard, renderProjects } from './projectCards.js';
import { addFormListeners, populateUserOptions } from './projectForm.js';

// Start fetching data immediately
const projectsPromise = fetchProjects();
const usersPromise = fetchUsers();

document.addEventListener('DOMContentLoaded', async () => {
    // Identifies Form and List
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    const techLeadSelect = document.getElementById('tech-lead');
    const businessLeadSelect = document.getElementById('business-lead');

    addFormListeners(projectForm);

    try {
        // Wait for both fetches to complete
        const [projects, users] = await Promise.all([projectsPromise, usersPromise]);

        // Populate Tech Lead and Business Lead options
        populateUserOptions(users, techLeadSelect);
        populateUserOptions(users, businessLeadSelect);

        // Formats projects to card format
        const formattedProjects = formatProjects(projects, users);
        // Initial render
        renderProjects(formattedProjects);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
