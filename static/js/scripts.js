// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const channelSelect = document.getElementById('channel');
    const giveawayList = document.getElementById('giveaway-list');
    const registerForm = document.getElementById('register-form');
    const giveawayIdInput = document.getElementById('giveaway-id');

    async function fetchChannels() {
        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/get_channels');
            const data = await response.json();
            if (data.channels) {
                data.channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.id;
                    option.textContent = channel.username;
                    channelSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    }

    async function fetchGiveaways() {
        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/get_giveaways');
            const data = await response.json();
            if (data.giveaways) {
                giveawayList.innerHTML = '';
                data.giveaways.forEach(giveaway => {
                    const div = document.createElement('div');
                    div.textContent = `Giveaway: ${giveaway.name} - Prize: ${giveaway.prize_amount} Birr`;
                    giveawayList.appendChild(div);
                });
            }
        } catch (error) {
            console.error('Error fetching giveaways:', error);
        }
    }

    async function joinGiveaway(event) {
        event.preventDefault();
        try {
            const response = await fetch('https://backend1-production-29e4.up.railway.app/join_giveaway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ giveaway_id: giveawayIdInput.value })
            });
            const data = await response.json();
            alert(data.message || 'Error joining giveaway.');
        } catch (error) {
            console.error('Error joining giveaway:', error);
        }
    }

    fetchChannels();
    fetchGiveaways();

    registerForm.addEventListener('submit', joinGiveaway);
});
