import { getWeekDates, formatDate, formatWeekDisplay, formatDateForInput } from './dateUtils.js';
import { formatTimeDisplay, getTimeInHours } from './timeUtils.js';
import { updateTotalHours } from './timeEntries.js';
import { saveTimeEntries } from './timeEntries.js';
import { ProjectRow } from './projectRow.js';
import { fetchTimeEntries } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    

    const projectRowManager = new ProjectRow();
    let timeEntries = await fetchTimeEntries();
    console.log(JSON.stringify(timeEntries));

    // Function to refresh empty row when returning to the page
    async function refreshEmptyRow() {
        const existingEmptyRow = document.querySelector('.empty-row');
        if (existingEmptyRow) {
            const newEmptyRow = await projectRowManager.createEmptyRow();
            existingEmptyRow.replaceWith(newEmptyRow);
        } else {
            document.getElementById('project-rows').appendChild(await projectRowManager.createEmptyRow());
        }
    }

    // Initial empty row
    document.getElementById('project-rows').appendChild(await projectRowManager.createEmptyRow());

    // Refresh project list when the page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            refreshEmptyRow();
        }
    });

    let currentDate = new Date();
    let currentWeekDates = getWeekDates(currentDate);

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
        currentDate.setDate(currentDate.getDate() - 7);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates);
    });

    document.getElementById('next-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates);
    });

    const weekPickerInput = document.getElementById('week-picker-input');
    weekPickerInput.valueAsDate = new Date();

    weekPickerInput.addEventListener('change', (e) => {
        currentDate = new Date(e.target.value);
        currentWeekDates = getWeekDates(currentDate);
        updateWeekDisplay(currentWeekDates);
    });

    document.getElementById('save-time').addEventListener('click', () => {
        if (saveTimeEntries(projectRowManager.getProjectRows())) {
        }
    });

    // Add project selection handler
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

    // Initialize the week display
    updateWeekDisplay(currentWeekDates);
});