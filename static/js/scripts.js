document.addEventListener('DOMContentLoaded', function() {
    const addChannelForm = document.getElementById('addChannelForm');
    const channelMessage = document.getElementById('channelMessage');
    const createGiveawayButton = document.getElementById('createGiveawayButton');
    const createGiveawayFormContainer = document.getElementById('createGiveawayFormContainer');
    const createGiveawayForm = document.getElementById('createGiveawayForm');
    const channelSelect = document.getElementById('channelSelect');
    const giveawayMessage = document.getElementById('giveawayMessage');

    const backendUrl = 'https://backend1-production-29e4.up.railway.app';

    // Ensure the element exists before adding an event listener
    if (addChannelForm) {
        addChannelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addChannelForm);
            fetch(`${backendUrl}/add_channel`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                channelMessage.textContent = data.message;
                if (data.success) {
                    channelMessage.style.color = 'green';
                    reloadChannels(); // Reload channels list
                } else {
                    channelMessage.style.color = 'red';
                }
            })
            .catch(error => {
                channelMessage.textContent = `Error: ${error.message}`;
                channelMessage.style.color = 'red';
            });
        });
    }

    if (createGiveawayButton && createGiveawayFormContainer) {
        createGiveawayButton.addEventListener('click', function() {
            createGiveawayFormContainer.style.display = 'block';
        });
    }

    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(createGiveawayForm);
            fetch(`${backendUrl}/create_giveaway`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                giveawayMessage.textContent = data.message;
                if (data.success) {
                    giveawayMessage.style.color = 'green';
                } else {
                    giveawayMessage.style.color = 'red';
                }
            })
            .catch(error => {
                giveawayMessage.textContent = `Error: ${error.message}`;
                giveawayMessage.style.color = 'red';
            });
        });
    }

    // Function to reload channels list
    function reloadChannels() {
        fetch(`${backendUrl}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (channelSelect) {
                channelSelect.innerHTML = '';
                data.channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.username;
                    option.textContent = channel.username;
                    channelSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading channels:', error);
        });
    }

    // Call reloadChannels when the DOM is fully loaded
    reloadChannels();
});

