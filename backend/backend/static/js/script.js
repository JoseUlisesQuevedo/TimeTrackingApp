import { fetchProjects, fetchTimeEntries } from './api.js';
import { getWeekDates, formatDate, formatWeekDisplay, formatDateForInput } from './dateUtils.js';
import { updateTotalHours,saveTimeEntries } from './timeEntries.js';
import { ProjectRow } from './projectRow.js';

document.addEventListener('DOMContentLoaded', async () => {
    let projectRowManager = new ProjectRow();
    const projectRowsContainer = document.getElementById('project-rows');
    let currentDate = new Date();
    let currentWeekDates = getWeekDates(currentDate);
    
    let hasUnsavedChanges = false;

    // Initial empty row
    projectRowsContainer.appendChild(await projectRowManager.createEmptyRow());

    function detectChanges() {
        document.querySelectorAll('.time-input input').forEach(input => {
            input.addEventListener('input', () => {
                hasUnsavedChanges = true;
            });
        });
    }

    // Warn user if there are unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
        }
    });
    

    //Gets the current week's projects and entries
    async function loadProjectsAndEntries(projectRowManager,start_date = null, end_date = null) {
        try {
            // Create a new instance of ProjectRowManager
            
            
            //Gets project and relevant time Entries (based on the current week)
            const projects = await fetchProjects();
            const timeEntries = await fetchTimeEntries(start_date, end_date);

            // Clear existing project rows
            projectRowsContainer.innerHTML = '';
            projectRowsContainer.appendChild(await projectRowManager.createEmptyRow());

            for (const project of projects) {
                const entries = timeEntries.filter(entry => entry.project === project.id);
                if (entries.length > 0) {
                    const newRow = document.querySelector('.empty-row');
                    if (newRow) {
                        const newProjectRow = await projectRowManager.convertToProjectRow(newRow, project.project_name, project.id);
                        populateProjectRowWithHours(newProjectRow, entries);
                    }
                }
            }

            setTimeout(() => {
                updateTotalHours();
            }, 1000);

            detectChanges();

        } catch (error) {
            console.error('Error loading projects and entries:', error);
        }
    }

    function populateProjectRowWithHours(row, entries) {

        const timeInputs = row.querySelectorAll('.time-input');


        entries.forEach(entry => {

            const entryDate = new Date(entry.entry_date + 'T06:00:00');
            const inputIndex = currentWeekDates.findIndex(date => date.toDateString() === entryDate.toDateString());
            if (inputIndex !== -1) {
            const totalMinutes = entry.duration;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const timeInput = timeInputs[inputIndex];
            
            timeInput.querySelector('.hours-input').value = hours;
            timeInput.querySelector('.minutes-input').value = minutes;
            timeInput.dataset.entryId = entry.id; // Add entry.id to the relevant timeInput
            }
        });
    }

    function updateWeekDisplay(dates) {
        document.getElementById('week-display').textContent = formatWeekDisplay(dates);

        const dayLabels = document.querySelectorAll('.day-label');
        dates.forEach((date, index) => {
            const dayLabel = dayLabels[index];
            dayLabel.innerHTML = `
                ${date.toLocaleDateString('en-US', { weekday: 'long' })}
                <span class="day-date">${formatDate(date)}</span>
            `;
        });

        document.getElementById('week-picker-input').value = formatDateForInput(dates[0]);
        window.currentWeekDates = dates;
    }

    // Event Listeners
    document.getElementById('prev-week').addEventListener('click', () => {
        if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to navigate away?')) {
            return;
        }

        hasUnsavedChanges = false;
        currentDate.setDate(currentDate.getDate() - 7);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates); 
        projectRowManager.clearProjectRows();
        loadProjectsAndEntries(projectRowManager,currentWeekDates[0], currentWeekDates[currentWeekDates.length - 1]);
    });

    document.getElementById('next-week').addEventListener('click', () => {
        if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to navigate away?')) {
            return;
        }

        hasUnsavedChanges = false;
        currentDate.setDate(currentDate.getDate() + 7);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates); 
        projectRowManager.clearProjectRows();
        loadProjectsAndEntries(projectRowManager,currentWeekDates[0], currentWeekDates[currentWeekDates.length - 1]);
    });

    const weekPickerInput = document.getElementById('week-picker-input');
    weekPickerInput.valueAsDate = new Date();

    weekPickerInput.addEventListener('change', (e) => {
        currentDate = new Date(e.target.value);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates);
        projectRowManager.clearProjectRows();
        loadProjectsAndEntries(projectRowManager,currentWeekDates[0], currentWeekDates[currentWeekDates.length - 1]);

    });


    document.getElementById('save-time').addEventListener('click', () => {
        const projectRows = projectRowManager.getProjectRows();
        if (projectRows.size !== 0) {
            saveTimeEntries(projectRows, currentWeekDates);
            hasUnsavedChanges = false;
            alert('Time entries saved successfully');
        } else {
            alert('Failed to save time entries');
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.matches('.project-select')) {
            const emptyRow = e.target.closest('.empty-row');
            if (emptyRow && e.target.value) {
                const projectName = e.target.options[e.target.selectedIndex].text;
                const projectId = e.target.value;
                projectRowManager.convertToProjectRow(emptyRow, projectName, projectId);
            }
        }
    });

    // Initial load
    updateWeekDisplay(currentWeekDates);
    await loadProjectsAndEntries(projectRowManager,currentWeekDates[0], currentWeekDates[currentWeekDates.length - 1]);
    setTimeout(() => {
        updateTotalHours();
    }, 1000);

});