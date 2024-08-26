document.addEventListener('DOMContentLoaded', async function() {
    const creatorId = await getTelegramUserId();
    const channelSelect = document.getElementById('channel_select');

    try {
        const response = await fetch(`https://backend1-production-29e4.up.railway.app/get_channels?creator_id=${creatorId}`);
        const data = await response.json();

        if (data.success && data.channels.length > 0) {
            data.channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.id;
                option.textContent = channel.username;
                channelSelect.appendChild(option);
            });
        } else {
            const messageDiv = document.getElementById('giveawayMessage');
            messageDiv.textContent = data.message || 'No channels found.';
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        alert('An unexpected error occurred.');
    }

    const createGiveawayForm = document.getElementById('create_giveaway_form');
    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        const endDate = document.getElementById('end_date').value;
        const channelId = channelSelect.value;

        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/create_giveaway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, prize_amount: prizeAmount, participants_count: participantsCount,
                    end_date: endDate, channel_id: channelId, creator_id: creatorId
                })
            });
            const data = await response.json();

            const messageDiv = document.getElementById('giveawayMessage');
            messageDiv.textContent = data.message;

        } catch (error) {
            console.error('Error creating giveaway:', error);
            alert('An unexpected error occurred.');
        }
    });
});

