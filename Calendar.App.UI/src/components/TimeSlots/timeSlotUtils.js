// @flow


// hourSplitAmount; 1=hour 2=half hour, 4=15 minutes
export function CreateTimeSlots (startTime, endTime, hourSplitAmount = 1) {
    const timeSlotQty = endTime - startTime
    let bookingSlots = []
    let index = 0

    for (let i=startTime; i<startTime+timeSlotQty; i++) {
        const increment = HourSplitIncrement(hourSplitAmount)
        let currentTimeSlotMinutes = 0

        for (let j=0; j<hourSplitAmount; j++){
            bookingSlots.push(CreateTimeSlot(
                index,
                GetFormattedTime(i, currentTimeSlotMinutes), 
                GetFormattedTime(i, currentTimeSlotMinutes + increment), 
                "available"))
            currentTimeSlotMinutes = currentTimeSlotMinutes + increment
            index = index + 1
        }
    }        
    return bookingSlots
}

// Helper function to create a single time slot
function CreateTimeSlot (slotId, startTime, endTime, bookingStatus) {
    let slot = {
        slotId: slotId,
        startTime: startTime,
        endTime: endTime,
        bookingStatus: bookingStatus,
    }
    return slot
}

// Helper function to calculate the increment based on hour split amount
function HourSplitIncrement (hourSplitAmount) {
    let increment = 0

    switch(hourSplitAmount) {
        case 1:
            increment = 60
            break
        case 2:
            increment = 30
            break
        case 4:
            increment = 15
            break
        default:
            increment = 60
    }
    return increment
}

// Helper function to pad time values with leading zeros
function GetFormattedTime (hour, minute) {
    let outputHour = hour
    let outputMinute = minute
    if (outputMinute === 60) {
        outputHour = outputHour + 1
        outputMinute = 0
    }

    return `${outputHour}:${outputMinute.toLocaleString('en-AU', {minimumIntegerDigits: 2, useGrouping:false})}`
}

// export function SetBookingSlotsAsUnavailable (bookingSlots, initialSlots) {
//     return bookingSlots.map(slot => {
//         debugger
//         let newSlot = slot
//         console.log('newSlot:', newSlot);
//         if (slot && initialSlots.includes(newSlot.startTime)) {
//             newSlot.bookingStatus = "unavailable"
//         }
        
//         return newSlot
//     })
// }