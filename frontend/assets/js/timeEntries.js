import { getTimeInHours, formatTimeDisplay } from './timeUtils.js';


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
    console.log(dateRange);
    projectRows.forEach((row, projectId) => {
        const timeInputs = row.querySelectorAll('.time-input');
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        
        timeInputs.forEach((input, index) => {
            const hoursInput = input.querySelector('.hours-input');
            const minutesInput = input.querySelector('.minutes-input');
            const totalHours = getTimeInHours(hoursInput, minutesInput);

            if (totalHours > 0) {
                entries.push({
                    project: projectId,
                    day: days[index],
                    hours: totalHours
                });
            }
        });
    });

    if (entries.length === 0) {
        alert('Please enter time for at least one day');
        return false;
    }

    return true;
}