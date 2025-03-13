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

bot.onText(/.*/, (msg, match) => {
    const chatId = msg.chat.id;
    const option = match[0];

    switch (option) {
        case '1': // Opção 1: Suporte Franquia
            bot.sendMessage(chatId, 'Você escolheu "Suporte Franquia". Escolha uma sub-opção:\n[1.1] Como abrir uma franquia\n[1.2] Como gerenciar uma franquia\n[1.3] Suporte técnico');
            break;
        
        case '1.1': // Sub-opção 1.1: Como abrir uma franquia
            bot.sendMessage(chatId, 'Para abrir uma franquia, entre em contato com nossa equipe de expansão ou visite nosso site para mais informações.');
            break;
        
        case '1.2': // Sub-opção 1.2: Como gerenciar uma franquia
            bot.sendMessage(chatId, 'Para gerenciar sua franquia, acesse o portal do franqueado e consulte os materiais de apoio.');
            break;

        case '1.3': // Sub-opção 1.3: Suporte técnico
            bot.sendMessage(chatId, 'Se você precisa de suporte técnico, envie o problema detalhado e nossa equipe irá ajudar o mais rápido possível.');
            break;

        case '2': // Opção 2: Migração Franquia
            bot.sendMessage(chatId, 'Você escolheu "Migração Franquia". Escolha uma sub-opção:\n[2.1] Como migrar uma franquia\n[2.2] Suporte para migração');
            break;

        case '2.1': // Sub-opção 2.1: Como migrar uma franquia
            bot.sendMessage(chatId, 'Para migrar uma franquia, você deve seguir o processo de migração descrito em nosso portal de franqueados.');
            break;

        case '2.2': // Sub-opção 2.2: Suporte para migração
            bot.sendMessage(chatId, 'Para obter suporte na migração da franquia, entre em contato com a nossa equipe técnica via e-mail ou telefone.');
            break;

        case '3': // Opção 3: Duduzinho fofinho
            bot.sendMessage(chatId, 'Você escolheu "Duduzinho fofinho"! Não temos sub-opções para esta opção, mas podemos conversar sobre coisas fofinhas!');
            break;

        case '4': // Opção 4: Carol dos docinhos
            bot.sendMessage(chatId, 'Você escolheu "Carol dos docinhos"! Fique à vontade para perguntar sobre nossos deliciosos docinhos!');
            break;

        case '5': // Opção 5: Falar com suporte
            bot.sendMessage(chatId, 'Você escolheu "Falar com suporte". Um atendente entrará em contato com você em breve.');
            break;

        default: // Caso o usuário digite uma opção inválida
            bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha um número válido.');
            break;
    }
});