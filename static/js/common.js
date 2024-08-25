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

// Function to get the user ID
async function getTelegramUserId() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        return window.Telegram.WebApp.initDataUnsafe.user.id;
    } else {
        return await getTelegramUserIdFromUrl();
    }
}
