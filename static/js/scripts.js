document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('addChannelForm');
    const createGiveawayForm = document.getElementById('createGiveawayForm');
    const channelSelect = document.getElementById('channelSelect');
    const channelMessage = document.getElementById('channelMessage');
    const giveawayMessage = document.getElementById('giveawayMessage');
    const giveawayForm = document.getElementById('giveawayForm');
    const showGiveawayFormButton = document.getElementById('showGiveawayFormButton');

    // Fetch channels and populate the dropdown
    function fetchChannels() {
        fetch('https://6d44-93-190-142-107.ngrok-free.app/channels') // Replace with your ngrok URL
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    channelSelect.innerHTML = '<option value="" disabled selected>Select a channel</option>';
                    data.channels.forEach(channel => {
                        const option = document.createElement('option');
                        option.value = channel.username;
                        option.textContent = channel.username;
                        channelSelect.appendChild(option);
                    });
                } else {
                    channelMessage.textContent = 'Failed to load channels: ' + data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                channelMessage.textContent = 'An error occurred: ' + error.message;
            });
    }

    // Initial fetch of channels
    fetchChannels();

    if (addChannelForm) {
        addChannelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addChannelForm);

            fetch('https://6d44-93-190-142-107.ngrok-free.app/add_channel', { // Replace with your ngrok URL
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    addChannelForm.reset(); // Clear the form
                    fetchChannels(); // Refresh the channel list
                } else {
                    channelMessage.textContent = 'Failed to add channel: ' + data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                channelMessage.textContent = 'An error occurred: ' + error.message;
            });
        });
    }

    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createGiveawayForm);

            fetch('https://6d44-93-190-142-107.ngrok-free.app/create_giveaway', { // Replace with your ngrok URL
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    createGiveawayForm.reset(); // Clear the form
                } else {
                    giveawayMessage.textContent = 'Failed to create giveaway: ' + data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                giveawayMessage.textContent = 'An error occurred: ' + error.message;
            });
        });
    }

    // Show/hide giveaway form
    if (showGiveawayFormButton) {
        showGiveawayFormButton.addEventListener('click', function() {
            giveawayForm.style.display = giveawayForm.style.display === 'none' ? 'block' : 'none';
        });
    }
});

