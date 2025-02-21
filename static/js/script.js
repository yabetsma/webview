document.addEventListener('DOMContentLoaded', async function() {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
    const initializationMessage = document.getElementById('initializationMessage'); // Add a <p> with this ID in index.html

    if (!initializationMessage) {
        console.error("Initialization message element not found in index.html. Please add <p id='initializationMessage'></p> to index.html");
        return; // Stop execution if message element is missing
    }

    initializationMessage.textContent = "Initializing user..."; // Indicate initialization is starting

    if (telegramUser && telegramUser.id) {
        try {
            const response = await fetch('https://backend-production-5459.up.railway.app/init_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegram_id: telegramUser.id.toString(),
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name || '',
                    username: telegramUser.username,
                    language_code: telegramUser.language_code || ''
                })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user_id', data.user_id);
                initializationMessage.textContent = "User initialized successfully!"; // Success message
                // Optionally, you can add a delay here before further actions if needed
                // setTimeout(() => { /* ... proceed to main UI or redirect ... */ }, 500);

            } else {
                console.error('Error initializing user:', data.message);
                initializationMessage.textContent = "Initialization failed. Please try again."; // User-friendly error
                initializationMessage.style.color = 'red'; // Make error message stand out
            }
        } catch (error) {
            console.error('Error initializing user:', error);
            initializationMessage.textContent = "Initialization error. Please check your connection and try again."; // Connection error
            initializationMessage.style.color = 'red';
        }
    } else {
        console.error('Unable to get Telegram user details');
        initializationMessage.textContent = "Could not get Telegram user info. Please restart the Web App from Telegram."; // WebApp issue
        initializationMessage.style.color = 'red';
    }
});