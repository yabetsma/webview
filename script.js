document.addEventListener('DOMContentLoaded', () => {
    // Initialize Telegram WebApp
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.init();

        // Get user and giveaway information
        const user = Telegram.WebApp.initDataUnsafe.user;
        const user_id = user.id;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const giveaway_id = urlParams.get('giveaway_id');

        // Add event listener for the button click
        document.getElementById('joinButton').addEventListener('click', async () => {
            if (!giveaway_id) {
                console.error("Giveaway ID is missing.");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/join_giveaway', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id, giveaway_id })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    document.getElementById('statusMessage').textContent = result.message;
                    document.getElementById('joinButton').style.display = 'none';
                } else {
                    document.getElementById('statusMessage').textContent = result.message;
                    document.getElementById('joinButton').style.display = 'inline-block';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('statusMessage').textContent = "An error occurred. Please try again.";
            }
        });
    } else {
        console.error("Telegram WebApp is not available");
    }
});











