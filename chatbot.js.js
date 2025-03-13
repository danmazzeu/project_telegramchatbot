const TelegramBot = require('node-telegram-bot-api');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Olá! Eu sou um bot. Como posso te ajudar hoje?');
    bot.sendMessage(chatId, 'Escolha uma opção digitando o número correspondente:\n1. Opção 1\n2. Opção 2\n3. Opção 3');
});

bot.onText(/(1|2|3)/, (msg, match) => {
    const chatId = msg.chat.id;
    const options = match[0];

    switch (options) {
        case '1':
            bot.sendMessage(chatId, 'Você escolheu a Opção 1!');
            break;
        case '2':
            bot.sendMessage(chatId, 'Você escolheu a Opção 2!');
            break;
        case '3':
            bot.sendMessage(chatId, 'Você escolheu a Opção 3!');
            break;
        default:
            bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha um número válido.');
            break;
    }
});
