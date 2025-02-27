// static/js/common.js

const commonJS = {  // **Define the `commonJS` object here!**
    getBackendBaseUrl: function() {
        // Replace with your actual backend base URL (e.g., Railway URL)
        return 'YOUR_BACKEND_BASE_URL_HERE'; // **IMPORTANT: Replace this placeholder!**
    },

    // **Move your existing functions *inside* the `commonJS` object:**
    getTelegramUserIdFromUrl: function() {
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
    },

    getTelegramUserId: function() {
        return new Promise((resolve) => {
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.ready();
                resolve(window.Telegram.WebApp.initDataUnsafe.user.id);
            } else {
                resolve(null); // Ensure to handle the case when SDK is not ready
            }
        });
    },

    getGiveawayId: function() {
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
};
