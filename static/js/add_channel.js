// add_channel.js
document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('add_channel_form');

    addChannelForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('channel_username');
        const username = usernameInput.value;
        const userId = localStorage.getItem('user_id');  // Get user_id from localStorage

        if (!username || !userId) {
            alert('Username and User ID are required.');
            return;
        }

        try {
            const response = await fetch('https://backend-production-5459.up.railway.app/add_channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, user_id: userId })
            });
            const data = await response.json();

            if (data.success) {
                document.getElementById('channelMessage').innerText = 'Channel added successfully!';
            } else {
                document.getElementById('channelMessage').innerText = 'Error adding channel: ' + data.message;
            }
        } catch (error) {
            console.error('Error adding channel:', error);
        }
    });
});