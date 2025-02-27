document.addEventListener('DOMContentLoaded', function() {
    const initializationMessageElement = document.getElementById('initializationMessage');
    const loadingPageElement = document.getElementById('loading-page');
    const contentElement = document.getElementById('content');

    // --- Initialize Telegram Web App ---
    const telegramWebApp = Telegram.WebApp;
    telegramWebApp.ready(); // Signal that the Web App is ready

    // --- Get User Data from Telegram Web App ---
    const userId = telegramWebApp.initDataUnsafe?.user?.id;
    const firstName = telegramWebApp.initDataUnsafe?.user?.first_name;
    const lastName = telegramWebApp.initDataUnsafe?.user?.last_name;
    const username = telegramWebApp.initDataUnsafe?.user?.username;

    if (!userId) {
        // Handle case where user ID is not available (e.g., outside Telegram Web App)
        initializationMessageElement.textContent = 'Could not retrieve Telegram user ID.';
        hideLoadingShowContent(); // Still show content, but with error message
        return; // Stop further initialization
    }

    // --- Send User Data to Backend for Initialization ---
    const backendBaseUrl = commonJS.getBackendBaseUrl(); // Assuming common.js has this function
    const initUserUrl = `${backendBaseUrl}/init_user`;

    fetch(initUserUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            telegram_id: userId,
            first_name: firstName,
            last_name: lastName,
            username: username
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('User initialization successful:', data);
            localStorage.setItem('user_id', data.user_id); // Store user_id in localStorage
            initializationMessageElement.textContent = 'Initialization successful!';
        } else {
            console.error('User initialization failed:', data);
            initializationMessageElement.textContent = 'Initialization failed: ' + data.message;
        }
    })
    .catch(error => {
        console.error('Error during user initialization:', error);
        initializationMessageElement.textContent = 'Error during initialization: ' + error.message || 'Unknown error.';
    })
    .finally(() => {
        hideLoadingShowContent(); // Call this in finally block to always hide loading
    });

    function hideLoadingShowContent() {
        loadingPageElement.style.display = 'none';
        contentElement.style.display = 'flex'; // Or 'block' depending on your CSS 'content' rules
    }
});
