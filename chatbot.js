const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const handleOption = require('./options');

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

const sendMenu = (chatId) => {
    const optionsMessage = `Escolha uma opção digitando o número correspondente:
[1] Suporte Franquia
[2] Migração Franquia
[3] Duduzinho fofinho
[4] Carol dos docinhos
[5] Falar com suporte
[6] Enviar áudio para o cliente
[7] Enviar documento para o cliente
[8] Enviar imagem para o cliente
`;

    bot.sendMessage(chatId, optionsMessage);
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bem-vindo ao atendimento automatizado LLI9!');
    sendMenu(chatId);
});

bot.onText(/.*/, (msg, match) => {
    const chatId = msg.chat.id;
    const option = match[0];
    const numOptions = handleOption(bot, chatId, option);

    const validOptions = Array.from({ length: numOptions }, (_, i) => (i + 1).toString());
    if (validOptions.includes(option)) {
        handleOption(bot, chatId, option);
    } else {
        bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha uma opção válida.');
        sendMenu(chatId);
    }
});
