const menuOptions = [
    { 
        option: '1', 
        text: 'Suporte Franquia', 
        type: 'text', 
        subOptions: [
            { option: '1', text: 'Como abrir uma franquia', type: 'text' },
            { option: '2', text: 'Como gerenciar uma franquia', type: 'text' },
            { option: '3', text: 'Suporte técnico', type: 'text' }
        ]
    },
    { 
        option: '2', 
        text: 'Migração Franquia', 
        type: 'text', 
        subOptions: [
            { option: '1', text: 'Como migrar uma franquia', type: 'text' },
            { option: '2', text: 'Suporte para migração', type: 'text' }
        ]
    },
    { option: '3', text: 'Duduzinho fofinho', type: 'text', subOptions: [] },
    { option: '4', text: 'Carol dos docinhos', type: 'text', subOptions: [] },
    { option: '5', text: 'Falar com suporte', type: 'text', subOptions: [] },
    { option: '6', text: 'Enviar áudio para o cliente', type: 'audio', fileName: 'test.mp3', subOptions: [] },
    { option: '7', text: 'Enviar documento para o cliente', type: 'document', fileName: 'test.pdf', subOptions: [] },
    { option: '8', text: 'Enviar imagem para o cliente', type: 'image', fileName: 'test.jpg', subOptions: [] }
];

module.exports = menuOptions;
