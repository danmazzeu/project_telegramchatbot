const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const menuOptions = require('./menuOptions');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU'; // TOKEN
const bot = new TelegramBot(token, { polling: true });
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Bot running!');
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

// Função para enviar o menu inicial
const sendMenu = (chatId) => {
    let optionsMessage = 'Escolha uma opção digitando o número correspondente:\n\n';
    menuOptions.forEach(item => {
        optionsMessage += `[${item.option}] ${item.text}\n`;
    });
    bot.sendMessage(chatId, optionsMessage);
};

// Função para enviar sub-opções
const sendSubOptions = (chatId, subOptions, parentOption) => {
    let subOptionsMessage = 'Escolha uma sub-opção digitando o número correspondente:\n\n';
    subOptions.forEach(subItem => {
        subOptionsMessage += `[${subItem.option}] ${subItem.text}\n`;
    });
    subOptionsMessage += '[0] Voltar ao menu anterior'; // A opção "Voltar ao menu anterior" será mostrada apenas no submenu
    bot.sendMessage(chatId, subOptionsMessage);

    // Armazenando a opção do menu anterior
    bot.userState = bot.userState || {};
    bot.userState[chatId] = { parentOption };
};

// Função para validar o tipo de opção
const isValidType = (type) => {
    const validTypes = ['text', 'audio', 'document', 'image'];
    return validTypes.includes(type);
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bem-vindo ao atendimento automatizado LLI9!');
    sendMenu(chatId); // Exibe o menu principal
});

bot.onText(/^(\d)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const option = match[1];

    if (msg.text === '/start') {
        return;
    }

    if (option === '0') {  // Se a opção for "Voltar ao menu inicial"
        if (bot.userState && bot.userState[chatId]) {
            // Se o usuário estiver em um submenu, voltar para o menu anterior
            sendSubOptions(chatId, menuOptions.find(item => item.option === bot.userState[chatId].parentOption).subOptions, bot.userState[chatId].parentOption);
        } else {
            // Se estiver no menu principal, voltar para o menu inicial
            sendMenu(chatId);
        }
        return;
    }

    const selectedOption = menuOptions.find(item => item.option === option);

    if (selectedOption) {
        if (!isValidType(selectedOption.type)) {
            const errorMessage = `Erro: Tipo de opção inválido para a opção ${selectedOption.option} (${selectedOption.text}).`;
            console.error(errorMessage);
            bot.sendMessage(chatId, 'Erro: Tipo de opção inválido.');
            sendMenu(chatId);
            return;
        }

        if (selectedOption.subOptions && selectedOption.subOptions.length > 0) {
            sendSubOptions(chatId, selectedOption.subOptions, option);
        } else {
            switch (selectedOption.type) {
                case 'text': // Enviar texto
                    bot.sendMessage(chatId, selectedOption.text);
                    break;

                case 'audio': // Enviar áudio
                    const audioUrl = `./assets/audios/${selectedOption.fileName}`;
                    bot.sendAudio(chatId, audioUrl).then(() => {
                        bot.sendMessage(chatId, 'Aqui está o áudio solicitado!');
                    }).catch((err) => {
                        const errorMessage = `Erro ao enviar áudio: ${err.message}`;
                        console.error(errorMessage);
                        bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar o áudio.');
                    });
                    break;

                case 'document': // Enviar documento
                    const pdfFilePath = `./assets/documents/${selectedOption.fileName}`;
                    bot.sendDocument(chatId, pdfFilePath).then(() => {
                        bot.sendMessage(chatId, 'Aqui está o documento PDF solicitado!');
                    }).catch((err) => {
                        const errorMessage = `Erro ao enviar documento: ${err.message}`;
                        console.error(errorMessage);
                        bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar o documento PDF.');
                    });
                    break;

                case 'image': // Enviar imagem
                    const imageUrl = `./assets/images/${selectedOption.fileName}`;
                    bot.sendPhoto(chatId, imageUrl).then(() => {
                        bot.sendMessage(chatId, 'Aqui está a imagem solicitada!');
                    }).catch((err) => {
                        const errorMessage = `Erro ao enviar imagem: ${err.message}`;
                        console.error(errorMessage);
                        bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao enviar a imagem.');
                    });
                    break;

                default:
                    const errorMessage = `Erro: Tipo de conteúdo não reconhecido para a opção ${selectedOption.option}.`;
                    console.error(errorMessage);
                    bot.sendMessage(chatId, 'Erro: Tipo de conteúdo não reconhecido.');
                    sendMenu(chatId);
                    break;
            }
        }
    } else {
        const errorMessage = `Opção inválida escolhida: ${option}`;
        console.error(errorMessage);
        bot.sendMessage(chatId, 'Opção inválida.');
        sendMenu(chatId);
    }
});

// Lógica para voltar ao menu anterior ou menu inicial
bot.onText(/^0$/, (msg) => {
    const chatId = msg.chat.id;
    if (bot.userState && bot.userState[chatId]) {
        const parentOption = bot.userState[chatId].parentOption;
        const selectedOption = menuOptions.find(item => item.option === parentOption);

        // Se estiver em um submenu, volta para o menu do submenu
        if (selectedOption) {
            sendSubOptions(chatId, selectedOption.subOptions, parentOption);
        }
    } else {
        // Se estiver no menu principal, volta para o menu principal
        sendMenu(chatId);
    }
});
