export function getTimeInHours(hoursInput, minutesInput) {
    const hours = parseFloat(hoursInput.value) || 0;
    const minutes = parseFloat(minutesInput.value) || 0;
    return hours + (minutes / 60);
}

export function formatTimeDisplay(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
} 