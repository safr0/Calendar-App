// @flow
import React, { useState, useEffect } from 'react';
import { CreateTimeSlots, SetBookingSlotsAsUnavailable } from './timeSlotUtils';
import axios from 'axios';

export default function TimeSlots() {    
    
        const bookingOpeningTime = 9
        const bookingClosingTime = 17
        const hourSplitAmount = 2
        const initialBookedSlotTimes = [ "11:00", "12:00", "12:30", "15:30" ]

        const [bookingSlots, setBookingSlotsState] = useState<[any]>([]);        
        const [bookedSlots, setBookedSlotsState] = useState<[any]>([]);
        const [initialized, setInitializedState] = useState(false); // New state to track initialization        
        const [selectedSlots, setSelectedSlotsState] = useState<[any]>([]);        

        const [updateState, setUpdateState] = useState<boolean>(true);        
            
    // Empty dependency array means this useEffect will run once after the initial render
    useEffect(() => {
        var availableBookingSlots = CreateTimeSlots(bookingOpeningTime, bookingClosingTime, hourSplitAmount);
        setBookingSlotsState(availableBookingSlots);
    }, []); 
    
    // This will run whenever bookingSlots and initialized changes i.e. only once
    useEffect(() => {
        if (!initialized && bookingSlots && bookingSlots.length > 0) {
            //console.log('bookingSlots:', bookingSlots);
            var unavailableSlots = SetBookingSlotsAsUnavailable(bookingSlots, initialBookedSlotTimes);
            setBookingSlotsState(unavailableSlots);
            setInitializedState(true); 
        }
        
    }, [bookingSlots, initialized]); 
    
    const HandleSelectionClick = (object) =>{
        setUpdateState({updateState: true});
                
        if (!object || !object.slotId) return; 
        
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
                setSelectedSlotsState([object]);
            }
            else if (object.slotId !== selectedSlots[0].slotId-1 &&
                object.slotId !== selectedSlots[selectedSlots.length-1].slotId+1) {
                alert("You must select an adjacent time slot to those already selected!")
            }
            else {
                object.bookingStatus = "selected"                
                const newSelectedSlots = [...selectedSlots, object].sort((a, b) => a.slotId - b.slotId);
                setSelectedSlotsState(newSelectedSlots);
            }
        }
    }

    const HandleConfirmClick=() => {        
        const updatedBookingSlots = bookingSlots.map(slot => {
            let newSlot = slot;
            if (slot && slot.bookingStatus === "selected") {
                newSlot.bookingStatus = "booked";
            }
            return newSlot;
        });
        setBookingSlotsState(updatedBookingSlots);
        setBookedSlotsState([...bookedSlots, ...selectedSlots]);
        setSelectedSlotsState([]);
    }

    const HandleReturnSlotsClick=(slot)=> {
        if (!slot || !slot.slotId) return; 

        const updatedBookingSlots = bookingSlots.map(bookingSlot => {
            let newSlot = { ...bookingSlot }; 
            if (slot.slotId === bookingSlot.slotId) {
                newSlot.bookingStatus = "available";
            }
            return newSlot;
        });
        setBookingSlotsState(updatedBookingSlots);        
        setBookedSlotsState(bookedSlots.filter(bookedSlot => bookedSlot.slotId !== slot.slotId));
    }
    
    
    return (            
        <React.Fragment>            
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
            { bookedSlots && bookedSlots.length > 0 &&
                <div className={"bookedSlotsWrapper"}>
                    <h2>{"Booked Times"}</h2>                                        
                    {bookedSlots.map(slot => {
                        
                        return (
                            <div>
                                <div>                                                                                                            
                                    `Start Time: ${slot.startTime} - End Time: ${slot.endTime} `                                    
                                    <button onClick={() => HandleReturnSlotsClick(slot)}>{"Return Booking"}</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }            
            <div className={"bookingSlotsWrapper"}>
                {bookingSlots.map((slot) => {                
                        return <div className={"bookingSlot " + slot.bookingStatus} onClick={() => HandleSelectionClick(slot)}>
                        <div>{`${slot.startTime} - ${slot.endTime}`}</div>
                    </div>                                        
                })}                
            </div>
            
        </React.Fragment>
    );    
}