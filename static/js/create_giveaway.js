document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create_giveaway_form');
    const channelSelect = document.getElementById('channel_select');
    const endDateInput = document.getElementById('end_date');
    const giveawayMessage = document.getElementById('giveawayMessage');
    const endDateError = document.getElementById('endDateError'); // Get the error message element
    const backendBaseUrl = 'https://backend-production-5459.up.railway.app';
    const telegramWebApp = Telegram.WebApp;
    const initData = telegramWebApp.initDataUnsafe;
    const userId = initData?.user?.id;

    // Function to fetch and populate channels for the user
    async function fetchChannels() {
        try {
            const response = await fetch(`${backendBaseUrl}/get_user_channels?user_id=${localStorage.getItem('user_id')}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.channels) {
                populateChannelDropdown(data.channels);
            } else {
                giveawayMessage.textContent = data.message || 'Could not fetch channels.';
            }
        } catch (error) {
            console.error('Fetch channels error:', error);
            giveawayMessage.textContent = 'Failed to load channels. Please check your connection.';
        }
    }

    // Function to populate the channel dropdown
    function populateChannelDropdown(channels) {
        channelSelect.innerHTML = '<option value="" disabled selected>Select your channel</option>'; // Clear existing options and reset default
        channels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.id;
            option.textContent = channel.username ? `${channel.username} (ID: ${channel.id})` : `Channel ID: ${channel.id}`;
            channelSelect.appendChild(option);
        });
    }

    // Function to validate end date
    function validateEndDate() {
        const selectedEndDate = new Date(endDateInput.value);
        const now = new Date();
        endDateError.textContent = ''; // Clear any previous error message
        endDateInput.setCustomValidity(''); // Clear any previous custom validity

        if (selectedEndDate <= now) {
            endDateError.textContent = 'End date must be in the future.';
            endDateInput.setCustomValidity('End date must be in the future.'); // Set custom validity to prevent form submission
            return false;
        }
        return true;
    }

    // Event listener for end date input to perform real-time validation
    endDateInput.addEventListener('change', validateEndDate);


    // Event listener for form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        if (!validateEndDate()) { // Validate the date again on form submission
            return; // Stop submission if date is invalid
        }

        giveawayMessage.textContent = 'Creating giveaway...';

        const channelId = channelSelect.value;
        const giveawayName = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        const endDate = endDateInput.value; // Get the date value directly from the input

        const giveawayData = {
            user_id: localStorage.getItem('user_id'), // Assuming user_id is stored in localStorage
            channel_id: channelId,
            name: giveawayName,
            prize_amount: prizeAmount,
            participants_count: participantsCount,
            end_date: endDate // Send the date string as is
        };


        try {
            const response = await fetch(`${backendBaseUrl}/create_giveaway`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(giveawayData)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                giveawayMessage.textContent = 'Giveaway created successfully!';
                form.reset(); // Clear the form
                endDateError.textContent = ''; // Clear error message after successful submission
                endDateInput.setCustomValidity(''); // Clear custom validity after successful submission

            } else {
                giveawayMessage.textContent = data.message || 'Failed to create giveaway.';
            }
        } catch (error) {
            console.error('Create giveaway error:', error);
            giveawayMessage.textContent = 'Failed to create giveaway. Please check your connection.';
        }
    });

    // Fetch channels when the page loads
    fetchChannels();
});