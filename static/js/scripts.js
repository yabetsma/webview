// Function to extract user ID from Telegram Web App
function getTelegramUserId() {
    return new Promise((resolve) => {
        // Check if Telegram Web App is available
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            resolve(userId);
        } else {
            console.error('Telegram Web App is not available.');
            resolve(null);
        }
    });
}

// Fetch channels and populate the select dropdown
async function fetchChannels() {
    try {
        const response = await fetch('https://backend1-production-29e4.up.railway.app/get_channels?creator_id=YOUR_CREATOR_ID'); // Ensure creator_id is correctly set
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            const channels = data.channels;
            const channelSelect = document.getElementById('channel');
            channelSelect.innerHTML = '<option value="" disabled selected>Select your channel</option>';
            channels.forEach(channel => {
                const option = document.createElement('option');
                option.value = channel.id;
                option.textContent = channel.username;
                channelSelect.appendChild(option);
            });
        } else {
            console.error('Error fetching channels:', data.message);
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchChannels);


// Handle form submission for adding a channel
async function addChannel(event) {
    event.preventDefault();
    
    const username = document.getElementById('channel_username').value;

    // Get the creator ID from Telegram Web App
    const creatorId = await getTelegramUserId();

    if (!creatorId) {
        alert('Unable to get user ID from Telegram.');
        return;
    }

    try {
        const response = await fetch('https://backend1-production-29e4.up.railway.app/add_channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, creator_id: creatorId })
        });
        const data = await response.json();
        
        if (data.success) {
            alert('Channel added successfully!');
        } else {
            alert('Error adding channel: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding channel:', error);
    }
}

// Handle form submission for creating a giveaway
async function createGiveaway(event) {
    event.preventDefault();
    
    const giveawayName = document.getElementById('giveaway_name').value;
    const prizeAmount = document.getElementById('prize_amount').value;
    const participantsCount = document.getElementById('participants_count').value;
    const endDate = document.getElementById('end_date').value;
    const channelId = document.getElementById('channel').value;

    // Get the creator ID from Telegram Web App
    const creatorId = await getTelegramUserId();

    if (!creatorId) {
        alert('Unable to get user ID from Telegram.');
        return;
    }

    try {
        const response = await fetch('https://backend1-production-29e4.up.railway.app/create_giveaway', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: giveawayName, prize_amount: prizeAmount, participants_count: participantsCount, end_date: endDate, channel_id: channelId, creator_id: creatorId })
        });
        const data = await response.json();
        
        if (data.success) {
            alert('Giveaway created successfully!');
        } else {
            alert('Error creating giveaway: ' + data.message);
        }
    } catch (error) {
        console.error('Error creating giveaway:', error);
    }
}

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    const addChannelForm = document.getElementById('add_channel_form');
    const createGiveawayForm = document.getElementById('create_giveaway_form');

    if (addChannelForm) {
        addChannelForm.addEventListener('submit', addChannel);
    }

    if (createGiveawayForm) {
        createGiveawayForm.addEventListener('submit', createGiveaway);
    }

    // Fetch channels on page load
    fetchChannels();
});
