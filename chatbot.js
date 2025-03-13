const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Bot running!');
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bem-vindo ao atendimento automatizado LLI9!');
    const optionsMessage = `Escolha uma opção digitando o número correspondente:
[1] Suporte Franquia
[2] Migração Franquia
[3] Duduzinho fofinho
[4] Carol dos docinhos
[5] Falar com suporte
`;

    bot.sendMessage(chatId, optionsMessage);
});


bot.onText(/(1|2|3)/, (msg, match) => {
    const chatId = msg.chat.id;
    const option = match[0];

    switch (option) {
        case '1':
            bot.sendMessage(chatId, 'Você escolheu a Opção 1!');
            break;
        case '2':
            bot.sendMessage(chatId, 'Você escolheu a Opção 2!');
            break;
        case '3':
            bot.sendMessage(chatId, 'Você escolheu a Opção 3!');
            break;
        case '4':
            bot.sendMessage(chatId, 'Você escolheu a Opção 4!');
            break;
        case '5':
            bot.sendMessage(chatId, 'Você escolheu a Opção 5!');
            break;
        default:
            bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha um número válido.');
            break;
    }
});
