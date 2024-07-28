import axios from 'axios';

const fetchInitialSlots = async () => {
    try {
        const response = await axios.get('/api/TimeSlot/InitialSlots');
        console.log('Initial Slots:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching initial slots:', error);
        throw error;
    }
};

// Example usage
fetchInitialSlots().then(initialSlots => {
    console.log('Fetched initial slots:', initialSlots);
}).catch(error => {
    console.error('Failed to fetch initial slots:', error);
});