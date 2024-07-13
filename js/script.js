let savedGames = [];

function toggleSelectionType() {
    const selectionType = document.getElementById('selection-type').value;
    if (selectionType === 'individual') {
        document.getElementById('individual-selection').style.display = 'block';
        document.getElementById('all-prizes-selection').style.display = 'none';
    } else {
        document.getElementById('individual-selection').style.display = 'none';
        document.getElementById('all-prizes-selection').style.display = 'block';
    }
}

function validateDuplicateNumbers(prize) {
    const fixedNumbers = [];
    for (let i = 1; i <= 2; i++) {
        const fixedNumberInput = document.getElementById(`fixed-number-${prize}-${i}`);
        if (fixedNumberInput && fixedNumberInput.value !== '') {
            if (fixedNumbers.includes(parseInt(fixedNumberInput.value))) {
                alert(`Número duplicado detectado: ${fixedNumberInput.value}. Por favor, insira um número diferente.`);
                fixedNumberInput.value = '';
                return false;
            }
            fixedNumbers.push(parseInt(fixedNumberInput.value));
        }
    }
    return true;
}

function generateNumbers() {
    const selectionType = document.getElementById('selection-type').value;

    for (let prize = 1; prize <= 5; prize++) {
        if (selectionType === 'individual' && !validateDuplicateNumbers(prize)) {
            return;
        }

        let fixedNumbers;
        if (selectionType === 'individual') {
            const fixed1 = parseInt(document.getElementById(`fixed-number-${prize}-1`).value);
            const fixed2 = parseInt(document.getElementById(`fixed-number-${prize}-2`).value);
            fixedNumbers = [fixed1, fixed2].filter(num => !isNaN(num));
        } else {
            const fixed1 = parseInt(document.getElementById('fixed-number-all-1').value);
            const fixed2 = parseInt(document.getElementById('fixed-number-all-2').value);
            fixedNumbers = [fixed1, fixed2].filter(num => !isNaN(num));
        }

        if (fixedNumbers.length < 2) {
            alert(`Por favor, insira dois números fixos válidos.`);
            return;
        }

        const allNumbers = Array.from({ length: 100 }, (_, i) => i);
        const availableNumbers = allNumbers.filter(num => !fixedNumbers.includes(num));
        const randomNumbers = [];

        while (randomNumbers.length < (5 - fixedNumbers.length)) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const number = availableNumbers.splice(randomIndex, 1)[0];
            randomNumbers.push(number);
        }

        const generatedNumbers = [...fixedNumbers, ...randomNumbers].sort((a, b) => a - b);
        document.getElementById(`generated-numbers-${prize}`).innerText = `${prize}º Prêmio: ${generatedNumbers.join(', ')}`;
    }
}

function saveGame() {
    const generatedTexts = [];
    for (let prize = 1; prize <= 5; prize++) {
        const generatedText = document.getElementById(`generated-numbers-${prize}`).innerText;
        if (!generatedText) {
            alert(`Nenhum jogo gerado para o ${prize}º prêmio para salvar.`);
            return;
        }
        generatedTexts.push(generatedText.replace(`${prize}º Prêmio: `, ''));
    }

    savedGames.push(generatedTexts);

    const savedGamesDiv = document.getElementById('saved-games');
    savedGamesDiv.innerHTML = savedGames.map(game => `<div>${game.join(' | ')}</div>`).join('');
}

function exportToExcel() {
    if (savedGames.length === 0) {
        alert('Nenhum jogo salvo para exportar.');
        return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheetData = [['1º Prêmio', '2º Prêmio', '3º Prêmio', '4º Prêmio', '5º Prêmio'], ...savedGames];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jogos Salvos');

    XLSX.writeFile(workbook, 'jogos_loteria_federal.xlsx');
}
