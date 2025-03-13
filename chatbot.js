const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const menuOptions = require('./config'); // Importa o array de opções
const fs = require('fs');

const token = 'AAE2LBc0gj2dLU3lejkD2LAFAG5pTEDu5RU';
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Bot do Telegram está rodando.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

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
    }
});

console.log('Bot iniciado...');