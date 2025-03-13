const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Substitua 'SEU_TOKEN_AQUI' pelo token gerado pelo BotFather
const token = 'SEU_TOKEN_AQUI';
const bot = new TelegramBot(token, { polling: true });

// Criar um aplicativo Express
const app = express();

// Porta em que o servidor vai rodar
const port = 3000;  // Substitua com a porta que deseja usar

// Endpoint simples para testar o servidor
app.get('/', (req, res) => {
  res.send('Bot de Telegram está rodando!');
});

// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Resposta inicial quando o bot for iniciado
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Olá! Eu sou um bot. Como posso te ajudar hoje?');
  bot.sendMessage(chatId, 'Escolha uma opção digitando o número correspondente:\n1. Opção 1\n2. Opção 2\n3. Opção 3');
});

// O bot vai responder de acordo com a escolha do usuário
bot.onText(/(1|2|3)/, (msg, match) => {
  const chatId = msg.chat.id;
  const opcaoEscolhida = match[0];

  switch (opcaoEscolhida) {
    case '1':
      bot.sendMessage(chatId, 'Você escolheu a Opção 1!');
      break;
    case '2':
      bot.sendMessage(chatId, 'Você escolheu a Opção 2!');
      break;
    case '3':
      bot.sendMessage(chatId, 'Você escolheu a Opção 3!');
      break;
    default:
      bot.sendMessage(chatId, 'Opção inválida. Por favor, escolha um número válido.');
      break;
  }
});
