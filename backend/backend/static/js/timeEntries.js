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
    updateDayTotals();
    updateRowTotals();
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

function updateDayTotals() {
        const dayTotals = [0, 0, 0, 0, 0];
        document.querySelectorAll('.project-row').forEach(row => {
            row.querySelectorAll('.time-input').forEach((inputDiv, index) => {
                const hours = parseInt(inputDiv.querySelector('.hours-input').value) || 0;
                const minutes = parseInt(inputDiv.querySelector('.minutes-input').value) || 0;
                dayTotals[index] += hours * 60 + minutes;
            });
        });

        dayTotals.forEach((total, index) => {
            const hours = Math.floor(total / 60);
            const minutes = total % 60;
            document.getElementById(`total-${['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][index]}`).textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        });
    }

function updateRowTotals() {
    document.querySelectorAll('.project-row').forEach(row => {
        let totalMinutes = 0;
        row.querySelectorAll('.time-input').forEach(inputDiv => {
            const hours = parseInt(inputDiv.querySelector('.hours-input').value) || 0;
            const minutes = parseInt(inputDiv.querySelector('.minutes-input').value) || 0;
            totalMinutes += hours * 60 + minutes;
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalDiv = row.querySelector('.project-total');
        if (totalDiv) {
            totalDiv.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        } else {
            const newTotalDiv = document.createElement('div');
            newTotalDiv.className = 'project-total';
            newTotalDiv.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
            row.appendChild(newTotalDiv);
        }
    });
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
            else {
                if (entryId) {
                    api.delete(`timeEntries/delete/${entryId}/`).then(response => {
                        if (response.status !== 204) {
                            console.error('Failed to delete time entry', entryId);
                        }
                    });
                }
            }
        });
    });

    if (entries.length === 0) {
        alert('Please enter time for at least one day');
        return false;
    }

    return true;;
}