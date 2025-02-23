document.addEventListener('DOMContentLoaded', function() {
    const verifyChannelButton = document.getElementById('verify-channel-button');
    const channelUsernameInput = document.getElementById('channel-username');
    const channelVerificationStatus = document.getElementById('channel-verification-status');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');

    const backendBaseUrl = 'https://backend-production-5459.up.railway.app'; // Your backend URL
    const platformBotUsername = "@giveaway_setota_bot"; // **Hardcoded Platform Bot Username**


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


    async function verifyGiveawayBotAdmin(channelUsername) { // Corrected function name
        showLoading("Verifying Bot Admin Status..."); // Updated loading message
        channelVerificationStatus.style.display = 'none'; // Hide previous status

        if (!channelUsername) {
            displayVerificationStatus("Please enter a channel username.", false);
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/verify_giveaway_bot_admin`, { // Corrected backend endpoint URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channel_username: channelUsername, bot_username: platformBotUsername }) // Send channel username AND platform bot username
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                displayVerificationStatus("Giveaway bot is admin in the channel! Verification successful.", true); // Corrected success message
                // ** NEXT STEP:  Enable the rest of the giveaway form here **
                // For now, just log success
                console.log("Giveaway bot admin verification successful:", data);
            } else {
                displayVerificationStatus(data.message || `Giveaway bot @giveaway_setota_bot is not an admin in the channel. Please add the bot as admin with 'Send messages' permission and try again.`, false); // Corrected error message, now includes PLATFORM BOT USERNAME
                console.error("Giveaway bot admin verification failed:", data.message);
            }

        } catch (error) {
            displayVerificationStatus("Error verifying bot admin status. Please try again later.", false); // Corrected error message
            console.error("Error during giveaway bot admin verification:", error);
        } finally {
            showContent(); // Show content after verification attempt
        }
    }


    function displayVerificationStatus(message, isSuccess) {
        channelVerificationStatus.textContent = message;
        channelVerificationStatus.className = 'giveaway-status-message channel-verification';
        channelVerificationStatus.classList.add(isSuccess ? 'success' : 'error');
        channelVerificationStatus.style.display = 'block';
    }


    verifyChannelButton.addEventListener('click', function() {
        const channelUsername = channelUsernameInput.value.trim();
        verifyGiveawayBotAdmin(channelUsername); // Call the corrected verification function
    });

    showContent();

});
