import { getTimeInHours } from '../utils/timeUtils.js';

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