document.getElementById('joinButton').addEventListener('click', async function() {
    // Extract parameters from the URL
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
            if (result.is_member) {
                document.getElementById('statusMessage').textContent = result.message;
            } else {
                // Provide a button to join the channel
                document.getElementById('statusMessage').innerHTML = `
                    ${result.message} <br>
                    <a href="${result.join_link}" target="_blank" class="join-channel-button">Join the Channel</a>
                `;
            }
        } else {
            document.getElementById('statusMessage').textContent = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('statusMessage').textContent = 'An error occurred. Please try again.';
    }
});


