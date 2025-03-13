const TelegramBot = require('node-telegram-bot-api');
const menuOptions = require('./menuOptions');
const fs = require('fs');

const token = 'AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });

// Função para exibir o menu principal
function showMenu(chatId) {
    let menuText = 'Escolha uma opção:\n';
    menuOptions.forEach(option => {
        menuText += `${option.option} - ${option.text}\n`;
    });
    bot.sendMessage(chatId, menuText);
}

// Função para exibir submenus
function showSubMenu(chatId, option) {
    const selectedOption = menuOptions.find(item => item.option === option);
    if (selectedOption && selectedOption.subOptions.length > 0) {
        let subMenuText = `${selectedOption.text}\nEscolha uma opção:\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `${sub.option} - ${sub.text}\n`;
        });
        bot.sendMessage(chatId, subMenuText);
    } else {
        bot.sendMessage(chatId, 'Opção inválida ou sem subopções.');
    }
}

// Manipula as mensagens recebidas
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if (text === '/start') {
        showMenu(chatId);
    } else {
        const selectedOption = menuOptions.find(item => item.option === text);
        if (selectedOption) {
            if (selectedOption.type === 'text') {
                bot.sendMessage(chatId, selectedOption.text);
                if (selectedOption.subOptions.length > 0) {
                    showSubMenu(chatId, text);
                }
            } else if (['audio', 'document', 'image'].includes(selectedOption.type)) {
                const filePath = `./files/${selectedOption.fileName}`;
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
    }
});

console.log('Bot iniciado...');