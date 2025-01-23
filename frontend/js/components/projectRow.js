import { getTimeInHours } from '../utils/timeUtils.js';

export class ProjectRow {
    constructor(updateTotalHours) {
        this.projectRows = new Map();
        this.updateTotalHours = updateTotalHours;
    }

    createEmptyRow() {
        const row = document.createElement('div');
        row.className = 'project-row empty-row';
        
        const projectSelector = document.createElement('div');
        projectSelector.className = 'project-selector-cell';
        
        const select = document.createElement('select');
        select.className = 'project-select';
        
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // Create default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Project';
        select.appendChild(defaultOption);
        
        // Add stored projects to select
        projects
            .filter(project => project.status !== 'completed') // Only show active and on-hold projects
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
            .forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
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
                <input type="number" class="hours-input" min="0" placeholder="0" title="Hours">
                <span>h</span>
                <input type="number" class="minutes-input" min="0" max="59" placeholder="00" title="Minutes">
                <span>m</span>
            `;

            this.setupTimeInputs(inputDiv);
            timeInputs.appendChild(inputDiv);
        }

        row.appendChild(projectNameDiv);
        row.appendChild(timeInputs);

        row.querySelector('.remove-project').addEventListener('click', () => {
            row.remove();
            this.projectRows.delete(projectId);
            this.updateTotalHours();
            
            // Check if we need to add a new empty row
            if (!document.querySelector('.empty-row')) {
                document.getElementById('project-rows').appendChild(this.createEmptyRow());
            }
        });

        return row;
    }

    setupTimeInputs(inputDiv) {
        const hoursInput = inputDiv.querySelector('.hours-input');
        const minutesInput = inputDiv.querySelector('.minutes-input');

        hoursInput.addEventListener('input', () => {
            if (hoursInput.value < 0) hoursInput.value = 0;
            this.updateTotalHours();
        });

        minutesInput.addEventListener('input', () => {
            let val = parseInt(minutesInput.value);
            if (val < 0) minutesInput.value = 0;
            if (val > 59) minutesInput.value = 59;
            if (val >= 0 && val <= 9) {
                minutesInput.value = minutesInput.value.padStart(2, '0');
            }
            this.updateTotalHours();
        });
    }

    convertToProjectRow(emptyRow, projectName, projectId) {
        if (this.projectRows.has(projectId)) {
            alert('This project is already added');
            emptyRow.querySelector('select').value = '';
            return;
        }

        const newRow = this.createProjectRow(projectName, projectId);
        emptyRow.parentNode.insertBefore(newRow, emptyRow);
        this.projectRows.set(projectId, newRow);
        
        // Add new empty row if needed
        if (!emptyRow.nextSibling || !emptyRow.nextSibling.classList.contains('empty-row')) {
            const newEmptyRow = this.createEmptyRow();
            emptyRow.parentNode.insertBefore(newEmptyRow, emptyRow);
        }
        
        emptyRow.remove();
    }

    getProjectRows() {
        return this.projectRows;
    }
}