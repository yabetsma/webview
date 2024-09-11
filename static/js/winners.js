document.addEventListener('DOMContentLoaded', async () => {
    // Extract the giveaway ID from the URL parameters
    const giveawayId = getGiveawayId();
    if (!giveawayId) {
        alert('Giveaway ID is missing. Please ensure the URL contains the correct parameters.');
        return;
    }

    try {
        // Replace 'YOUR_RAILWAY_APP_URL' with your actual Railway app URL
        const response = await fetch(`https://backend1-production-29e4.up.railway.app/api/giveaway/81/winners`);
        const data = await response.json();

        if (data.success) {
            const winnerList = document.getElementById('winnerList');
            winnerList.innerHTML = ''; // Clear previous content

            if (data.winners.length > 0) {
                data.winners.forEach((winner, index) => {
                    const winnerItem = document.createElement('div');
                    winnerItem.className = 'winner-item';
                    winnerItem.textContent = `${index + 1}. ${winner.id}`;
                    winnerList.appendChild(winnerItem);
                });
            } else {
                winnerList.innerHTML = '<p>No winners to display yet.</p>';
            }
        } else {
            document.getElementById('winnerList').innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error fetching winners:', error);
        document.getElementById('winnerList').innerHTML = '<p>An error occurred while fetching the winners. Please try again later.</p>';
    }
});

// Function to extract giveaway ID from URL
function getGiveawayId() {
    const urlParams = new URLSearchParams(window.location.search);
    const startParam = urlParams.get('tgWebAppStartParam');

    if (startParam) {
        const parts = startParam.split('-');
        if (parts.length === 2 && parts[0] === 'giveaway_id') {
            return parts[1];
        }
    }
    return null;
}

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
