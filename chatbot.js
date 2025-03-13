const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const menuOptions = require('./config');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });

console.log('Bot iniciado e aguardando mensagens...');

function showMenu(chatId) {
    let menuText = 'Escolha uma opção:\n\n';
    menuOptions.forEach(option => {
        menuText += `${option.option} - ${option.text}\n`;
    });
    bot.sendMessage(chatId, menuText);
}

function showSubMenu(chatId, option) {
    const selectedOption = menuOptions.find(item => item.option === option);
    if (selectedOption && selectedOption.subOptions.length > 0) {
        let subMenuText = `${selectedOption.text}\n\nEscolha uma opção:\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `${sub.option} - ${sub.text}\n`;
        });
        bot.sendMessage(chatId, subMenuText);
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

    const selectedOption = menuOptions.find(item => item.option === text);

    if (selectedOption) {
        if (selectedOption.type === 'text') {
            bot.sendMessage(chatId, selectedOption.text);
            if (selectedOption.subOptions.length > 0) {
                showSubMenu(chatId, text);
            }
        } else {
            let filePath = '';
            if (selectedOption.type === 'audio') {
                filePath = `./assets/audios/${selectedOption.fileName}`;
            } else if (selectedOption.type === 'document') {
                filePath = `./assets/documents/${selectedOption.fileName}`;
            } else if (selectedOption.type === 'image') {
                filePath = `./assets/images/${selectedOption.fileName}`;
            }

            if (fs.existsSync(filePath)) {
                if (selectedOption.type === 'audio') {
                    bot.sendAudio(chatId, filePath);
                } else if (selectedOption.type === 'document') {
                    bot.sendDocument(chatId, filePath);
                } else if (selectedOption.type === 'image') {
                    bot.sendPhoto(chatId, filePath);
                }
            } else {
                bot.sendMessage(chatId, 'Arquivo não encontrado.');
            }
        }
    } else {
        bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
        showMenu(chatId);
    }
});
