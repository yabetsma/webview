document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('addChannelForm');
    const createGiveawayForm = document.getElementById('createGiveawayForm');
    const announceWinnersButton = document.getElementById('announceWinnersButton');
    const giveawayIdInput = document.getElementById('giveawayId');
    const resultsDiv = document.getElementById('resultsDiv');

    if (addChannelForm) {
        addChannelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addChannelForm);

            fetch('https://1e92-93-190-142-107.ngrok-free.app/add_channel', { // Replace with your ngrok URL
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    addChannelForm.reset(); // Clear the form
                    // Optionally, reload or update the page to reflect changes
                    location.reload(); // Uncomment if you want to refresh the page
                } else {
                    alert('Failed to add channel: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            });
        });
    }

    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createGiveawayForm);

            fetch('https://1e92-93-190-142-107.ngrok-free.app/create_giveaway', { // Replace with your ngrok URL
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    createGiveawayForm.reset(); // Clear the form
                } else {
                    alert('Failed to create giveaway: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            });
        });
    }

    if (announceWinnersButton) {
        announceWinnersButton.addEventListener('click', function() {
            const giveawayId = giveawayIdInput.value;

            fetch(`https://1e92-93-190-142-107.ngrok-free.app/announce_winners/${giveawayId}`) // Replace with your ngrok URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    resultsDiv.innerHTML = `<h2>Winners</h2><ul>${data.winners.map(winner => `<li>${winner.username}</li>`).join('')}</ul>`;
                } else {
                    alert('Failed to announce winners.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            });
        });
    }
});
