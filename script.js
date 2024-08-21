document.getElementById('joinButton').addEventListener('click', async () => {
    const tg = window.Telegram.WebApp; // Access the Telegram WebApp API

    if (!tg.initData || !tg.initDataUnsafe) {
        document.getElementById('statusMessage').innerText = "Error: Cannot retrieve Telegram data.";
        return;
    }

    const user_id = tg.initDataUnsafe.user.id; // Get the Telegram User ID
    const chat_id = new URLSearchParams(window.location.search).get('start').split('gid=')[1]; // Get giveaway ID from URL
    
    // Send user and giveaway information to the backend
    try {
        const response = await fetch('https://your-backend-url.com/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                giveaway_id: chat_id
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('statusMessage').innerText = "You have successfully joined the giveaway!";
        } else {
            document.getElementById('statusMessage').innerText = "Error joining giveaway: " + result.message;
        }
    } catch (error) {
        document.getElementById('statusMessage').innerText = "Network error. Please try again later.";
    }
});









