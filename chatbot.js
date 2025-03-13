const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const menuOptions = require('./menuOptions');
const { token } = require('./token');
const bot = new TelegramBot(token, { polling: true });

console.log('Bot iniciado e aguardando mensagens...');

const userState = {};

function escapeMarkdownV2(text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

function showMenu(chatId) {
    let menuText = '*Escolha uma opção:*\n\n';
    menuOptions.forEach(option => {
        menuText += `*\\[ ${option.option} \\]* ${escapeMarkdownV2(option.text)}\n`;
    });
    bot.sendMessage(chatId, menuText, { parse_mode: 'MarkdownV2' });
    userState[chatId] = { menu: 'main', parent: null };
}

function showSubMenu(chatId, parentOption) {
    const selectedOption = menuOptions.find(item => item.option === parentOption);
    if (selectedOption && selectedOption.subOptions?.length > 0) {
        let subMenuText = `*Opção selecionada:*\n*\\[${selectedOption.option}\\]* ${escapeMarkdownV2(selectedOption.text)}\n\n*Escolha uma opção:*\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `*\\[ ${sub.option} \\]* ${escapeMarkdownV2(sub.text)}\n`;
        });
        subMenuText += `*\\[ 0 \\]* Voltar ao menu principal`;

        bot.sendMessage(chatId, subMenuText, { parse_mode: 'MarkdownV2' });
        userState[chatId] = { menu: 'submenu', parent: parentOption };
    } else {
        bot.sendMessage(chatId, 'Opção inválida ou sem subopções.');
    }
}

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === '/start') {
        showMenu(chatId);
        return;
    }

    const currentState = userState[chatId] || { menu: 'main', parent: null };

    if (currentState.menu === 'main') {
        const selectedOption = menuOptions.find(item => item.option === text.toString());
        if (selectedOption) {
            if (selectedOption.subOptions?.length > 0) {
                showSubMenu(chatId, text);
            } else {
                handleOptionSelection(chatId, selectedOption);
            }
        } else {
            bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
        }
    } else if (currentState.menu === 'submenu') {
        if (text === '0') {
            showMenu(chatId);
            return;
        }

        const parentOption = menuOptions.find(item => item.option === currentState.parent);
        if (parentOption) {
            const subOption = parentOption.subOptions.find(sub => sub.option === text.toString());
            if (subOption) {
                handleOptionSelection(chatId, subOption);
            } else {
                bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
                showMenu(chatId);
            }
        } else {
            showMenu(chatId);
        }
    }
});

function handleOptionSelection(chatId, option) {
    switch (option.type) {
        case 'text':
            bot.sendMessage(chatId, `*Opção selecionada:*\n*\\[ ${option.option} \\]* ${escapeMarkdownV2(option.text)}`, { parse_mode: 'MarkdownV2' });
            break;
        case 'audio':
            sendFile(chatId, option.fileName, 'audio', './assets/audios/');
            break;
        case 'document':
            sendFile(chatId, option.fileName, 'document', './assets/documents/');
            break;
        case 'image':
            sendFile(chatId, option.fileName, 'photo', './assets/images/');
            break;
        default:
            bot.sendMessage(chatId, 'Opção não reconhecida.');
    }
}

function sendFile(chatId, fileName, type, directory) {
    const filePath = path.join(directory, fileName);
    if (fs.existsSync(filePath)) {
        switch (type) {
            case 'audio':
                bot.sendMessage(chatId, 'Enviando audio...');
                bot.sendAudio(chatId, filePath);
                break;
            case 'document':
                bot.sendMessage(chatId, 'Enviando documento...');
                bot.sendDocument(chatId, filePath);
                break;
            case 'photo':
                bot.sendMessage(chatId, 'Enviando imagem...');
                bot.sendPhoto(chatId, filePath);
                break;
        }
    } else {
        bot.sendMessage(chatId, 'Arquivo não encontrado.');
    }
}
