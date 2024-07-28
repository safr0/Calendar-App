// @flow

// hourSplitAmount; 1=hour 2=half hour, 4=15 minutes
export function CreateTimeSlots(startTime, endTime, hourSplitAmount = 1) {
    const timeSlotQty = endTime - startTime;
    let bookingSlots = [];
    let index = 0;

    for (let i = startTime; i < startTime + timeSlotQty; i++) {
        const increment = HourSplitIncrement(hourSplitAmount);
        let currentTimeSlotMinutes = 0;

        for (let j = 0; j < hourSplitAmount; j++) {
            bookingSlots.push(CreateTimeSlot(index, i, currentTimeSlotMinutes));
            currentTimeSlotMinutes += increment;
            index++;
        }
    }

    return bookingSlots;
}

// Helper function to calculate the increment based on hour split amount
function HourSplitIncrement(hourSplitAmount) {
    return 60 / hourSplitAmount;
}

// Helper function to create a single time slot
function CreateTimeSlot(index, hour, minutes) {
    const timeSlot = `${PadTime(hour)}:${PadTime(minutes)}`;
    return {
        index,
        timeSlot,
        available: true,
    };
}

// Helper function to pad time values with leading zeros
function PadTime(time) {
    return time.toString().padStart(2, '0');
}

export function SetBookingSlotsAsUnavailable(bookingSlots, initialBookedSlotTimes) {
    return bookingSlots.map(slot => {
        if (initialBookedSlotTimes.includes(slot.time)) {
            return { ...slot, unavailable: true };
        }
        return slot;
    });
}