const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const menuOptions = require('./config');

const token = '7750421048:AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });

console.log('Bot iniciado e aguardando mensagens...');

const userState = {};

function escapeMarkdownV2(text) {
    return text.replace(/(_*()~`>#+=|{}.!)/g, '\\$1');
}

// Exibe o menu principal
function showMenu(chatId) {
    let menuText = '*Escolha uma opção:*\n\n';
    menuOptions.forEach(option => {
        menuText += `*[${option.option}]* ${escapeMarkdownV2(option.text)}\n`;
    });
    bot.sendMessage(chatId, menuText, { parse_mode: 'MarkdownV2' });
    userState[chatId] = { menu: 'main', parent: null };
}

// Exibe um submenu
function showSubMenu(chatId, parentOption) {
    const selectedOption = menuOptions.find(item => item.option === parentOption);
    if (selectedOption && selectedOption.subOptions?.length > 0) {
        let subMenuText = `*Opção selecionada:*\n*[${selectedOption.option}]* ${escapeMarkdownV2(selectedOption.text)}\n\n*Escolha uma opção:*\n`;
        selectedOption.subOptions.forEach(sub => {
            subMenuText += `*[${sub.option}]* ${escapeMarkdownV2(sub.text)}\n`;
        });
        subMenuText += `*[0]* Voltar ao menu principal`;

        bot.sendMessage(chatId, subMenuText, { parse_mode: 'MarkdownV2' });
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
                bot.sendMessage(chatId, `*[${selectedOption.option}]* ${escapeMarkdownV2(selectedOption.text)}`, { parse_mode: 'MarkdownV2' });
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
                bot.sendMessage(chatId, `*[${subOption.option}]* ${escapeMarkdownV2(subOption.text)}`, { parse_mode: 'MarkdownV2' });
            } else {
                bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
                showMenu(chatId);
            }
        } else {
            showMenu(chatId);
        }
    }
});
