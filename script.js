document.addEventListener("DOMContentLoaded", function() {
    const joinButton = document.getElementById("joinGiveaway");

    if (joinButton) {
        joinButton.addEventListener("click", async function() {
            const userIdElement = document.getElementById("userId");
            const chatIdElement = document.getElementById("chatId");
            const channelUsernameElement = document.getElementById("channelUsername");
            const giveawayIdElement = document.getElementById("giveawayId");

            // Check if all elements exist before proceeding
            if (!userIdElement || !chatIdElement || !channelUsernameElement || !giveawayIdElement) {
                console.error("One or more elements are missing!");
                return;
            }

            const userId = userIdElement.value;
            const chatId = chatIdElement.value;
            const channelUsername = channelUsernameElement.value;
            const giveawayId = giveawayIdElement.value;

            const data = {
                user_id: userId,
                chat_id: chatId,
                channel_username: channelUsername,
                giveaway_id: giveawayId
            };

            try {
                const response = await fetch("http://localhost:5000/check_membership", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.status === "success") {
                    alert(result.message);
                    // Optionally redirect to another page or update UI
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
        });
    } else {
        console.error("Join Giveaway button not found!");
    }
});





