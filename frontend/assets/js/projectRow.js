import { getTimeInHours } from './timeUtils.js';
import { updateTotalHours } from './timeEntries.js';
import api, { fetchProjects } from './api.js';

export class ProjectRow {
    constructor() {
        this.projectRows = new Map();
    }

    async createEmptyRow() {
        const row = document.createElement('div');
        row.className = 'project-row empty-row';
        
        const projectSelector = document.createElement('div');
        projectSelector.className = 'project-selector-cell';
        
        const select = document.createElement('select');
        select.className = 'project-select';
        
        // Get projects from localStorage
        let projects = await fetchProjects();
        projects = projects.filter(project => project.status !== 'completed');

        // Create default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Project';
        select.appendChild(defaultOption);

        // Add stored projects to select
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.project_name;
            select.appendChild(option);
        });
        

        projectSelector.appendChild(select);
        row.appendChild(projectSelector);

        const timeInputs = document.createElement('div');
        timeInputs.className = 'time-inputs empty';
        for (let i = 0; i < 5; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'time-input-placeholder';
            timeInputs.appendChild(placeholder);
        }
        row.appendChild(timeInputs);

        return row;
    }

    createProjectRow(projectName, projectId) {
        const row = document.createElement('div');
        row.className = 'project-row';
        row.dataset.projectId = projectId;

        const projectNameDiv = document.createElement('div');
        projectNameDiv.className = 'project-name';
        projectNameDiv.innerHTML = `
            <span>${projectName}</span>
            <button class="remove-project">×</button>
        `;

        const timeInputs = document.createElement('div');
        timeInputs.className = 'time-inputs';
        
        for (let i = 0; i < 5; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'time-input';
            inputDiv.innerHTML = `
            <input type="number" class="hours-input" id="hours-input-${projectId}-${i}" min="0" placeholder="0" title="Hours">
            <span>h</span>
            <input type="number" class="minutes-input" id="minutes-input-${projectId}-${i}" min="0" max="59" placeholder="00" title="Minutes">
            <span>m</span>
            `;

            this.setupTimeInputs(inputDiv);
            timeInputs.appendChild(inputDiv);
        }

        row.appendChild(projectNameDiv);
        row.appendChild(timeInputs);

        row.querySelector('.remove-project').addEventListener('click',async () => {
            row.remove();
            this.projectRows.delete(projectId);
            updateTotalHours();
            
            // Check if we need to add a new empty row
            if (!document.querySelector('.empty-row')) {
                document.getElementById('project-rows').appendChild(await this.createEmptyRow());
            }
        });

        return row;
    }

    setupTimeInputs(inputDiv) {
        const hoursInput = inputDiv.querySelector('.hours-input');
        const minutesInput = inputDiv.querySelector('.minutes-input');

        hoursInput.addEventListener('input', () => {
            if (hoursInput.value < 0) hoursInput.value = 0;
            updateTotalHours();
        });

        minutesInput.addEventListener('input', () => {
            let val = parseInt(minutesInput.value);
            if (val < 0) minutesInput.value = 0;
            if (val > 59) minutesInput.value = 59;
            if (val >= 0 && val <= 9) {
                minutesInput.value = minutesInput.value.padStart(2, '0');
            }
            updateTotalHours();
        });
    }

    async convertToProjectRow(emptyRow, projectName, projectId) {

        console.log("These are the projects in projectRows: ",this.projectRows);
        projectId = parseInt(projectId, 10);
        if (this.projectRows.has(projectId)) {
            alert('This project is already added' + "id:" + projectId);
            emptyRow.querySelector('select').value = '';
            return;
        }

        const newRow = this.createProjectRow(projectName, projectId);

        if (emptyRow.parentNode) {
            emptyRow.parentNode.insertBefore(newRow, emptyRow);
        } else {
            console.error('emptyRow is not attached to the DOM');
        }

        this.projectRows.set(projectId, newRow);
        
        // Add new empty row if needed
        if (!emptyRow.nextSibling || !emptyRow.nextSibling.classList.contains('empty-row')) {
            const newEmptyRow = await this.createEmptyRow();
            emptyRow.parentNode.insertBefore(newEmptyRow, emptyRow);
        }
        
        emptyRow.remove();
        return newRow;
    }

    clearProjectRows(){
        this.projectRows.clear();
    }

    getProjectRows() {
        return this.projectRows;
    }
}