document.addEventListener('DOMContentLoaded', function() {
    const createGiveawayForm = document.getElementById('create_giveaway_form');
    const channelCheckboxesContainer = document.getElementById('channel_checkboxes');
    const giveawayMessageElement = document.getElementById('giveawayMessage');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');

    const backendBaseUrl = commonJS.getBackendBaseUrl();
    const telegramWebApp = Telegram.WebApp;
    telegramWebApp.ready();
    const maxChannelsToSelect = 3;

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
        giveawayMessageElement.className = 'giveaway-status-message';
        giveawayMessageElement.classList.add(isSuccess ? 'success' : 'error');
        giveawayMessageElement.style.display = 'block';
    }

    async function fetchUserChannels() {
        showLoading("Loading Channels...");
        try {
            const userId = localStorage.getItem('user_id');

            if (!userId) {
                displayGiveawayMessage("User ID not found. Please initialize user again.", false);
                showContent();
                return;
            }

            const response = await fetch(`${backendBaseUrl}/get_user_channels?user_id=${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log("No channels found for user (404).");
                    populateChannelCheckboxes([]);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const data = await response.json();
                populateChannelCheckboxes(data.channels);
            }
        } catch (error) {
            console.error("Error fetching user channels:", error);
            displayGiveawayMessage("Error loading channels. Please try again.", false);
        } finally {
            showContent();
        }
    }

    function populateChannelCheckboxes(channels) {
        channelCheckboxesContainer.innerHTML = '';
        if (channels && channels.length > 0) {
            channels.forEach(channel => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `channel-${channel.id}`;
                checkbox.value = channel.id;
                checkbox.name = 'channels';
                const label = document.createElement('label');
                label.htmlFor = `channel-${channel.id}`;
                label.textContent = channel.username || `Chat ID: ${channel.chat_id}`;
                const channelDiv = document.createElement('div');
                channelDiv.appendChild(checkbox);
                channelDiv.appendChild(label);
                channelCheckboxesContainer.appendChild(channelDiv);

                checkbox.addEventListener('change', function() {
                    const checkedChannels = document.querySelectorAll('input[name="channels"]:checked');
                    if (checkedChannels.length > maxChannelsToSelect) {
                        checkbox.checked = false;
                        displayGiveawayMessage(`You can select maximum ${maxChannelsToSelect} channels.`, false);
                    }
                });
            });
        } else {
            channelCheckboxesContainer.innerHTML = '<p>No channels added yet.</p>';
        }
    }


    createGiveawayForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const selectedChannelElements = document.querySelectorAll('input[name="channels"]:checked');
        const channelIds = Array.from(selectedChannelElements).map(el => el.value);
        const name = document.getElementById('giveaway_name').value;
        const prizeAmount = parseFloat(document.getElementById('prize_amount').value);
        const participantsCount = parseInt(document.getElementById('participants_count').value, 10);
        const endDate = document.getElementById('end_date').value;

        if (channelIds.length === 0) {
            displayGiveawayMessage("Please select at least one channel.", false);
            return;
        }
        if (channelIds.length > maxChannelsToSelect) {
            displayGiveawayMessage(`Please select up to ${maxChannelsToSelect} channels.`, false);
            return;
        }
        if (!name || isNaN(prizeAmount) || isNaN(participantsCount) || !endDate) {
            displayGiveawayMessage("Please fill in all fields with valid data.", false);
            return;
        }


        showLoading("Creating Giveaway...");
        displayGiveawayMessage('', false);

        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                displayGiveawayMessage("User ID not found. Please initialize user again.", false);
                showContent();
                return;
            }

            const requestBody = JSON.stringify({ // Store the JSON body in a variable
                channel_ids: channelIds,
                user_id: userId,
                name: name,
                prize_amount: prizeAmount,
                participants_count: participantsCount,
                end_date: endDate
            });

            console.log("Request Body for create_giveaway:", requestBody); // **Log the request body to console**

            const response = await fetch(`${backendBaseUrl}/create_giveaway`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody // Use the requestBody variable here
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                displayGiveawayMessage("Giveaway created successfully!", true);
                createGiveawayForm.reset();
                const checkboxes = document.querySelectorAll('input[name="channels"]:checked');
                checkboxes.forEach(checkbox => checkbox.checked = false);
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
