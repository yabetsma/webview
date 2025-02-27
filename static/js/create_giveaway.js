document.addEventListener('DOMContentLoaded', function() {
    const verifyChannelButton = document.getElementById('verify-channel-button');
    const channelUsernameInput = document.getElementById('channel-username');
    const channelVerificationStatus = document.getElementById('channel-verification-status');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');
    const step1Container = document.getElementById('step1-container'); // Container for Step 1 UI
    const step2Container = document.getElementById('step2-container'); // Container for Step 2 UI (initially hidden)
    const channelListContainer = document.getElementById('channel-list-container'); // Container for displaying existing channels

    const backendBaseUrl = 'https://backend-production-5459.up.railway.app'; // Your backend URL
    const platformBotUsername = "@giveaway_setota_bot"; // Platform Bot Username


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

    function displayVerificationStatus(message, isSuccess) {
        channelVerificationStatus.textContent = message;
        channelVerificationStatus.className = 'giveaway-status-message channel-verification';
        channelVerificationStatus.classList.add(isSuccess ? 'success' : 'error');
        channelVerificationStatus.style.display = 'block';
    }

    async function verifyGiveawayBotAdmin(channelUsername) {
        showLoading("Verifying Bot Admin Status...");
        channelVerificationStatus.style.display = 'none';

        if (!channelUsername) {
            displayVerificationStatus("Please enter a channel username.", false);
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/verify_giveaway_bot_admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel_username: channelUsername, bot_username: platformBotUsername })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                displayVerificationStatus("Giveaway bot is admin in the channel! Verification successful.", true);
                saveVerifiedChannelAndLoadForm(channelUsername); // Call function to save channel and load form
            } else {
                displayVerificationStatus(data.message || `Giveaway bot @giveaway_setota_bot is not an admin.`, false);
                console.error("Bot admin verification failed:", data.message);
            }

        } catch (error) {
            displayVerificationStatus("Error verifying bot admin status. Please try again.", false);
            console.error("Error during bot admin verification:", error);
        } finally {
            showContent();
        }
    }

    async function saveVerifiedChannelAndLoadForm(channelUsername) {
        showLoading("Saving Channel and Loading Form...");
        try {
            const response = await fetch(`${backendBaseUrl}/save_verified_channel`, { // New backend endpoint to save channel
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel_username: channelUsername }) // Send verified channel username
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log("Channel saved successfully:", data);
                loadGiveawayDetailsForm(); // Function to load Step 2 form
            } else {
                displayVerificationStatus("Error saving channel. Please try again.", false);
                console.error("Error saving channel:", data.message);
                showStep1UI(); // Go back to Step 1 if saving fails
            }

        } catch (error) {
            displayVerificationStatus("Error saving channel. Please try again later.", false);
            console.error("Error saving channel:", error);
            showStep1UI(); // Go back to Step 1 if saving fails
        } finally {
            showContent();
        }
    }

    function loadGiveawayDetailsForm() {
        step1Container.style.display = 'none'; // Hide Step 1 UI
        step2Container.style.display = 'block'; // Show Step 2 UI
        channelListContainer.style.display = 'none'; // Hide channel list (if visible)
        // ** In a more complete implementation, you would dynamically load the form elements here **
        step2Container.innerHTML = `<h2>Step 2: Giveaway Details Form (Placeholder)</h2>
                                     <p>Form for giveaway details will be loaded here...</p>
                                     <button id="add-another-channel-button">Add Another Channel</button>`; // Placeholder content

        // Event listener for "Add Another Channel" button in Step 2 (placeholder - adjust as needed)
        const addAnotherChannelButton = document.getElementById('add-another-channel-button');
        if (addAnotherChannelButton) {
            addAnotherChannelButton.addEventListener('click', showStep1UI); // Go back to Step 1 when clicked
        }
    }

    function showStep1UI() {
        step1Container.style.display = 'block'; // Show Step 1 UI
        step2Container.style.display = 'none'; // Hide Step 2 UI
        channelListContainer.style.display = 'none'; // Hide channel list
        channelVerificationStatus.style.display = 'none'; // Clear verification status
        channelUsernameInput.value = ''; // Clear input field
    }

    function displayExistingChannels(channels) {
        if (channels && channels.length > 0) {
            channelListContainer.innerHTML = `<h2>Your Channels</h2>
                                              <p>Select channels for your giveaway or add a new one.</p>
                                              <div id="channel-checkboxes"></div>
                                              <button id="continue-with-selected-channels-button">Continue with Selected Channels</button>
                                              <button id="add-new-channel-button">Add Another Channel</button>`;
            const channelCheckboxesDiv = document.getElementById('channel-checkboxes');
            channels.forEach(channel => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `channel-${channel.id}`; // Assuming channels have an 'id'
                checkbox.value = channel.username; // Or use channel.id, adjust as needed
                const label = document.createElement('label');
                label.htmlFor = `channel-${channel.id}`;
                label.textContent = channel.username;
                const channelDiv = document.createElement('div'); // Wrap checkbox and label
                channelDiv.appendChild(checkbox);
                channelDiv.appendChild(label);
                channelCheckboxesDiv.appendChild(channelDiv);
            });

            channelListContainer.style.display = 'block'; // Show channel list

            // Event listener for "Add New Channel" button on channel list
            const addNewChannelButton = document.getElementById('add-new-channel-button');
            if (addNewChannelButton) {
                addNewChannelButton.addEventListener('click', showStep1UI); // Go to Step 1 to add new channel
            }

            //Placeholder for "Continue with Selected Channels" - functionality to be implemented later
            const continueButton = document.getElementById('continue-with-selected-channels-button');
            if (continueButton) {
                continueButton.addEventListener('click', function() {
                    const selectedChannels = Array.from(channelCheckboxesDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                                .map(checkbox => checkbox.value); // Get selected channel usernames
                    console.log("Selected Channels:", selectedChannels);
                    if (selectedChannels.length > 0) {
                       loadGiveawayDetailsForm(); // For now, directly load form after channel selection
                    } else {
                        alert("Please select at least one channel to continue."); // Or display error in UI
                    }

                });
            }


        } else {
            showStep1UI(); // If no existing channels, directly show Step 1 to add first channel
        }
    }


    async function fetchUserChannels() {
        showLoading("Loading Channels...");
        try {
            const webApp = Telegram.WebApp;
            const userId = webApp.initDataUnsafe?.user?.id;
    
            if (!userId) {
                displayVerificationStatus("Could not retrieve user ID from Telegram.", false);
                showStep1UI();
                console.error("User ID not found in Telegram Web App initData");
                return;
            }
    
            const response = await fetch(`${backendBaseUrl}/get_user_channels?user_id=${userId}`);
    
            if (!response.ok) { // Check for non-OK responses (including 404 and other errors)
                if (response.status === 404) {
                    // **Handle 404 specifically: No channels found - NOT an error in this case**
                    console.log("No channels found for user (404). Proceeding to Step 1.");
                    displayExistingChannels([]); // Treat as empty channel list
                    return; // Exit function, displayExistingChannels([]) will handle UI update
                } else {
                    // **Handle other non-OK statuses as errors (e.g., 500, 503, etc.)**
                    throw new Error(`HTTP error! status: ${response.status}`); // For other errors, throw error as before
                }
            }
    
            const data = await response.json();
            displayExistingChannels(data.channels);
    
        } catch (error) {
            // **Catch block should still handle *real* errors (like network issues, backend 500s, etc.)**
            console.error("Error fetching user channels:", error);
            displayVerificationStatus("Error loading channels. Please try again later.", false); // Keep generic error message for *actual* errors
            showStep1UI();
        } finally {
            showContent();
        }
    }


    verifyChannelButton.addEventListener('click', function() {
        const channelUsername = channelUsernameInput.value.trim();
        verifyGiveawayBotAdmin(channelUsername);
    });

    // --- On Page Load ---
    fetchUserChannels(); // Fetch existing channels when page loads

});
