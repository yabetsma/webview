document.addEventListener('DOMContentLoaded', async function() {
    const telegramUser = await getTelegramUser();  // Fetch Telegram user details including name and id

    if (telegramUser && telegramUser.id) {
        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/init_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegram_id: telegramUser.id.toString(),  // Ensure ID is sent as string
                    first_name: telegramUser.first_name || '',  // Optional
                    last_name: telegramUser.last_name || ''    // Optional
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

