const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot = null;

if (token && chatId) {
  bot = new TelegramBot(token, { polling: true });
  console.log('Telegram bot configured with polling.');
} else {
  console.log('Telegram bot token or chat ID not provided. Telegram notifications disabled.');
}

const sendReviewNotification = async (review, appName) => {
  if (!bot || !chatId) return;

  const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
  const message = `
🔔 *New Review for ${appName}*

${stars}
*${review.title}*
by _${review.author_name}_ (v${review.version})

${review.content}
`;

  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log(`Sent Telegram notification for review ${review.id}`);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

const sendSummaryMessage = async (apps) => {
  if (!bot || !chatId) return false;

  let message = `📊 *Apps Rating Summary*\n\n`;
  
  if (apps.length === 0) {
    message += `No apps found.`;
  } else {
    apps.forEach(app => {
      const stars = app.rating > 0 ? '⭐'.repeat(Math.round(app.rating)) + '☆'.repeat(5 - Math.round(app.rating)) : 'No ratings yet';
      message += `📱 *${app.name}*\n${stars} (${app.rating} avg from ${app.ratingCount} reviews)\n\n`;
    });
  }

  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log('Sent Telegram summary notification.');
    return true;
  } catch (error) {
    console.error('Error sending Telegram summary:', error);
    return false;
  }
};

module.exports = { bot, sendReviewNotification, sendSummaryMessage };
