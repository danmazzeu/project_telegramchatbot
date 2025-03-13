const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const menuOptions = require('./config');

const token = 'SEU_TOKEN_AQUI';
const bot = new TelegramBot(token, { polling: true });

console.log('Bot iniciado e aguardando mensagens...');

const userState = {}; // Armazena o estado do usuário (menu/submenu atual)

// Exibe o menu principal
function showMenu(chatId) {
    let menuText = 'Escolha uma opção:\n\n';
    menuOptions.forEach(option => {
        menuText += `${option.option} - ${option.text}\n`;
    });
    bot.sendMessage(chatId, menuText);
    userState[chatId] = 'main'; // Define que o usuário está no menu principal
}

// Exibe o submenu
function showSubMenu(chatId, option) {
    const selectedOption = menuOptions.find(item => item.option === option);
    if (selectedOption && selectedOption.subOptions.length > 0) {
        let subMenuText = `${selectedOption.text}\n\nEscolha uma opção:\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `${sub.option} - ${sub.text}\n`;
        });
        bot.sendMessage(chatId, subMenuText);
        userState[chatId] = option; // Define que o usuário está dentro deste submenu
    } else {
        bot.sendMessage(chatId, 'Opção inválida ou sem subopções.');
    }
}

// Manipula as mensagens recebidas
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === '/start') {
        showMenu(chatId);
        return;
    }

    const currentState = userState[chatId] || 'main';

    if (currentState === 'main') {
        // Usuário está no menu principal
        const selectedOption = menuOptions.find(item => item.option === text);
        if (selectedOption) {
            if (selectedOption.subOptions.length > 0) {
                showSubMenu(chatId, text);
            } else {
                bot.sendMessage(chatId, selectedOption.text);
            }
        } else {
            bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
            showMenu(chatId);
        }
    } else {
        // Usuário está em um submenu
        const parentOption = menuOptions.find(item => item.option === currentState);
        if (parentOption) {
            const subOption = parentOption.subOptions.find(sub => sub.option === text);
            if (subOption) {
                if (subOption.option === '0') {
                    showMenu(chatId); // Voltar ao menu principal
                } else {
                    bot.sendMessage(chatId, subOption.text);
                }
            } else {
                bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
                showSubMenu(chatId, currentState);
            }
        } else {
            showMenu(chatId);
        }
    }
});
