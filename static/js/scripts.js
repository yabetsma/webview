document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('addChannelForm');
    const channelMessage = document.getElementById('channelMessage');
    const createGiveawayButton = document.getElementById('createGiveawayButton');
    const createGiveawayFormContainer = document.getElementById('createGiveawayFormContainer');
    const createGiveawayForm = document.getElementById('createGiveawayForm');
    const channelSelect = document.getElementById('channelSelect');
    const giveawayMessage = document.getElementById('giveawayMessage');

    const backendUrl = 'https://backend1-production-29e4.up.railway.app';

    // Handle Add Channel Form
    if (addChannelForm) {
        addChannelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addChannelForm);

            fetch(`${backendUrl}/add_channel`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    channelMessage.textContent = 'Channel added successfully!';
                    addChannelForm.reset();
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

    // Show Create Giveaway Form
    if (createGiveawayButton) {
        createGiveawayButton.addEventListener('click', function() {
            createGiveawayFormContainer.classList.toggle('hidden');
            if (!createGiveawayFormContainer.classList.contains('hidden')) {
                populateChannelDropdown(); // Populate dropdown when showing form
            }
        });
    }

    // Handle Create Giveaway Form
    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createGiveawayForm);

            fetch(`${backendUrl}/create_giveaway`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Access-Control-Allow-Origin': 'https://eyob2one.github.io/giveaway-webview/'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    giveawayMessage.textContent = 'Giveaway created successfully!';
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

    // Function to populate the channel dropdown
    function populateChannelDropdown() {
        fetch(`${backendUrl}/get_channels`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.channels)) {
                channelSelect.innerHTML = '<option value="">Select a channel</option>';
                data.channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.username;
                    option.textContent = channel.username;
                    channelSelect.appendChild(option);
                });
            } else {
                channelSelect.innerHTML = '<option value="">No channels available</option>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            channelSelect.innerHTML = '<option value="">Error loading channels</option>';
        });
    }

    // Initial population of the channel dropdown if the form is visible
    if (createGiveawayFormContainer && !createGiveawayFormContainer.classList.contains('hidden')) {
        populateChannelDropdown();
    }
});

