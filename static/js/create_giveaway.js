document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('user_id');
    const channelSelect = document.getElementById('channel_select');

    if (!userId) {
        alert('User ID is missing.');
        return;
    }

    try {
        const response = await fetch(`https://backend-production-5459.up.railway.app/get_user_channels?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            data.channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.id;
                option.textContent = channel.username;
                channelSelect.appendChild(option);
            });
        } else {
            console.error('Error fetching channels:', data.message);
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
    }

    const createGiveawayForm = document.getElementById('create_giveaway_form');
    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        let endDate = document.getElementById('end_date').value;
        const channelId = channelSelect.value;

        if (!name || !prizeAmount || !participantsCount || !endDate || !channelId || !userId) {
            alert('All fields are required.');
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
                    name, prize_amount: prizeAmount, participants_count: participantsCount,
                    end_date: endDate, channel_id: channelId, user_id: userId
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
        }
    });

    // Function to convert local date-time to UTC
    function convertToUTC(localDateTime) {
        // Parse the localDateTime and ensure it's valid
        const localDate = new Date(localDateTime);
        
        if (isNaN(localDate.getTime())) {
            console.error("Invalid date format:", localDateTime);
            return null;
        }
    
        // Get the UTC equivalent of the date
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        
        return utcDate.toISOString(); // Returns ISO string in UTC format
    }
    
});
