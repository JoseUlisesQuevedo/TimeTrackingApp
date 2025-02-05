export function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
    });
}

export function updateWeekDisplay(dates) {
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

export function formatWeekDisplay(dates) {
    const firstDay = dates[0];
    const lastDay = dates[dates.length - 1];
    const sameMonth = firstDay.getMonth() === lastDay.getMonth();
    const sameYear = firstDay.getFullYear() === lastDay.getFullYear();

    if (sameMonth && sameYear) {
        return `${firstDay.toLocaleDateString('en-US', { month: 'long' })} ${firstDay.getFullYear()}`;
    } else if (sameYear) {
        return `${firstDay.toLocaleDateString('en-US', { month: 'short' })} - ${lastDay.toLocaleDateString('en-US', { month: 'long' })} ${lastDay.getFullYear()}`;
    } else {
        return `${firstDay.toLocaleDateString('en-US', { month: 'short' })} ${firstDay.getFullYear()} - ${lastDay.toLocaleDateString('en-US', { month: 'short' })} ${lastDay.getFullYear()}`;
    }
}

export function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// This function takes a date and returns an array of dates for the work week (Mon-Fri)
// containing that date
export function getWeekDates(date) {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    
    const daysToSubtract = dayOfWeek === 0 ? -1 : dayOfWeek === 6 ? 5 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - daysToSubtract);
    monday.setHours(0, 0, 0, 0); // Set to 00:00:00

    const dates = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        if (i === 4) {
            day.setHours(23, 59, 59, 999); // Set last day to 23:59:59
        }
        dates.push(day);
    }
    return dates;
}