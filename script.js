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

            // Get the user data from the Telegram WebApp
            const user = Telegram.WebApp.initDataUnsafe.user;
            const user_id = user.id; // Ensure user id is available
            const channel = Telegram.WebApp.initDataUnsafe.chat.title; // Adjust this if necessary
            const giveaway_id = 'your_giveaway_id_here'; // Adjust or retrieve this as needed

            try {
                // Send data to your backend
                const response = await fetch('https://your-server-url/check_membership', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id, channel, giveaway_id })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    document.getElementById('statusMessage').textContent = result.message;
                } else {
                    document.getElementById('statusMessage').textContent = result.message;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.error("Telegram WebApp is not available");
    }
});











