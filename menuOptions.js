const menuOptions = [
    { 
        option: '1', 
        text: 'Opção 1', 
        type: 'text', 
        subOptions: [
            { option: '1', text: 'Sub Opção 1', type: 'text' },
            { option: '2', text: 'Sub Opção 2', type: 'text' },
            { option: '3', text: 'Sub Opção 3', type: 'text' }
        ]
    },
    { 
        option: '2', 
        text: 'Opção 2', 
        type: 'text', 
        subOptions: [
            { option: '1', text: 'Sub Opção 1', type: 'text' },
            { option: '2', text: 'Sub Opção 2', type: 'text' }
        ]
    },
    { option: '3', text: 'Opção 3', type: 'text', subOptions: [] },
    { option: '4', text: 'Opção 4', type: 'text', subOptions: [] },
    { option: '5', text: 'Opção 5', type: 'text', subOptions: [] },
    { option: '6', text: 'Opção audio', type: 'audio', fileName: 'test.mp3', subOptions: [] },
    { option: '7', text: 'Opção documento', type: 'document', fileName: 'test.pdf', subOptions: [] },
    { option: '8', text: 'Opção imagem', type: 'image', fileName: 'test.jpg', subOptions: [] }
];

module.exports = menuOptions;
