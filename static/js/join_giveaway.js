document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('user_id');
    const joinButton = document.getElementById('join-button');

    if (!userId) {
        alert('User ID is missing.');
        return;
    }

    joinButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const giveawayId = urlParams.get('giveaway_id');

        if (!giveawayId || !userId) {
            alert('Invalid giveaway ID or User ID.');
            return;
        }

        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/join_giveaway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ giveaway_id: giveawayId, telegram_id: userId }),
            });

            const result = await response.json();
            if (result.success) {
                displayCongratsPopup();
                setTimeout(() => {
                    window.close(); // Close the tab after showing the message
                }, 3000);

                // Notify the user via the bot
                await fetch(`https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        chat_id: userId,
                        text: 'You have successfully joined the giveaway! Good luck!',
                    }),
                });
            } else {
                alert('Failed to join the giveaway. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    function displayCongratsPopup() {
        const congratsPopup = document.getElementById('congrats-popup');
        congratsPopup.style.display = 'block';
    }
});
