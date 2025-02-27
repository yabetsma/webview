document.addEventListener('DOMContentLoaded', function() {
    const initializationMessageElement = document.getElementById('initializationMessage');
    const contentElement = document.getElementById('content'); // Get content element
    const loadingPageElement = document.getElementById('loading-page'); // Get loading page
    const loadingMessageElement = document.getElementById('loading-message'); // Get loading message element

    const telegramWebApp = Telegram.WebApp;
    const initData = telegramWebApp.initDataUnsafe;
    const userId = initData?.user?.id;
    const user = initData?.user;
    const backendBaseUrl = 'https://backend-production-5459.up.railway.app';

    function displayInitializationMessage(message) {
        if (initializationMessageElement) {
            initializationMessageElement.textContent = message;
        } else {
            console.error("Initialization message element not found!");
        }
    }

    // Function to show the main content and hide loading page
    function showContent() {
        if (loadingPageElement) {
            loadingPageElement.style.display = 'none'; // Hide loading page
        }
        if (contentElement) {
            contentElement.style.display = 'flex'; // Show main content (using flex to keep centering)
        }
    }

    // Function to show loading page and set message
    function showLoading(message) {
        if (loadingPageElement) {
            loadingPageElement.style.display = 'flex'; // Show loading page
        }
        if (loadingMessageElement && message) {
            loadingMessageElement.textContent = message; // Update loading message
        }
        if (contentElement) {
            contentElement.style.display = 'none'; // Hide main content
        }
    }


    async function initUser() {
        showLoading("Initializing user..."); // Show loading page with message
        if (!user || !user.id) {
            displayInitializationMessage("Error: User information not available. Please try again from Telegram.");
            console.error("User information not available from Telegram Web App.");
            return false;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/init_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ telegram_id: user.id, first_name: user.first_name, last_name: user.last_name, username: user.username })
            });

            if (!response.ok) {
                displayInitializationMessage(`Initialization failed. HTTP error! status: ${response.status}`);
                console.error('HTTP error!', response);
                return false;
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('user_id', data.user_id);
                console.log('User initialized successfully in index:', data);
                // displayInitializationMessage("User initialized successfully."); // No need for text message now
                showContent(); // Show main content after success
                return true;
            } else {
                displayInitializationMessage(`Initialization failed: ${data.message}`);
                console.error('Initialization failed:', data.message);
                return false;
            }

        } catch (error) {
            displayInitializationMessage("Initialization error. Please check your connection and try again.");
            console.error('Error initializing user:', error);
            return false;
        }
    }

    initUser().catch(error => {
        displayInitializationMessage("Initialization failed unexpectedly.");
        console.error("Unexpected error during initialization:", error);
    });

});
