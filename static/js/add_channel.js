// add_channel.js

document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('add_channel_form');

    addChannelForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('channel_username');
        const username = usernameInput ? usernameInput.value : null;

        if (!username) {
            alert('Username is required.');
            return;
        }

        const creatorId = await getTelegramUserId();
        if (!creatorId) {
            alert('Unable to get user ID from Telegram.');
            return;
        }

        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/add_channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, creator_id: creatorId })
            });
            const data = await response.json();

            if (data.success) {
                alert('Channel added successfully!');
            } else {
                alert('Error adding channel: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding channel:', error);
        }
    });
});


