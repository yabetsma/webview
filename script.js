document.addEventListener('DOMContentLoaded', () => {
    // Initialize Telegram WebApp
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.init();

        // Add event listener for the button click
        document.getElementById('joinButton').addEventListener('click', async () => {
            // Ensure the Telegram WebApp SDK is loaded
            if (!Telegram.WebApp) {
                console.error("Telegram WebApp is not available");
                return;
            }

            // Get user data from Telegram WebApp
            const user = Telegram.WebApp.initDataUnsafe.user;
            const user_id = user.id;
            const chat_instance = Telegram.WebApp.initDataUnsafe.chat_instance;
            const channel_username = Telegram.WebApp.initDataUnsafe.chat.username; // Adjust if necessary

            // Fetch or determine the giveaway ID
            // Assuming you have the giveaway ID available via URL parameter or page context
            const urlParams = new URLSearchParams(window.location.search);
            const giveaway_id = urlParams.get('giveaway_id'); // Fetch giveaway ID from URL parameters

            if (!giveaway_id) {
                console.error("Giveaway ID is missing");
                document.getElementById('statusMessage').textContent = 'Giveaway ID is missing.';
                return;
            }

            try {
                // Send data to your backend
                const response = await fetch('https://dc14-169-150-196-139.ngrok-free.app/check_membership', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id, giveaway_id })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    document.getElementById('statusMessage').textContent = result.message;
                    document.getElementById('joinChannelButton').style.display = 'none';
                } else {
                    document.getElementById('statusMessage').textContent = result.message;
                    document.getElementById('joinChannelButton').style.display = 'inline-block';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('statusMessage').textContent = 'An error occurred. Please try again later.';
            }
        });

        // Add event listener for the Join Channel button
        document.getElementById('joinChannelButton').addEventListener('click', () => {
            // Redirect to the channel
            const urlParams = new URLSearchParams(window.location.search);
            const channel_username = urlParams.get('channel_username'); // Fetch channel username from URL parameters

            if (channel_username) {
                window.location.href = `https://t.me/${channel_username}`;
            } else {
                console.error("Channel username is missing");
                document.getElementById('statusMessage').textContent = 'Channel username is missing.';
            }
        });
    } else {
        console.error("Telegram WebApp is not available");
    }
});












