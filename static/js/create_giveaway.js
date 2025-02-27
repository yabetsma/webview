document.addEventListener('DOMContentLoaded', function() {
    const createGiveawayForm = document.getElementById('create_giveaway_form');
    const channelSelect = document.getElementById('channel_select');
    const giveawayMessageElement = document.getElementById('giveawayMessage');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');

    const backendBaseUrl = common.getBackendBaseUrl(); // Use backend URL from common.js
    const telegramWebApp = Telegram.WebApp;
    telegramWebApp.ready();


    function showContent() {
        if (loadingPageElement) loadingPageElement.style.display = 'none';
        if (contentElement) contentElement.style.display = 'block';
    }

    function showLoading(message) {
        if (loadingPageElement) loadingPageElement.style.display = 'flex';
        if (loadingMessageElement && message) loadingMessageElement.textContent = message;
        if (contentElement) contentElement.style.display = 'none';
    }

    function displayGiveawayMessage(message, isSuccess) {
        giveawayMessageElement.textContent = message;
        giveawayMessageElement.className = 'giveaway-status-message'; // You might need to define this class in CSS
        giveawayMessageElement.classList.add(isSuccess ? 'success' : 'error'); // and 'success' and 'error' classes
        giveawayMessageElement.style.display = 'block';
    }


    async function fetchUserChannels() {
        showLoading("Loading Channels...");
        try {
            const userId = localStorage.getItem('user_id'); // Get user_id from localStorage

            if (!userId) {
                displayGiveawayMessage("User ID not found. Please initialize user again.", false);
                showContent(); // Still show content with error message
                return;
            }

            const response = await fetch(`${backendBaseUrl}/get_user_channels?user_id=${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log("No channels found for user (404).");
                    // No channels found - populate with empty list (or handle as needed)
                    populateChannelDropdown([]);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const data = await response.json();
                populateChannelDropdown(data.channels);
            }
        } catch (error) {
            console.error("Error fetching user channels:", error);
            displayGiveawayMessage("Error loading channels. Please try again.", false);
        } finally {
            showContent();
        }
    }

    function populateChannelDropdown(channels) {
        channelSelect.innerHTML = '<option value="" disabled selected>Select your channel</option>'; // Reset dropdown
        if (channels && channels.length > 0) {
            channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.id; // Use channel ID as value for backend
                option.textContent = channel.username || `Chat ID: ${channel.chat_id}`; // Display username or chat_id
                channelSelect.appendChild(option);
            });
        }
    }


    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const channelId = channelSelect.value;
        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = document.getElementById('prize_amount').value;
        const participantsCount = document.getElementById('participants_count').value;
        const endDate = document.getElementById('end_date').value;

        if (!channelId || !name || !prizeAmount || !participantsCount || !endDate) {
            displayGiveawayMessage("Please fill in all fields.", false);
            return;
        }

        showLoading("Creating Giveaway...");
        displayGiveawayMessage('', false); // Clear previous messages

        try {
            const userId = localStorage.getItem('user_id'); // Get user_id from localStorage
            if (!userId) {
                displayGiveawayMessage("User ID not found. Please initialize user again.", false);
                showContent();
                return;
            }

            const response = await fetch(`${backendBaseUrl}/create_giveaway`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel_id: channelId,
                    user_id: userId, // Send user_id here
                    name: name,
                    prize_amount: prizeAmount,
                    participants_count: participantsCount,
                    end_date: endDate
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                displayGiveawayMessage("Giveaway created successfully!", true);
                createGiveawayForm.reset(); // Clear the form
            } else {
                displayGiveawayMessage("Failed to create giveaway: " + data.message, false);
            }


        } catch (error) {
            console.error("Error creating giveaway:", error);
            displayGiveawayMessage("Error creating giveaway. Please try again.", false);
        } finally {
            showContent();
        }
    });


    // --- Fetch channels on page load ---
    fetchUserChannels();

});
