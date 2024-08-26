// Função para alternar entre temas escuro e claro
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeToggle.textContent = '🕳️';
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeToggle.textContent = '💡';
    }
  }

let history = [];
let historyIndex = -1;
let originalData = [];

function showNextStep(inputMethod) {
    document.getElementById('manualInput').classList.add('hidden');
    document.getElementById('fileInputSection').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('formatButtons').classList.add('hidden');
    document.getElementById('resultButtons').classList.add('hidden');

    if (inputMethod === 'manual') {
        document.getElementById('manualInput').classList.remove('hidden');
    } else if (inputMethod === 'file') {
        document.getElementById('fileInputSection').classList.remove('hidden');
    }
}

function checkManualInput() {
    const numberEditor = document.getElementById('numberEditor').value.trim();
    if (numberEditor) {
        originalData = numberEditor.split('\n').map(row => [row]);
        showSteps();
    } else {
        hideSteps();
    }
}

function checkFileInput() {
    const fileInput = document.getElementById('fileInput').files;
    if (fileInput.length > 0) {
        showSteps();
    } else {
        hideSteps();
    }
}

function showSteps() {
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('formatButtons').classList.remove('hidden');
    document.getElementById('resultButtons').classList.remove('hidden');
    displayFileData(originalData);
}

function hideSteps() {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('formatButtons').classList.add('hidden');
    document.getElementById('resultButtons').classList.add('hidden');
}

function clearManualInput() {
    document.getElementById('numberEditor').value = '';
    checkManualInput();
}

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        originalData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        displayFileData(originalData);
        showSteps();
    };
    reader.readAsArrayBuffer(file);
}

function displayFileData(data) {
    const columnSelect = document.getElementById('columnSelect');
    columnSelect.innerHTML = '';

    if (data.length > 0) {
        const headers = data[0];
        headers.forEach((header, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = header;
            columnSelect.appendChild(option);
        });
    }

    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = '<table><thead><tr>' + data[0].map(header => '<th>' + header + '</th>').join('') + '</tr></thead><tbody>' + data.slice(1).map(row => '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
}

function formatPhoneNumber() {
    const ddi = document.getElementById('ddi').value;
    const columnIndexes = Array.from(document.getElementById('columnSelect').selectedOptions).map(option => parseInt(option.value));
    const nameEditOption = document.getElementById('nameEdit').value;

    const formattedData = originalData.map((row, rowIndex) => {
        if (rowIndex === 0) return row; // Skip headers

        return row.map((cell, index) => {
            if (columnIndexes.includes(index)) {
                let newValue = cell.toString().replace(/[\s-()]/g, ''); // Remove spaces, dashes, and parentheses
                newValue = newValue.replace(/[^\d+]/g, ''); // Remove non-numeric characters except +
                if (!newValue.startsWith('+' + ddi)) {
                    newValue = '+' + ddi + newValue.replace(/^\+/, ''); // Add DDI if not present
                }
                return newValue;
            } else {
                return editName(cell, nameEditOption);
            }
        });
    });

    const uniqueNumbers = [...new Set(formattedData.slice(1).map(row => row.filter((cell, index) => columnIndexes.includes(index))).flat())];
    addToHistory(uniqueNumbers.join('\n'));
    document.getElementById('formattedNumber').textContent = uniqueNumbers.join('\n');
    alert('Números formatados e duplicatas removidas!');
    displayFileData(formattedData);
}

function editName(name, option) {
    if (typeof name !== 'string') return name;

    switch (option) {
        case 'lower':
            return name.toLowerCase();
        case 'upper':
            return name.toUpperCase();
        case 'capitalize':
            return name.replace(/\b\w/g, char => char.toUpperCase());
        default:
            return name;
    }
}

function removeDDI() {
    const ddi = document.getElementById('ddi').value;
    const formattedNumbers = document.getElementById('formattedNumber').textContent.split('\n');
    const updatedNumbers = formattedNumbers.map(number => {
        if (number.startsWith('' + ddi)) {
            return number.replace('' + ddi, '');
        }
        return number;
    });

    addToHistory(updatedNumbers.join('\n'));
    document.getElementById('formattedNumber').textContent = updatedNumbers.join('\n');
}

function copyResult() {
    const result = document.getElementById('formattedNumber').textContent;
    navigator.clipboard.writeText(result).then(() => {
        alert('Resultado copiado para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar resultado: ', err);
    });
}

function clearResult() {
    addToHistory('');
    document.getElementById('formattedNumber').textContent = '';
    clearManualInput();
}

function addToHistory(state) {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(state);
    historyIndex++;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        document.getElementById('formattedNumber').textContent = history[historyIndex];
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        document.getElementById('formattedNumber').textContent = history[historyIndex];
    }
}

function removeBlankLines() {
    const formattedNumbers = document.getElementById('formattedNumber').textContent.split('\n');
    const updatedNumbers = formattedNumbers.filter(number => number.trim() !== '');

    addToHistory(updatedNumbers.join('\n'));
    document.getElementById('formattedNumber').textContent = updatedNumbers.join('\n');
}

function exportToTxt() {
    const result = document.getElementById('formattedNumber').textContent;
    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted_numbers.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToExcel() {
    const table = document.querySelector('#resultTable table');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'formatted_numbers.xlsx');
}

document.getElementById('menu-button').addEventListener('click', function () {
    document.getElementById('sidebar').style.left = '0';
});

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('sidebar').style.left = '-300px';
});
// Função para ativar link do menu
const list = document.querySelectorAll('.list');
function activelink() {
  list.forEach((item) => item.classList.remove('active'));
  this.classList.add('active');
}

list.forEach((item) => item.addEventListener('mouseover', activelink));
