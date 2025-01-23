export function generateCalendarDates(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the first Monday before or on the first day of the month
    const start = new Date(firstDay);
    const startDay = firstDay.getDay();
    start.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));
    
    const dates = [];
    const current = new Date(start);
    
    // Generate dates until we have all days of the month plus padding
    while (current <= lastDay || dates.length % 7 !== 0 || dates.length < 28) {
        dates.push({
            date: new Date(current),
            isCurrentMonth: current.getMonth() === month,
            isToday: isSameDay(current, new Date())
        });
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

export function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

export function formatMonthYear(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getWeekRange(date) {
    const monday = new Date(date);
    console.log(monday);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    
    return { monday, friday };
} 