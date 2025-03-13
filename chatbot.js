const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const menuOptions = require('./config');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });

console.log('Bot iniciado e aguardando mensagens...');

const userState = {};

// Exibe o menu principal
function showMenu(chatId) {
    let menuText = '*Escolha uma opção:*\n\n';
    menuOptions.forEach(option => {
        menuText += `[${option.option}] ${option.text}\n`;
    });
    bot.sendMessage(chatId, menuText);
    userState[chatId] = { menu: 'main', parent: null };
}

// Exibe um submenu
function showSubMenu(chatId, parentOption) {
    const selectedOption = menuOptions.find(item => item.option === parentOption);
    if (selectedOption && selectedOption.subOptions?.length > 0) {
        let subMenuText = `*Opção selecionada:*\n[${selectedOption.option}] ${selectedOption.text}\n\nEscolha uma opção:\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `[${sub.option}] ${sub.text}\n`;
        });
        subMenuText += `[0] Voltar ao menu principal`;

        bot.sendMessage(chatId, subMenuText);
        userState[chatId] = { menu: 'submenu', parent: parentOption };
    } else {
        bot.sendMessage(chatId, 'Opção inválida ou sem subopções.');
    }
}

// Manipula mensagens recebidas
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
                bot.sendMessage(chatId, `[${selectedOption.option}] ${selectedOption.text}`);
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
                bot.sendMessage(chatId, `[${subOption.option}] ${subOption.text}`);
            } else {
                bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
                showMenu(chatId);
            }
        } else {
            showMenu(chatId);
        }
    }
});
