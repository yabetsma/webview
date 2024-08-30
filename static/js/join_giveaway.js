document.addEventListener('DOMContentLoaded', async () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        if (!userId) {
            alert('User ID is missing. Please open this link in the Telegram app.');
            return;
        }

        localStorage.setItem('user_id', userId);

        const urlParams = new URLSearchParams(window.location.search);
        let giveawayId = urlParams.get('giveaway_id');

        if (!giveawayId) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const tgWebAppData = hashParams.get('tgWebAppData');

            if (tgWebAppData) {
                try {
                    const decodedData = decodeURIComponent(tgWebAppData);
                    const dataParams = new URLSearchParams(decodedData);
                    giveawayId = dataParams.get('giveaway_id');
                } catch (error) {
                    console.error('Error parsing Telegram WebApp data:', error);
                }
            }
        }

        if (!giveawayId) {
            alert('Giveaway ID is missing.');
            return;
        }

        console.log("Giveaway ID:", giveawayId); 

        const joinButton = document.getElementById('join-button');
        joinButton.addEventListener('click', async function (event) {
            event.preventDefault(); 

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
                        window.Telegram.WebApp.close(); 
                    }, 3000);

                    await fetch(`https://api.telegram.org/bot7514207604:AAE_p_eFFQ3yOoNn-GSvTSjte2l8UEHl7b8/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: userId,
                            text: 'You have successfully joined the giveaway!'
                        })
                    });

                } else {
                    alert('Failed to join the giveaway: ' + result.message);
                }
            } catch (error) {
                console.error('Error joining giveaway:', error);
            }
        });
    }
});
