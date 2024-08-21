document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        const telegramWebApp = window.Telegram.WebApp;

        document.getElementById("joinButton").addEventListener("click", function() {
            const userId = telegramWebApp.initDataUnsafe.user.id;
            const giveawayId = 1; // Example giveaway ID
            joinGiveaway(userId, giveawayId);
        });

    } else {
        console.error("Telegram WebApp is not available");
    }
});

function joinGiveaway(userId, giveawayId) {
    fetch('/check_membership', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            giveaway_id: giveawayId,
            channel: 'example_channel'  // Replace with your actual channel name
        }),
    })
    .then(response => response.json())
    .then(data => {
        const statusMessage = document.getElementById('statusMessage');
        if (data.status === 'success') {
            statusMessage.textContent = "You have successfully joined the giveaway!";
        } else {
            statusMessage.textContent = data.message;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

        
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









