require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// 存储绑定用户的 chat ID
const boundUsers = new Set();

// 监听 /start 命令
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '欢迎使用我的 Telegram 机器人！发送 /bind 绑定接收消息，发送 /unbind 解除绑定。');
});

// 监听 /bind 命令
bot.onText(/\/bind/, (msg) => {
  const chatId = msg.chat.id;
  if (!boundUsers.has(chatId)) {
    boundUsers.add(chatId);
    bot.sendMessage(chatId, '你已成功绑定，将每 10 秒收到一条消息。');
  } else {
    bot.sendMessage(chatId, '你已经绑定过了。');
  }
});

// 监听 /unbind 命令
bot.onText(/\/unbind/, (msg) => {
  const chatId = msg.chat.id;
  if (boundUsers.has(chatId)) {
    boundUsers.delete(chatId);
    bot.sendMessage(chatId, '你已成功解除绑定，将不再收到定期消息。');
  } else {
    bot.sendMessage(chatId, '你还没有绑定。');
  }
});

// 每 10 秒向绑定的用户发送消息
setInterval(() => {
  const currentTime = new Date().toLocaleTimeString();
  boundUsers.forEach((chatId) => {
    bot.sendMessage(chatId, `这是一条定期消息。当前时间: ${currentTime}`);
  });
}, 10000); // 10000 毫秒 = 10 秒

// 错误处理
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});
