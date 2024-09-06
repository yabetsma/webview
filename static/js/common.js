// common.js

// Function to extract user ID from URL parameters
function getTelegramUserIdFromUrl() {
    return new Promise((resolve) => {
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const tgWebAppData = params.get('tgWebAppData');

        if (tgWebAppData) {
            try {
                const decodedData = decodeURIComponent(tgWebAppData);
                const dataParams = new URLSearchParams(decodedData);
                const userData = JSON.parse(dataParams.get('user'));
                resolve(userData.id);
            } catch (error) {
                console.error('Error parsing Telegram user data from URL:', error);
                resolve(null);
            }
        } else {
            console.error('Telegram Web App data not found in URL.');
            resolve(null);
        }
    });
}

// Function to get the user ID from Telegram Web App
async function getTelegramUserId() {
    return new Promise((resolve) => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            resolve(window.Telegram.WebApp.initDataUnsafe.user.id);
        } else {
            resolve(null); // Ensure to handle the case when SDK is not ready
        }
    });
}

async function getGiveawayId() {
    return new Promise((resolve) => {
        if (window.Telegram && window.Telegram.WebApp) {
            // Initialize Telegram Web App
            window.Telegram.WebApp.ready();
            
            // Extract giveaway_id from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const startAppParam = urlParams.get('startapp');
            let giveawayId = null;

            // Extract giveaway_id from the startapp parameter
            if (startAppParam && startAppParam.startsWith('giveaway-')) {
                giveawayId = startAppParam.split('-')[1];
            }

            resolve(giveawayId);
        } else {
            resolve(null); // Ensure to handle the case when SDK is not ready
        }
    });
}
