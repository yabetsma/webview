document.getElementById("joinButton").addEventListener("click", async function() {
    const statusMessage = document.getElementById("statusMessage");

    try {
        // Simulating API call to check channel membership
        const response = await fetch("/api/check_membership", { 
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: "12345" }) // Replace with dynamic user ID
        });

        const result = await response.json();

        if (result.isMember) {
            statusMessage.textContent = "Congratulations! You are now part of the giveaway!";
            statusMessage.style.display = "block";
            statusMessage.style.color = "green";
        } else {
            statusMessage.textContent = "You need to join the channel first to participate.";
            statusMessage.style.display = "block";
            statusMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        statusMessage.textContent = "An error occurred. Please try again later.";
        statusMessage.style.display = "block";
        statusMessage.style.color = "red";
    }
});
