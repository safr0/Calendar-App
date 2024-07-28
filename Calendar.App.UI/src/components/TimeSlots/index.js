// @flow
import React from 'react';
import { CreateTimeSlots, SetBookingSlotsAsUnavailable } from './timeSlotUtils';

class TimeSlots extends React.Component {
    constructor() {
        const bookingOpeningTime = 9
        const bookingClosingTime = 17
        const hourSplitAmount = 2
        const initialBookedSlotTimes = [ "11:00", "12:00", "12:30", "15:30" ]

        super()

        //debugger
        //console.log('Initial bookedSlotTimes:', initialBookedSlotTimes);

        this.state = {
            updateState: true,
            bookingSlots: CreateTimeSlots(bookingOpeningTime, bookingClosingTime, hourSplitAmount),
            selectedSlots: [],
            bookedSlots: [],
        }

        this.setState({bookingSlots: SetBookingSlotsAsUnavailable(this.state.bookingSlots, initialBookedSlotTimes)})                
    }

    HandleSelectionClick (object) {
        this.setState({updateState: true})
        if (object.bookingStatus === "unavailable" || object.bookingStatus === "booked") {
            // Do nothing as this slot cannot be booked
        }
        else if (object.bookingStatus === "selected") {
            if (object.slotId !== this.state.selectedSlots[0].slotId &&
                object.slotId !== this.state.selectedSlots[this.state.selectedSlots.length-1].slotId) {
                alert("You can only deselect the first or last selected time slot!")
            } 
            else {
                object.bookingStatus = "available"
                this.setState({selectedSlots: this.state.selectedSlots.filter(slots => slots.slotId !== object.slotId)})
            }
        }
        else {
            if (this.state.selectedSlots.length === 0) {
                object.bookingStatus = "selected"
                this.setState({selectedSlots: [ object ]})
            }
            else if (object.slotId !== this.state.selectedSlots[0].slotId-1 &&
                object.slotId !== this.state.selectedSlots[this.state.selectedSlots.length-1].slotId+1) {
                alert("You must select an adjacent time slot to those already selected!")
            }
            else {
                object.bookingStatus = "selected"
                this.state.selectedSlots.push(object)
                this.state.selectedSlots.sort((a, b) => {
                    return a.slotId-b.slotId
                })
            }
        }
    }

    HandleConfirmClick() {
        this.setState({bookingSlots: this.state.bookingSlots.map(slot => {
            let newSlot = slot
            if (slot.bookingStatus === "selected") {
                newSlot.bookingStatus = "booked"
            }
            return newSlot
        }),
            bookedSlots: [...this.state.bookedSlots, this.state.selectedSlots],
            selectedSlots: []
        })
    }

    HandleReturnSlotsClick(slotArray) {
        this.setState({bookingSlots: this.state.bookingSlots.map(bookingSlot => {
            let newSlot = bookingSlot
            if (slotArray.some(slot => slot.slotId === bookingSlot.slotId)) {
                newSlot.bookingStatus = "available"
            }
            return newSlot
        }),
            bookedSlots: this.state.bookedSlots.filter(bookedSlot => slotArray !== bookedSlot )
        })
    }
    
    render() {
        return (            
            <React.Fragment>
                {this.state.selectedSlots.length > 0 &&
                    <div className={"selectionWrapper"}> 
                        <h2>{"Selected Booking Time"}</h2>
                        <div>
                            <div>{`Start Time: ${this.state.selectedSlots[0].startTime} - End Time: ${this.state.selectedSlots[this.state.selectedSlots.length-1].endTime} `}
                                <button onClick={() => this.HandleConfirmClick()}>{"Confirm Booking"}</button>
                            </div>
                        </div>
                    </div>
                }
                {this.state.bookedSlots.length > 0 &&
                    <div className={"bookedSlotsWrapper"}>
                        <h2>{"Booked Times"}</h2>
                        {this.state.bookedSlots.map(slotArray => {
                            return (
                                <div>
                                    <div>
                                        {`Start Time: ${slotArray[0].startTime} - End Time: ${slotArray[slotArray.length-1].endTime} `}
                                        <button onClick={() => this.HandleReturnSlotsClick(slotArray)}>{"Return Booking"}</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
                <div className={"bookingSlotsWrapper"}>
                    {this.state.bookingSlots.map((slot) => {
                        return <div className={"bookingSlot " + slot.bookingStatus} onClick={() => this.HandleSelectionClick(slot)}>
                            <div>{`${slot.startTime} - ${slot.endTime}`}</div>
                        </div>
                    })}
                </div>
                
            </React.Fragment>
        )
    }
}

export default TimeSlots