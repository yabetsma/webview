document.getElementById('joinButton').addEventListener('click', function() {
    const userId = /* obtain user ID */;
    const channelUsername = /* obtain channel username */;
    const chatId = /* obtain chat ID */;

    fetch('https://your-deployed-flask-url.com/check_membership', {  // Update with your deployed Flask URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, channel_username: channelUsername, chat_id: chatId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('statusMessage').innerText = 'You are a member!';
        } else {
            document.getElementById('statusMessage').innerText = 'Failed to check membership.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('statusMessage').innerText = 'An error occurred. Please try again.';
    });
});

