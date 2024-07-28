// @flow
import React, { useState, useEffect } from 'react';
import { CreateTimeSlots } from './timeSlotUtils';
import axios from 'axios';

export default function TimeSlots() {    
    
        const bookingOpeningTime = 9
        const bookingClosingTime = 17
        const hourSplitAmount = 2
        const initialBookedSlotTimes = [ "11:00", "12:00", "12:30", "15:30" ]

        const [bookingSlots, setBookingSlotsState] = useState<[any]>([]);        
        const [updateState, setUpdateState] = useState<boolean>(true);        
        const [selectedSlots, setSelectedSlotsState] = useState<[any]>([]);
        const [availableSlots, setAvailableSlotsState] = useState<[any]>([]);
        
    useEffect(() => {
        var availableBookingSlots = CreateTimeSlots(bookingOpeningTime, bookingClosingTime, hourSplitAmount);                
        setBookingSlotsState({bookingSlots: availableBookingSlots});       
        
       var unavailableSlots = SetBookingSlotsAsUnavailable(bookingSlots, initialBookedSlotTimes);       
       //console.log('unavailableSlots', unavailableSlots);

      }, [bookingSlots]); // Empty dependency array means this useEffect will run once after the initial render
    
    function SetBookingSlotsAsUnavailable (bookingSlots, initialSlots) {
        return bookingSlots.map(slot => {
            debugger
            let newSlot = slot
            console.log('newSlot:', newSlot);
            if (slot && initialSlots.includes(newSlot.startTime)) {
                newSlot.bookingStatus = "unavailable"
            }
            
            return newSlot
        })
    }

    

    // function SetBookingSlotsAsUnavailable(bookingSlots, initialSlots) {
        
    //     if (!Array.isArray(bookingSlots)) {
    //         console.error('bookingSlots is not an array:', bookingSlots);
    //         return [];
    //     }

    //     console.log('Received bookingSlots:', bookingSlots);
    //     console.log('Received initialSlots:', initialSlots);
    //     let unavailableSlots = [];

    //     for (let slot of initialSlots) {
    //         debugger
    //         if (bookingSlots.includes(slot)) {
    //             unavailableSlots.push(slot);
    //         }
    //     }

    //     return unavailableSlots;
    // }

    const HandleSelectionClick = (object) =>{
        setUpdateState({updateState: true});

        if (object.bookingStatus === "unavailable" || object.bookingStatus === "booked") {
            // Do nothing as this slot cannot be booked
        }
        else if (object.bookingStatus === "selected") {
            if (object.slotId !== selectedSlots[0].slotId &&
                object.slotId !== selectedSlots[selectedSlots.length-1].slotId) {
                alert("You can only deselect the first or last selected time slot!")
            } 
            else {
                object.bookingStatus = "available"
                setSelectedSlotsState({selectedSlots: selectedSlots.filter(slots => slots.slotId !== object.slotId)})
            }
        }
        else {
            if (selectedSlots.length === 0) {
                object.bookingStatus = "selected"
                setSelectedSlotsState({selectedSlots: [ object ]})
            }
            else if (object.slotId !== selectedSlots[0].slotId-1 &&
                object.slotId !== selectedSlots[selectedSlots.length-1].slotId+1) {
                alert("You must select an adjacent time slot to those already selected!")
            }
            else {
                object.bookingStatus = "selected"
                selectedSlots.push(object)
                selectedSlots.sort((a, b) => {
                    return a.slotId-b.slotId
                })
            }
        }
    }

    const HandleConfirmClick=() => {
        setBookingSlotsState({bookingSlots: bookingSlots.map(slot => {
            let newSlot = slot
            if ( slot && slot.bookingStatus === "selected") {
                newSlot.bookingStatus = "booked"
            }
            return newSlot
        }),
            availableSlots: [...availableSlots, selectedSlots],
            selectedSlots: []
        })
    }

    const HandleReturnSlotsClick=(slotArray)=> {
        setBookingSlotsState({bookingSlots: bookingSlots.map(bookingSlot => {
            let newSlot = bookingSlot
            if (availableSlots && slotArray.some(slot => slot.slotId === bookingSlot.slotId)) {
                newSlot.bookingStatus = "available"
            }
            return newSlot
        }),
            availableSlots: availableSlots.filter(bookedSlot => slotArray !== bookedSlot )
        })
    }
    
    
    return (            
        <React.Fragment>
            <div>hello world</div>
            { selectedSlots && selectedSlots.length > 0 &&
                <div className={"selectionWrapper"}> 
                    <h2>{"Selected Booking Time"}</h2>
                    <div>
                        <div>{`Start Time: ${selectedSlots[0].startTime} - End Time: ${selectedSlots[selectedSlots.length-1].endTime} `}
                            <button onClick={() => HandleConfirmClick()}>{"Confirm Booking"}</button>
                        </div>
                    </div>
                </div>
            }
            
            {availableSlots && availableSlots.length > 0 &&
                <div className={"availableSlotsWrapper"}>
                    <h2>{"Booked Times"}</h2>                    
                    {/* {console.log('availableSlots:', availableSlots)} */}
                    {availableSlots.map(slotArray => {
                        
                        return (
                            <div>
                                <div>                                                                                                            
                                    `Start Time: ${slotArray.startTime} - End Time: ${slotArray.endTime} `                                    
                                    <button onClick={() => HandleReturnSlotsClick(slotArray)}>{"Return Booking"}</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            
            {/* <div className={"bookingSlotsWrapper"}>
                {bookingSlots.map((slot) => {                
                        return <div className={"bookingSlot " + slot.bookingStatus} onClick={() => HandleSelectionClick(slot)}>
                        <div>{`${slot.startTime} - ${slot.endTime}`}</div>
                    </div>                                        
                })}
            </div> */}
            
        </React.Fragment>
    );    
}