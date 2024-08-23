document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.getElementById('joinButton');
    const statusMessage = document.getElementById('statusMessage');

    if (window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;

        if (!user) {
            joinButton.style.display = 'none';
            statusMessage.textContent = 'User information not available.';
            return;
        }

        const userId = user.id;
        const queryParams = new URLSearchParams(window.location.search);
        const giveawayId = queryParams.get('giveaway_id');

        joinButton.addEventListener('click', async () => {
            try {
                const response = await fetch('https://d7fe-149-34-244-143.ngrok-free.app/check_membership', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId, giveaway_id: giveawayId })
                });

                const data = await response.json();

                if (response.ok) {
                    statusMessage.textContent = data.message || 'Successfully joined the giveaway!';
                    joinButton.style.display = 'none';
                } else {
                    statusMessage.textContent = data.message || 'Failed to join the giveaway.';
                }
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = 'An error occurred. Please try again later.';
            }
        });
    } else {
        statusMessage.textContent = 'Telegram WebApp not available.';
    }
});











