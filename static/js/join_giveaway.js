document.addEventListener('DOMContentLoaded', function() {
    const joinButton = document.getElementById('join-button');
    const congratsPopup = document.getElementById('congrats-popup');
    const initializationMessageElement = document.getElementById('initializationMessage');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');

    // --- Get Giveaway Details Elements ---
    const giveawayTitleElement = document.getElementById('giveaway-title'); // NEW
    const giveawayDescriptionElement = document.getElementById('giveaway-description'); // NEW
    const giveawayEndDateElement = document.getElementById('giveaway-end-date'); // NEW
    const giveawayInstructionsElement = document.getElementById('giveaway-instructions'); // NEW


    const telegramWebApp = Telegram.WebApp;
    const initData = telegramWebApp.initDataUnsafe;
    const userId = initData?.user?.id;
    const user = initData?.user;
    const backendBaseUrl = 'https://backend-production-5459.up.railway.app';

    // --- Apply Telegram Theme ---
    function applyTelegramTheme() {
        const themeParams = telegramWebApp.themeParams;
        const body = document.body;

        if (themeParams) {
            for (const key in themeParams) {
                body.style.setProperty(`--tg-theme-${key}`, themeParams[key]);
            }
        }
    }

    applyTelegramTheme(); // Apply theme on page load


    // --- Helper functions (show/hide loading, display messages, join status) - unchanged ---
    function displayInitializationMessage(message) {
        if (initializationMessageElement) {
            initializationMessageElement.textContent = message;
        } else {
            console.error("Initialization message element not found!");
        }
    }

    function showContent() {
        if (loadingPageElement) {
            loadingPageElement.style.display = 'none';
        }
        if (contentElement) {
            contentElement.style.display = 'flex';
        }
    }

    function showLoading(message) {
        if (loadingPageElement) {
            loadingPageElement.style.display = 'flex';
        }
        if (loadingMessageElement && message) {
            loadingMessageElement.textContent = message;
        }
        if (contentElement) {
            contentElement.style.display = 'none';
        }
    }


    function displayJoinStatus(message, isSuccess = false) {
        if (isSuccess && congratsPopup) {
            congratsPopup.style.display = 'block';
            congratsPopup.textContent = message;
            if (initializationMessageElement) {
                initializationMessageElement.textContent = "";
            }
        } else {
            if (congratsPopup) {
                congratsPopup.style.display = 'none';
            }
            displayInitializationMessage(message);
        }
    }


    async function initUser() {
        showLoading("Initializing user...");
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
                console.log('User initialized successfully in join_giveaway:', data);
                showContent();
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


    function displayGiveawayDetails(giveaway) { // Updated to populate new HTML structure
        if (!giveaway) {
            displayInitializationMessage("Failed to load giveaway details.");
            return;
        }

        if (giveawayTitleElement) {
            giveawayTitleElement.textContent = giveaway.name || "Giveaway!"; // Use giveaway name or default
        }
        if (giveawayDescriptionElement) {
            giveawayDescriptionElement.innerHTML = giveaway.prize_description || "Join this amazing giveaway!"; // Use innerHTML for formatted description
        }
        if (giveawayEndDateElement) {
            giveawayEndDateElement.textContent = `Ends: ${new Date(giveaway.end_date).toLocaleString()}`; // Format end date
        }
        if (giveawayInstructionsElement) {
            giveawayInstructionsElement.textContent = giveaway.instructions || "Click 'Join Giveaway' to participate."; // Instructions or default text
        }
        showContent(); // Show content after details are displayed
    }


    async function fetchGiveawayDetails(giveawayId) {
        try {
            const response = await fetch(`${backendBaseUrl}/get_giveaway_details?giveaway_id=${giveawayId}`);
            if (!response.ok) {
                console.error('Failed to fetch giveaway details:', response.status, response.statusText);
                displayInitializationMessage("Failed to load giveaway details.");
                return null;
            }
            const data = await response.json();
            if (data.success) {
                displayGiveawayDetails(data.giveaway);
                return data.giveaway;
            } else {
                console.error('Error fetching giveaway details:', data.message);
                displayInitializationMessage(`Error loading giveaway details: ${data.message}`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching giveaway details:', error);
            displayInitializationMessage("Error fetching giveaway details. Please check your connection.");
            return null;
        }
    }


    async function handleJoinGiveaway(giveawayId, userId) {
        displayJoinStatus('Joining giveaway...');
        try {
            const response = await fetch(`${backendBaseUrl}/join_giveaway_action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ giveaway_id: giveawayId, user_id: userId })
            });

            if (!response.ok) {
                displayJoinStatus(`Failed to join giveaway. HTTP error! status: ${response.status}`);
                console.error('HTTP error joining giveaway:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            if (data.success) {
                displayJoinStatus('🎉 Congratulations! You have joined the giveaway successfully! 🎉', true);
                console.log('Successfully joined giveaway:', data);
            } else {
                if (data.message === 'This giveaway has ended and cannot be joined.') {
                    displayJoinStatus('This giveaway has already ended.', false);
                } else {
                    displayJoinStatus(`Failed to join giveaway: ${data.message}`);
                }
                console.error('Failed to join giveaway:', data.message);
            }

        } catch (error) {
            displayJoinStatus('Error joining giveaway. Please try again later.');
            console.error('Error joining giveaway:', error);
        }
    }


    // --- Main execution flow ---
    showLoading("Loading giveaway details...");

    initUser().then(userInitialized => {
        if (!userInitialized) {
            return;
        }

        const startParam = telegramWebApp.initDataUnsafe.start_param;
        const giveawayIdMatch = startParam ? startParam.match(/giveaway_id-(\d+)/) : null;
        const giveawayId = giveawayIdMatch ? giveawayIdMatch[1] : null;

        if (!giveawayId) {
            displayInitializationMessage("Error: Giveaway ID is missing or invalid.");
            showContent();
            return;
        }

        console.log('Giveaway ID:', giveawayId);
        console.log('User ID:', userId);

        fetchGiveawayDetails(giveawayId).then(giveaway => {
            // displayGiveawayDetails is called inside fetchGiveawayDetails on success
        }).catch(error => {
            displayInitializationMessage("Failed to load giveaway details.");
            showContent();
        });


        if (joinButton) {
            joinButton.addEventListener('click', function() {
                if (userId && giveawayId) {
                    handleJoinGiveaway(giveawayId, localStorage.getItem('user_id'));
                } else {
                    displayJoinStatus('User or Giveaway ID not available.');
                    console.error('User ID or Giveaway ID missing when join button clicked.');
                }
            });
        } else {
            console.error("Join button element not found in join_giveaway.html");
        }

    }).catch(error => {
        displayInitializationMessage("Initialization failed unexpectedly.");
        showContent();
        console.error("Unexpected error during initialization:", error);
    });
});