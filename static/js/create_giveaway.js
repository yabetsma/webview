document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('user_id');
    const channelSelect = document.getElementById('channel_select');

    if (!userId) {
        alert('User ID is missing.');
        return;
    }

    try {
        const response = await fetch(`https://backend1-production-29e4.up.railway.app/get_user_channels?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            data.channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.channel_id;  // Adjusted to match the modified API response key.
                option.textContent = channel.username;
                channelSelect.appendChild(option);
            });
        } else {
            console.error('Error fetching channels:', data.message);
            alert('Failed to load channels: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        alert('An error occurred while fetching channels.');
    }

    const createGiveawayForm = document.getElementById('create_giveaway_form');
    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        const endDate = document.getElementById('end_date').value;
        const channelId = channelSelect.value;

        if (!name || !prizeAmount || !participantsCount || !endDate || !channelId || !userId) {
            alert('All fields are required.');
            return;
        }

        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/create_giveaway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, 
                    prize_amount: parseFloat(prizeAmount),  // Ensure prize_amount is sent as a number.
                    participants_count: parseInt(participantsCount, 10),  // Ensure participants_count is sent as an integer.
                    end_date: new Date(endDate).toISOString(),  // Convert end_date to ISO string.
                    channel_id: channelId, 
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
            document.getElementById('giveawayMessage').innerText = 'An error occurred while creating the giveaway.';
        }
    });
});

