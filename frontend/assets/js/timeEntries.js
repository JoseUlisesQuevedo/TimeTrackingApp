import { getTimeInHours } from './timeUtils.js';


export function updateTotalHours() {
    let total = 0;
    document.querySelectorAll('.time-input').forEach(timeInput => {
        const hoursInput = timeInput.querySelector('.hours-input');
        const minutesInput = timeInput.querySelector('.minutes-input');
        total += getTimeInHours(hoursInput, minutesInput);
    });
    document.getElementById('total-hours').textContent = formatTimeDisplay(total);
}

export function saveTimeEntries(projectRows) {
    const entries = [];
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

    console.log('Saving entries:', entries);
    return true;
}