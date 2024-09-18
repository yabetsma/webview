document.addEventListener('DOMContentLoaded', async function() {
    // Ensure Telegram WebApp object is available
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;  // Fetch Telegram user details

    if (telegramUser && telegramUser.id) {
        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/init_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegram_id: telegramUser.id.toString(),  // Telegram ID (as a string)
                    first_name: telegramUser.first_name || '',  // Optional first name
                    last_name: telegramUser.last_name || '',    // Optional last name
                    username: telegramUser.username || '',      // Optional username
                    language_code: telegramUser.language_code || ''  // Optional language code
                })
            });
            const data = await response.json();

            if (data.success) {
                // Store the user_id for later use
                localStorage.setItem('user_id', data.user_id);
            } else {
                console.error('Error initializing user:', data.message);
            }
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    } else {
        console.error('Unable to get Telegram user details');
    }
});
