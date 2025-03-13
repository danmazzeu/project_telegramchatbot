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
[6] Enviar áudio para o cliente
[7] Enviar documento para o cliente
[8] Enviar imagem para o cliente
`;

    bot.sendMessage(chatId, optionsMessage);
});

bot.onText(/.*/, (msg, match) => {
    const chatId = msg.chat.id;
    const option = match[0];

    switch (option) {
        case '1': // Exemplo enviando texto simples
            bot.sendMessage(chatId, 'Você escolheu "Suporte Franquia". Escolha uma sub-opção:\n[1.1] Como abrir uma franquia\n[1.2] Como gerenciar uma franquia\n[1.3] Suporte técnico');
            break;
        
        case '1.1': // Exemplo sub opções
            bot.sendMessage(chatId, 'Para abrir uma franquia, entre em contato com nossa equipe de expansão ou visite nosso site para mais informações.');
            break;
        
        case '1.2':
            bot.sendMessage(chatId, 'Para gerenciar sua franquia, acesse o portal do franqueado e consulte os materiais de apoio.');
            break;

        case '1.3':
            bot.sendMessage(chatId, 'Se você precisa de suporte técnico, envie o problema detalhado e nossa equipe irá ajudar o mais rápido possível.');
            break;

        case '2':
            bot.sendMessage(chatId, 'Você escolheu "Migração Franquia". Escolha uma sub-opção:\n[2.1] Como migrar uma franquia\n[2.2] Suporte para migração');
            break;

        case '2.1':
            bot.sendMessage(chatId, 'Para migrar uma franquia, você deve seguir o processo de migração descrito em nosso portal de franqueados.');
            break;

        case '2.2':
            bot.sendMessage(chatId, 'Para obter suporte na migração da franquia, entre em contato com a nossa equipe técnica via e-mail ou telefone.');
            break;

        case '3':
            bot.sendMessage(chatId, 'Você escolheu "Duduzinho fofinho"! Não temos sub-opções para esta opção, mas podemos conversar sobre coisas fofinhas!');
            break;

        case '4':
            bot.sendMessage(chatId, 'Você escolheu "Carol dos docinhos"! Fique à vontade para perguntar sobre nossos deliciosos docinhos!');
            break;

        case '5':
            bot.sendMessage(chatId, 'Você escolheu "Falar com suporte". Um atendente entrará em contato com você em breve.');
            break;

        case '6': // Exemplo enviando audio
            const audioUrl = './assets/audios/test.mp3'; // Caminho ou URL
            bot.sendAudio(chatId, audioUrl).then(() => {
                bot.sendMessage(chatId, 'Aqui está o áudio solicitado!');
            }).catch((err) => {
                bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar o áudio.');
                console.error(err);
            });
            break;

        case '7': // Exemplo enviando documento PDF
            const pdfFilePath = "./assets/documents/test.pdf"; // Caminho ou URL
            bot.sendDocument(chatId, pdfFilePath).then(() => {
                bot.sendMessage(chatId, 'Aqui está o documento PDF solicitado!');
            }).catch((err) => {
                bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar o documento PDF.');
                console.error(err);
            });
            break;
            
        case '8': // Exemplo enviando imagem
            const imageUrl = './assets/images/test.jpg'; // Caminho ou URL
            bot.sendPhoto(chatId, imageUrl).then(() => {
                bot.sendMessage(chatId, 'Aqui está a imagem solicitada!');
            }).catch((err) => {
                bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar a imagem.');
                console.error(err);
            });
            break;

        default:
            bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha um número válido.');
            break;
    }
});
