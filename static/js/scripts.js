// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const createGiveawayForm = document.getElementById('createGiveawayForm');
    const announceWinnersButton = document.getElementById('announceWinnersButton');
    const giveawayIdInput = document.getElementById('giveawayId');
    const resultsDiv = document.getElementById('resultsDiv');

    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createGiveawayForm);

            fetch('https://2cab-93-190-142-107.ngrok-free.app/create_giveaway', { // Replace with your ngrok URL
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Giveaway created successfully!');
                } else {
                    alert('Failed to create giveaway.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (announceWinnersButton) {
        announceWinnersButton.addEventListener('click', function() {
            const giveawayId = giveawayIdInput.value;

            fetch(`https://2cab-93-190-142-107.ngrok-free.app/announce_winners/${giveawayId}`) // Replace with your ngrok URL
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultsDiv.innerHTML = `<h2>Winners</h2><ul>${data.winners.map(winner => `<li>${winner.username}</li>`).join('')}</ul>`;
                } else {
                    alert('Failed to announce winners.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
