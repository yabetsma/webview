document.addEventListener('DOMContentLoaded', async function() {
    const telegramId = await getTelegramUserId(); // Function to get the user's Telegram ID

    if (telegramId) {
        try {
            // Convert telegramId to a string before sending
            const telegramIdStr = String(telegramId);

            const response = await fetch('https://backend1-production-29e4.up.railway.app/init_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ telegram_id: telegramIdStr })  // Send as string
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
        console.error('Unable to get Telegram ID');
    }
});
