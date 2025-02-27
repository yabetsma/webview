<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Giveaway Bot</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .header {
            padding: 20px;
            background-color: #6c5ce7;
            color: white;
            font-size: 2em;
            margin-bottom: 20px;
            text-align: center;
            width: 100%; /* Make header full width */
        }

        .buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30px; /* Adjusted margin */
        }

        .button {
            padding: 15px 25px;
            width: 13rem;
            background-color: #6c5ce7;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.2em;
            transition: background-color 0.3s ease;
            margin: 10px;
            display: block; /* Make buttons stack vertically and take full width of .buttons */
            text-align: center; /* Center text inside button */
        }

        .button:hover {
            background-color: #4834d4;
        }

        #initializationMessage {
            color: red;
            margin-top: 15px; /* Adjusted margin */
            text-align: center; /* Center the message */
        }

        /* Loading Page Styles */
        #loading-page {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(244, 244, 249, 0.95); /* Slightly darker, less transparent background for loading */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top-color: #6c5ce7;
            border-radius: 50%;
            width: 60px; /* Slightly larger spinner */
            height: 60px; /* Slightly larger spinner */
            animation: spin 1.2s linear infinite; /* Slightly slower animation */
            margin-bottom: 20px; /* More margin below spinner */
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        #loading-message {
            font-size: 1.2em; /* Slightly larger loading message */
            color: #555;
        }

        /* Initially Hidden Content */
        #content {
            display: none;
            width: 100%; /* Make content take full width */
            align-items: center; /* Center content items horizontally */
            flex-direction: column; /* Ensure content is in a column layout */
        }
    </style>
</head>
<body>

    <div id="loading-page">
        <div class="spinner"></div>
        <p id="loading-message">Initializing...</p>
    </div>

    <div id="content">
        <header class="header">
            <h1>Giveaway Manager</h1>
        </header>
        <main class="container">
            <section>
                <h2>Welcome to the Giveaway Manager!</h2>
                <p id="initializationMessage"></p>
                <div class="buttons">
                    <a href="./add_channel.html" class="button">Add Channel</a>
                    <a href="./create_giveaway.html" class="button">Create Giveaway</a>
                    <a href="./add_payment.html" class="button">Add Payment Method</a>
                </div>
            </section>
        </main>
    </div>

    <script src="static/js/common.js"></script>
    <script src="static/js/index.js"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</body>
</html>
