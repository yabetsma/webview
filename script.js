document.getElementById('joinButton').addEventListener('click', () => {
    const statusMessage = document.getElementById('statusMessage');

    // Fetch user ID and channel username from URL parameters or other means
    const userId = 'YOUR_USER_ID';  // Replace with actual user ID
    const channelUsername = 'YOUR_CHANNEL_USERNAME';  // Replace with actual channel username
    const chatId = 'YOUR_CHAT_ID';  // Replace with actual chat ID

    fetch('http://localhost:5000/check_membership', {  // Change to your Flask server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, channel_username: channelUsername, chat_id: chatId })
    })
    .then(response => {
        if (response.ok) {
            statusMessage.textContent = "Congratulations! You are now part of the giveaway!";
            statusMessage.style.color = 'green';
        } else {
            statusMessage.textContent = "You need to join the channel first to participate in the giveaway.";
            statusMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = "An error occurred. Please try again.";
        statusMessage.style.color = 'red';
    });
});

