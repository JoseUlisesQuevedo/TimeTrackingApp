import { getTimeInHours, formatTimeDisplay } from './timeUtils.js';
import api from './api.js';


export function updateTotalHours() {
    
    let total = 0;
    document.querySelectorAll('.time-input').forEach(timeInput => {
        const hoursInput = timeInput.querySelector('.hours-input');
        const minutesInput = timeInput.querySelector('.minutes-input');
        total += getTimeInHours(hoursInput, minutesInput);
    });
    document.getElementById('total-hours').textContent = formatTimeDisplay(total);
}

export function populateTimeEntries(entries,projects) { 

    entries.forEach(entry => {
        const row = document.querySelector(`.project-row[data-project-id="${entry.project}"]`);
        const timeInput = row.querySelector(`.time-input:nth-child(${entry.dayIndex + 1})`);
        const hoursInput = timeInput.querySelector('.hours-input');
        const minutesInput = timeInput.querySelector('.minutes-input');
        hoursInput.value = Math.floor(entry.hours);
        minutesInput.value = (entry.hours % 1) * 60;
    });
    updateTotalHours();
}


export function saveTimeEntries(projectRows,dateRange) {
    const entries = [];
    projectRows.forEach((row, projectId) => {
        const timeInputs = row.querySelectorAll('.time-input');
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        
        timeInputs.forEach((input, index) => {
            const hoursInput = input.querySelector('.hours-input');
            const minutesInput = input.querySelector('.minutes-input');
            const totalHours = getTimeInHours(hoursInput, minutesInput);
            const entryId = input.dataset.entryId;

            if (totalHours > 0) {
                const entry = {
                    project: projectId,
                    day: days[index],
                    hours: totalHours
                };

                if (entryId) {
                    entry.id = entryId;
                    let entry_date = new Date(dateRange[index]).toISOString().split('T')[0];
                    let payload = {
                        "id": entryId,
                        "duration": totalHours * 60,
                        "project": projectId,
                        "entry_date": entry_date

                    };
                    api.patch(`timeEntries/update/${entryId}/`, payload).then(response => {
                        if (response.status !== 200) {
                            console.error('Failed to update time entry', entryId);
                        }
                    });
                    
                } else {
                    let entry_date = new Date(dateRange[index]).toISOString().split('T')[0];
                    let payload = {
                        "duration": totalHours * 60,
                        "project": projectId,
                        "entry_date": entry_date
                    };
                    api.post('timeEntries/', payload).then(response => {
                        if (response.status !== 201) {
                            console.error('Failed to create time entry');
                        }
                    });
                }

                entries.push(entry);
            }
        });
    });

    if (entries.length === 0) {
        alert('Please enter time for at least one day');
        return false;
    }

    return true;;
}