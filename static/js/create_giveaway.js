document.addEventListener('DOMContentLoaded', function() {
    const verifyChannelButton = document.getElementById('verify-channel-button');
    const channelUsernameInput = document.getElementById('channel-username');
    const channelVerificationStatus = document.getElementById('channel-verification-status');
    const contentElement = document.getElementById('content');
    const loadingPageElement = document.getElementById('loading-page');
    const loadingMessageElement = document.getElementById('loading-message');


    const backendBaseUrl = 'https://backend-production-5459.up.railway.app'; // Your backend URL


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


    async function verifyChannelOwnership(channelUsername) {
        showLoading("Verifying Channel...");
        channelVerificationStatus.style.display = 'none'; // Hide previous status

        if (!channelUsername) {
            displayVerificationStatus("Please enter a channel username.", false);
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/verify_channel_admin`, { // Backend endpoint to verify channel admin
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channel_username: channelUsername }) // Send channel username to backend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                displayVerificationStatus("Channel verified successfully!", true);
                // ** NEXT STEP:  Enable the rest of the giveaway form here **
                // For now, just log success
                console.log("Channel verification successful:", data);
            } else {
                displayVerificationStatus(data.message || "Channel verification failed. Please check username and bot admin status.", false);
                console.error("Channel verification failed:", data.message);
            }

        } catch (error) {
            displayVerificationStatus("Error verifying channel. Please try again later.", false);
            console.error("Error during channel verification:", error);
        } finally {
            showContent(); // Show content after verification attempt (success or failure)
        }
    }


    function displayVerificationStatus(message, isSuccess) {
        channelVerificationStatus.textContent = message;
        channelVerificationStatus.className = 'giveaway-status-message channel-verification'; // Reset class
        channelVerificationStatus.classList.add(isSuccess ? 'success' : 'error');
        channelVerificationStatus.style.display = 'block'; // Show status message
    }


    verifyChannelButton.addEventListener('click', function() {
        const channelUsername = channelUsernameInput.value.trim();
        verifyChannelOwnership(channelUsername);
    });

    showContent(); // Initially show content (loading page will handle initial loading if needed later)

});