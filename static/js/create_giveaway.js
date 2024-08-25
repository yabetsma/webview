// create_giveaway.js

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

                if (channels.length === 0) {
                    alert('No channels found. Please add a channel before creating a giveaway.');
                    window.location.href = 'add_channel.html'; // Redirect to "Add Channel" page
                }
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

document.addEventListener('DOMContentLoaded', fetchChannels);

document.getElementById('create_giveaway_form')?.addEventListener('submit', async function(event) {
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
});
