document.addEventListener('DOMContentLoaded', function () {
    const joinButton = document.getElementById('joinButton');
    const statusMessage = document.getElementById('statusMessage');

    joinButton.addEventListener('click', async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = Telegram.WebApp.initDataUnsafe.user.id;
        const channel = urlParams.get('channel');
        const giveawayId = urlParams.get('giveaway_id');

        try {
            const response = await fetch('http://localhost:5000/check_membership', {
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
});







