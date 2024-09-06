document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        try {
            const { giveawayId, userId } = await getGiveawayId();

            if (!userId) {
                alert('User ID is missing. Please open this link in the Telegram app.');
                return;
            }

            localStorage.setItem('user_id', userId);

            // Display the giveaway ID for debugging
            console.log("Giveaway ID:", giveawayId);

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
                        await fetch('https://api.telegram.org/bot7514207604:AAE_p_eFFQ3yOoNn-GSvTSjte2l8UEHl7b8/sendMessage', {
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
        } catch (error) {
            console.error('Error:', error);
            alert(error);
        }
    } else {
        alert('Telegram Web App is not available. Please open this link in the Telegram app.');
    }
});

async function getGiveawayId() {
    return new Promise((resolve, reject) => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();

            // Extract the tgWebAppStartParam from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const startParam = urlParams.get('tgWebAppStartParam');

            if (!startParam) {
                reject('tgWebAppStartParam is missing in the URL.');
                return;
            }

            // Extract giveaway_id from tgWebAppStartParam
            const parts = startParam.split('-');
            if (parts.length === 2 && parts[0] === 'giveaway_id') {
                const giveawayId = parts[1];
                if (giveawayId) {
                    // Extract user ID from the hash fragment
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const tgWebAppData = hashParams.get('tgWebAppData');

                    if (tgWebAppData) {
                        try {
                            const decodedData = decodeURIComponent(tgWebAppData);
                            const dataParams = new URLSearchParams(decodedData);
                            const userId = dataParams.get('user') ? JSON.parse(dataParams.get('user')).id : null;

                            if (userId) {
                                resolve({ giveawayId, userId });
                            } else {
                                reject('User ID is missing in the WebApp data.');
                            }
                        } catch (error) {
                            console.error('Error parsing Telegram WebApp data:', error);
                            reject('Error parsing WebApp data.');
                        }
                    } else {
                        reject('tgWebAppData is missing in the hash fragment.');
                    }
                } else {
                    reject('Giveaway ID is missing in the tgWebAppStartParam.');
                }
            } else {
                reject('Invalid tgWebAppStartParam format.');
            }
        } else {
            reject('Telegram Web App is not available. Please open this link in the Telegram app.');
        }
    });
}
