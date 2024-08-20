document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat_id');
    const channelUsername = urlParams.get('channel');
    const giveawayId = urlParams.get('giveaway_id');

    document.getElementById('joinButton').addEventListener('click', function() {
        fetch('https://your-deployed-flask-url.com/check_membership', {  // Update with your deployed Flask URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user_id: /* obtain user ID */, 
                chat_id: chatId, 
                channel_username: channelUsername,
                giveaway_id: giveawayId 
            })
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
});


