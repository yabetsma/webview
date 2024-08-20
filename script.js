document.getElementById('joinButton').addEventListener('click', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const chatId = urlParams.get('chat_id');
    const channelUsername = urlParams.get('channel');
    const giveawayId = urlParams.get('giveaway_id');

    try {
        const response = await fetch('http://localhost:5000/check_membership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                chat_id: chatId,
                channel_username: channelUsername,
                giveaway_id: giveawayId
            })
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            document.getElementById('statusMessage').textContent = result.message;
        } else {
            document.getElementById('statusMessage').textContent = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('statusMessage').textContent = 'An error occurred. Please try again.';
    }
});



