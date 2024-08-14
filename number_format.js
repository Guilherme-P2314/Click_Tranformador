// Função para alternar entre temas escuro e claro
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggle.textContent = '🌙';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
  }
}

// Função para mostrar o próximo passo com base no método de entrada selecionado
function showNextStep(inputMethod) {
  document.getElementById('manualInput').classList.add('hidden');
  document.getElementById('fileInputSection').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('filterSection').classList.add('hidden');

  if (inputMethod === 'manual') {
    document.getElementById('manualInput').classList.remove('hidden');
  } else if (inputMethod === 'file') {
    document.getElementById('fileInputSection').classList.remove('hidden');
  }
}

// Função para processar a entrada manual
function handleManualInput() {
  const numberEditor = document.getElementById('numberEditor').value.trim();
  if (numberEditor) {
    const rows = numberEditor.split('\n');
    const header = rows[0].split('\t');
    populateColumnSelect(header);
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('filterSection').classList.remove('hidden');
  }
}

// Função para preencher o select com as colunas
function populateColumnSelect(header) {
  const columnSelect = document.getElementById('columnSelect');
  columnSelect.innerHTML = '';
  header.forEach(col => {
    let option = document.createElement('option');
    option.value = col;
    option.textContent = col;
    columnSelect.appendChild(option);
  });
  columnSelect.classList.remove('hidden');
  document.getElementById('filterSection').classList.remove('hidden');
}

// Função para processar o arquivo carregado
function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

    let result = '';
    let header = rows[0];
    populateColumnSelect(header);

    rows.forEach(row => {
      let values = Object.values(row);
      result += values.join('\t') + '\n';
    });

    document.getElementById('numberEditor').value = result.trim();
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('filterSection').classList.remove('hidden');
  };
  reader.readAsArrayBuffer(file);
}

// Função para aplicar o filtro à coluna selecionada
function applyFilter() {
  const filterValue = document.getElementById('filterInput').value.toLowerCase();
  const selectedColumn = document.getElementById('columnSelect').value;
  const numberEditor = document.getElementById('numberEditor');
  
  let rows = numberEditor.value.split('\n');
  let header = rows[0].split('\t');
  let numberIndex = header.indexOf(selectedColumn);

  let filteredRows = rows.filter((row, index) => {
    if (index === 0) return true; // Keep the header
    const columns = row.split('\t');
    return columns[numberIndex].toLowerCase().includes(filterValue);
  });

  numberEditor.value = filteredRows.join('\n');
}

// Função para formatar números de telefone com base no DDI selecionado
async function formatPhoneNumber() {
  const columnSelect = document.getElementById('columnSelect');
  const selectedColumn = columnSelect.value;
  const numberEditor = document.getElementById('numberEditor');
  const ddi = "55"; // Define o DDI para +55 automaticamente

  let numberText = numberEditor.value;
  let rows = numberText.split('\n');
  let result = [];
  let header = rows[0].split('\t');
  let numberIndex = header.indexOf(selectedColumn);

  document.getElementById('loading').classList.remove('hidden');
  await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno atraso para garantir que a UI atualize

  rows.slice(1).forEach(row => {
    let columns = row.split('\t');
    let cleanNumber = columns[numberIndex].replace(/[^0-9]/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = '9' + cleanNumber;
    }
    if (cleanNumber.length === 11) {
      const ddd = cleanNumber.slice(0, 2);
      const num = cleanNumber.slice(2);
      cleanNumber = ddi + ddd + num;
    }
    columns[numberIndex] = cleanNumber;
    result.push(columns);
  });

  document.getElementById('loading').classList.add('hidden');

  // Atualiza a tabela com o texto formatado
  updateTable(header, result);

  // Exibe a quantidade de linhas obtidas no resultado
  document.getElementById('resultCount').textContent = `Total de linhas: ${result.length}`;

  // Exibe a barra lateral de resultado
  document.getElementById('sidebarResult').style.right = '0';
}

// Função para atualizar a tabela com os resultados
function updateTable(header, data) {
  const container = document.getElementById('resultTable');
  container.innerHTML = '';

  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  // Cria cabeçalho
  let tr = document.createElement('tr');
  header.forEach(col => {
    let th = document.createElement('th');
    th.textContent = col;
    tr.appendChild(th);
  });
  thead.appendChild(tr);

  // Cria corpo da tabela
  data.forEach(row => {
    let tr = document.createElement('tr');
    row.forEach(cell => {
      let td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

// Função para abrir a barra lateral
function toggleMenu() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.left === "-250px" || sidebar.style.left === "") {
    sidebar.style.left = "0";
  } else {
    sidebar.style.left = "-250px";
  }
}

document.getElementById('menu-button').addEventListener('click', toggleMenu);
document.getElementById('closeBtn').addEventListener('click', toggleMenu);
document.getElementById('menuResultButton').addEventListener('click', function() {
  document.getElementById('sidebarResult').style.right = '0';
});
document.getElementById('closeResultBtn').addEventListener('click', function() {
  document.getElementById('sidebarResult').style.right = '-300px';
});

// Função para copiar o resultado para a área de transferência
function copyToClipboard() {
  const resultTable = document.getElementById('resultTable').innerText;
  navigator.clipboard.writeText(resultTable).then(() => {
    alert('Resultado copiado para a área de transferência!');
  }).catch(err => {
    alert('Erro ao copiar resultado: ', err);
  });
}

// Função para limpar o resultado
function clearResult() {
  document.getElementById('resultTable').innerHTML = '';
  document.getElementById('resultCount').textContent = '';
  document.getElementById('sidebarResult').style.right = '-300px';
}

// Função para prompt de exportação
function promptExportOptions() {
  let rowsPerFile = prompt('Deseja limitar a quantidade de linhas por arquivo? Se sim, insira o número de linhas por arquivo. Caso contrário, deixe em branco.');
  if (rowsPerFile !== null) {
    rowsPerFile = parseInt(rowsPerFile);
    if (isNaN(rowsPerFile)) {
      exportToExcel();
    } else {
      exportToMultipleFiles(rowsPerFile);
    }
  }
}

// Função para exportar o resultado para múltiplos arquivos Excel
function exportToMultipleFiles(rowsPerFile) {
  const table = document.querySelector('#resultTable table');
  const rows = Array.from(table.querySelectorAll('tr'));
  const header = rows.shift(); // Remove the header row

  for (let i = 0; i < rows.length; i += rowsPerFile) {
    const chunk = rows.slice(i, i + rowsPerFile);
    const tempTable = document.createElement('table');
    tempTable.appendChild(header.cloneNode(true));
    chunk.forEach(row => tempTable.appendChild(row.cloneNode(true)));
    
    const worksheet = XLSX.utils.table_to_sheet(tempTable);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `formatted_numbers_part${Math.floor(i / rowsPerFile) + 1}.xlsx`);
  }
}

// Função para exportar o resultado para um arquivo Excel
function exportToExcel() {
  const table = document.querySelector('#resultTable table');
  const worksheet = XLSX.utils.table_to_sheet(table);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'formatted_numbers.xlsx');
}

function saveServiceInteraction(serviceId) {
  let interactions = JSON.parse(localStorage.getItem('service-interactions')) || [];
  interactions.push({ serviceId: serviceId, timestamp: new Date().toISOString() });
  localStorage.setItem('service-interactions', JSON.stringify(interactions));
}

function loadSavedInteractions() {
  const interactions = JSON.parse(localStorage.getItem('service-interactions')) || [];
  interactions.forEach(interaction => {
      const service = document.getElementById(interaction.serviceId);
      if (service) {
          service.style.border = '2px solid var(--primary-color)';
      }
  });

  // Carrega o tema salvo
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) {
      document.body.classList.add(savedTheme);
  }
}

function clearCache() {
  localStorage.clear();
  alert('O cache do navegador foi limpo!');
}
