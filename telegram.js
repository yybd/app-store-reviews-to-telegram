const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot = null;

if (token && chatId) {
  bot = new TelegramBot(token, { polling: false });
  console.log('Telegram bot configured.');
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

module.exports = { sendReviewNotification };
