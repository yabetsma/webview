document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        const telegramWebApp = window.Telegram.WebApp;

        document.getElementById("joinButton").addEventListener("click", async function() {
            const userId = telegramWebApp.initDataUnsafe.user.id;
            const giveawayId = 1; // Example giveaway ID
            await joinGiveaway(userId, giveawayId);
        });

    } else {
        console.error("Telegram WebApp is not available");
    }
});

async function joinGiveaway(userId, giveawayId) {
    try {
        const response = await fetch('/check_membership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                giveaway_id: giveawayId
            }),
        });

        const data = await response.json();
        const statusMessage = document.getElementById('statusMessage');

        if (data.status === 'success') {
            statusMessage.textContent = "You have successfully joined the giveaway!";
        } else {
            statusMessage.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}










