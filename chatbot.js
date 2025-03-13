require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const menuOptions = require('./config');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('Erro: TELEGRAM_BOT_TOKEN não definido no arquivo .env');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Bot do Telegram está rodando.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Exibir menu principal
function showMenu(chatId) {
    let menuText = 'Escolha uma opção:\n';
    menuOptions.forEach(option => {
        menuText += `${option.option} - ${option.text}\n`;
    });
    bot.sendMessage(chatId, menuText);
}

// Exibir submenus
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

// Manipulação de mensagens
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if (text === '/start') {
        showMenu(chatId);
        return;
    }
    
    const selectedOption = menuOptions.find(item => item.option === text);
    if (!selectedOption) {
        bot.sendMessage(chatId, 'Opção inválida. Tente novamente.');
        showMenu(chatId);
        return;
    }
    
    if (selectedOption.type === 'text') {
        bot.sendMessage(chatId, selectedOption.text);
        if (selectedOption.subOptions.length > 0) {
            showSubMenu(chatId, text);
        }
    } else {
        const filePaths = {
            audio: `./assets/audios/${selectedOption.fileName}`,
            document: `./assets/documents/${selectedOption.fileName}`,
            image: `./assets/images/${selectedOption.fileName}`
        };
        
        const filePath = filePaths[selectedOption.type];
        if (fs.existsSync(filePath)) {
            const sendFile = {
                audio: () => bot.sendAudio(chatId, filePath),
                document: () => bot.sendDocument(chatId, filePath),
                image: () => bot.sendPhoto(chatId, filePath)
            };
            sendFile[selectedOption.type]();
        } else {
            bot.sendMessage(chatId, 'Arquivo não encontrado.');
        }
    }
});

console.log('Bot iniciado...');
