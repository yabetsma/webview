document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        // Get the user ID from Telegram Web App data
        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        if (!userId) {
            alert('User ID is missing. Please open this link in the Telegram app.');
            return;
        }

        // Extract the giveaway_id from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const giveawayId = urlParams.get('giveaway_id');

        if (!giveawayId) {
            alert('Giveaway ID is missing.');
            return;
        }

        console.log("Giveaway ID:", giveawayId); // For debugging purposes
        console.log("User ID:", userId); // For debugging purposes

        const joinButton = document.getElementById('join-button');
        joinButton.addEventListener('click', async function (event) {
            event.preventDefault(); // Prevent the form from submitting traditionally

            try {
                const response = await fetch('https://backend1-production-29e4.up.railway.app/join_giveaway', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        giveaway_id: giveawayId,
                        telegram_id: userId
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    displayCongratsPopup();
                    setTimeout(() => {
                        window.Telegram.WebApp.close(); // Close the Telegram Web App
                    }, 3000);

                    // Notify the user via the bot
                    await fetch(`https://api.telegram.org/bot7514207604:AAE_p_eFFQ3yOoNn-GSvTSjte2l8UEHl7b8/sendMessage`, {
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
    } else {
        alert('Telegram Web App is not available. Please open this link in the Telegram app.');
    }
});
