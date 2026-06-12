# Store Reviews Action

This project scrapes reviews for Mac App Store apps for a specific developer, saves them to a database (SQLite), and sends Telegram notifications for new reviews. Additionally, it provides an API and a simple web server to view the reviews.

## Core Features

### `scraper.js` (Scraping Engine)
* **`fetchDeveloperApps()`**: Fetches all apps of the configured developer from the iTunes API.
* **`fetchAppReviews(appId)`**: Fetches the latest reviews for a specific app from the iTunes RSS feed.
* **`scrapeReviews()`**: The main loop running in the background. It fetches all apps, checks for new reviews on each, saves new reviews to the database, and sends Telegram notifications if a new review is found.

### `telegram.js` (Telegram Integration)
* **`sendReviewNotification(review, appName)`**: Sends a Telegram notification for a specific new review, including rating (stars), author name, version, and review content.
* **`sendSummaryMessage(apps)`**: Sends a summary message to Telegram listing all developer apps, their average rating, and total review count.

### `server.js` (Express Server & Telegram Bot)
* **`GET /health`**: Server health check endpoint.
* **`POST /api/send-apps-summary`**: API endpoint to manually trigger a status summary sent to Telegram.
* **`GET /api/reviews`**: API endpoint returning all reviews saved in the database, ordered from newest to oldest.
* Runs `scrapeReviews()` periodically based on the configured interval (default: every 15 minutes).
* Listens to Telegram bot commands and button interactions (see Telegram instructions below).

## Local Setup Instructions

To run the project locally, follow these steps:

1. **Install Dependencies**: Open your terminal in the project folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**: Make sure to create a `.env` file in the root folder according to the "Environment Settings (.env)" section below. (This is crucial for the Telegram token, but the server will run without Telegram and print a message that notifications are disabled).

3. **Start the Server**: Run the following command:
   ```bash
   npm start
   ```

4. **Verify Deployment & API**: The server runs on port 3000 by default (or the port defined in your `.env`).
   * Access the local web interface: `http://localhost:3000`
   * Access the reviews API in JSON format: `http://localhost:3000/api/reviews`

## Telegram Setup Guide

To receive notifications and interact with the system via Telegram, set up your bot as follows:

### 1. Create a Telegram Bot
1. Search for **BotFather** (`@BotFather`) on Telegram.
2. Send the `/newbot` command and follow the instructions to choose a name and username.
3. BotFather will provide a **Token**. Save it; this is your `TELEGRAM_BOT_TOKEN`.

### 2. Retrieve Your Chat ID
To let the bot know where to send messages, you need your Chat ID (or the ID of a group containing the bot):
1. Start a chat with your bot (click Start or send a message).
2. Search Telegram for helper bots like `@userinfobot` or `@getmyid_bot` to find your user ID (a numeric value). This is your `TELEGRAM_CHAT_ID`.

### 3. Environment Settings (.env)
Create or edit a file named `.env` in the root folder of the project, and add the following configuration (replace with your actual values):

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Additional settings (optional):
# STORE_COUNTRY=us
# DEVELOPER_TERM=First Last Name
# PORT=3000
# POLL_INTERVAL_MINUTES=15
```

### 4. Interactive Features & Commands
Once the server is running with the correct configuration:
* **Automated Notifications**: The bot will automatically message you when a new review is posted.
* **Bot Commands**:
  - Send the `/start` or `/apps` command to the bot.
  - The bot will reply with a summary message containing all your apps and their average ratings.
  - Interactive buttons will appear below the message. Clicking a button retrieves the **last 5 reviews** saved in the database for that app.

