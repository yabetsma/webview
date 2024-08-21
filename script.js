document.addEventListener('DOMContentLoaded', function () {
    const joinButton = document.getElementById('joinButton');
    const statusMessage = document.getElementById('statusMessage');

    // Ensure that Telegram WebApp is defined
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const userId = Telegram.WebApp.initDataUnsafe.user.id;

        joinButton.addEventListener('click', async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const channel = urlParams.get('channel');
            const giveawayId = urlParams.get('giveaway_id');

            try {
                const response = await fetch('https://your-backend-url/check_membership', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        channel: channel,
                        giveaway_id: giveawayId,
                    }),
                });

                const result = await response.json();
                if (result.status === 'success') {
                    statusMessage.textContent = result.message;
                    statusMessage.style.color = 'green';
                } else {
                    statusMessage.textContent = result.message;
                    statusMessage.style.color = 'red';
                }
            } catch (error) {
                statusMessage.textContent = 'An error occurred. Please try again later.';
                statusMessage.style.color = 'red';
            }
        });
    } else {
        statusMessage.textContent = 'This page must be loaded within the Telegram app.';
        statusMessage.style.color = 'red';
    }
});








