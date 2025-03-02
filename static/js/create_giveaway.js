document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('user_id');
    const channelCheckboxesContainer = document.getElementById('channel_checkboxes'); // Changed to checkbox container

    if (!userId) {
        alert('User ID is missing.');
        return;
    }

    try {
        const response = await fetch(`https://backend-production-5459.up.railway.app/get_user_channels?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            if (data.channels && data.channels.length > 0) { // Check if channels array exists and is not empty
                data.channels.forEach(channel => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `channel-${channel.id}`;
                    checkbox.value = channel.id;
                    checkbox.name = 'channel_ids'; // Changed name to channel_ids to collect multiple values
                    const label = document.createElement('label');
                    label.htmlFor = `channel-${channel.id}`;
                    label.textContent = channel.username || `Chat ID: ${channel.chat_id}`;
                    const channelDiv = document.createElement('div');
                    channelDiv.appendChild(checkbox);
                    channelDiv.appendChild(label);
                    channelCheckboxesContainer.appendChild(channelDiv);
                });
            } else {
                channelCheckboxesContainer.innerHTML = '<p>No channels added yet.</p>'; // Message if no channels
            }
        } else {
            console.error('Error fetching channels:', data.message);
            channelCheckboxesContainer.innerHTML = '<p>Error loading channels.</p>'; // Error message in UI
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        channelCheckboxesContainer.innerHTML = '<p>Error loading channels.</p>'; // Error message in UI
    }

    const createGiveawayForm = document.getElementById('create_giveaway_form');
    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        let endDate = document.getElementById('end_date').value;
        //const channelId = channelSelect.value; // Removed single channel select
        const selectedChannelElements = document.querySelectorAll('input[name="channel_ids"]:checked'); // Get all checked checkboxes
        const channelIds = Array.from(selectedChannelElements).map(el => el.value); // Extract values (channel IDs)

        if (!name || !prizeAmount || !participantsCount || !endDate || channelIds.length === 0 || !userId) { // Updated validation for channelIds
            alert('All fields are required, and at least one channel must be selected.'); // Updated alert message
            return;
        }

        // Convert the endDate to UTC
        endDate = convertToUTC(endDate);

        try {
            const response = await fetch('https://backend-production-5459.up.railway.app/create_giveaway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    prize_amount: prizeAmount,
                    participants_count: participantsCount,
                    end_date: endDate,
                    channel_ids: channelIds, // Send channelIds as a list
                    user_id: userId
                })
            });
            const data = await response.json();

            if (data.success) {
                document.getElementById('giveawayMessage').innerText = 'Giveaway created and announced successfully!';
            } else {
                document.getElementById('giveawayMessage').innerText = 'Error creating giveaway: ' + data.message;
            }
        } catch (error) {
            console.error('Error creating giveaway:', error);
            document.getElementById('giveawayMessage').innerText = 'Error creating giveaway. Please check console.'; // More user-friendly error
        }
    });

    // Function to convert local date-time to UTC
    function convertToUTC(localDateTime) {
        const localDate = new Date(localDateTime);

        if (isNaN(localDate.getTime())) {
            console.error("Invalid date format:", localDateTime);
            return null;
        }

        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

        return utcDate.toISOString(); // Returns ISO string in UTC format
    }

});
