import { fetchProjects, fetchUsers } from './api.js';
import { AREA_MAPPING, STATUS_MAPPING } from './constants.js';
import  {formatProjects, createProjectCard, renderProjects} from './projectCards.js';
import { addFormListeners,populateUserOptions } from './projectForm.js';


document.addEventListener('DOMContentLoaded', async () => {



    //Identifies Form and List
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    const techLeadSelect = document.getElementById('tech-lead');
    const businessLeadSelect = document.getElementById('business-lead');

    addFormListeners(projectForm);



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


    

});