// Function to extract user ID from Telegram Web App URL fragment
function getTelegramUserIdFromUrl() {
    return new Promise((resolve) => {
        // Extract the fragment part of the URL
        const fragment = window.location.hash.substring(1);
        
        // Find the tgWebAppData parameter
        const params = new URLSearchParams(fragment);
        const tgWebAppData = params.get('tgWebAppData');

        if (tgWebAppData) {
            // Decode and parse the tgWebAppData parameter
            try {
                const decodedData = decodeURIComponent(tgWebAppData);
                const dataParams = new URLSearchParams(decodedData);
                const userData = JSON.parse(dataParams.get('user'));
                resolve(userData.id);
            } catch (error) {
                console.error('Error parsing Telegram user data from URL:', error);
                resolve(null);
            }
        } else {
            console.error('Telegram Web App data not found in URL.');
            resolve(null);
        }
    });
}

// Function to extract user ID from Telegram Web App or URL
async function getTelegramUserId() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        return userId;
    } else {
        return await getTelegramUserIdFromUrl();
    }
}

// Fetch channels and populate the select dropdown
async function fetchChannels() {
    try {
        const creatorId = await getTelegramUserId();
        if (!creatorId) {
            throw new Error('Unable to get user ID from Telegram.');
        }

        const response = await fetch(`https://backend1-production-29e4.up.railway.app/get_channels?creator_id=${creatorId}`);
        const data = await response.json();

        if (data.success) {
            const channels = data.channels;
            const channelSelect = document.getElementById('channel');
            if (channelSelect) {
                channelSelect.innerHTML = '<option value="" disabled selected>Select your channel</option>';
                channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.id;
                    option.textContent = channel.username;
                    channelSelect.appendChild(option);
                });
            } else {
                console.error('Channel select element not found.');
            }
        } else {
            console.error('Error fetching channels:', data.message);
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
    }
}

// Handle form submission for adding a channel
async function addChannel(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('channel_username');
    const username = usernameInput ? usernameInput.value : null;
    if (!username) {
        alert('Username is required.');
        return;
    }

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

    const giveawayNameInput = document.getElementById('giveaway_name');
    const prizeAmountInput = document.getElementById('prize_amount');
    const participantsCountInput = document.getElementById('participants_count');
    const endDateInput = document.getElementById('end_date');
    const channelSelect = document.getElementById('channel');

    const giveawayName = giveawayNameInput ? giveawayNameInput.value : null;
    const prizeAmount = prizeAmountInput ? prizeAmountInput.value : null;
    const participantsCount = participantsCountInput ? participantsCountInput.value : null;
    const endDate = endDateInput ? endDateInput.value : null;
    const channelId = channelSelect ? channelSelect.value : null;

    if (!giveawayName || !prizeAmount || !participantsCount || !endDate || !channelId) {
        alert('All fields are required.');
        return;
    }

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

// Event listeners
document.getElementById('add_channel_form')?.addEventListener('submit', addChannel);
document.getElementById('create_giveaway_form')?.addEventListener('submit', createGiveaway);

// Fetch channels on page load
document.addEventListener('DOMContentLoaded', fetchChannels);
