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
  // Atualiza os estilos para refletir a mudança de tema
}

// Função para mostrar o próximo passo com base no método de entrada selecionado
function showNextStep(inputMethod) {
  // Esconde todas as seções que não são necessárias no momento
  document.getElementById('manualInput').classList.add('hidden');
  document.getElementById('fileInputSection').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');

  // Exibe a seção apropriada com base no método de entrada
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
  }
  // Verifica se a entrada manual está presente e, em caso afirmativo, processa os dados
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
  // Preenche o seletor de colunas com base no cabeçalho fornecido
}

// Função para limpar a entrada manual
function clearManualInput() {
  document.getElementById('numberEditor').value = '';
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('resultTable').innerHTML = '';
  document.getElementById('resultCount').textContent = '';
  document.getElementById('sidebarResult').style.right = '-300px';
  // Limpa o editor de números e esconde a seção de resultados
}

// Função para processar o arquivo carregado
function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
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
  };
  reader.readAsArrayBuffer(file);
  // Lê o arquivo selecionado e o processa para exibir os dados no editor
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

    if (cleanNumber.length <= 9) {
      cleanNumber = ddi + (cleanNumber.length === 8 ? '849' + cleanNumber : '84' + cleanNumber);

    } else if (cleanNumber.length === 10) {
      let ddd = cleanNumber.slice(0, 2);
      let numero = cleanNumber.slice(2);

      cleanNumber = ddi + ddd + '9' + numero;

    } else if (cleanNumber.length === 11) {
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
  // Formata os números de telefone e atualiza a interface do usuário com os resultados
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
  // Cria e exibe uma tabela com os dados formatados
}

// Função para copiar o resultado para a área de transferência
function copyToClipboard() {
  const resultTable = document.getElementById('resultTable').innerText;
  navigator.clipboard.writeText(resultTable).then(() => {
      alert('Resultado copiado para a área de transferência!');
  }).catch(err => {
      alert('Erro ao copiar resultado: ', err);
  });
  // Copia os resultados da tabela para a área de transferência
}

// Função para limpar o resultado
function clearResult() {
  document.getElementById('resultTable').innerHTML = '';
  document.getElementById('resultCount').textContent = '';
  document.getElementById('sidebarResult').style.right = '-300px';
  // Limpa os resultados da tabela e esconde a barra lateral
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
  // Prompt para o usuário escolher como deseja exportar os dados
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
  // Exporta os resultados para múltiplos arquivos Excel, caso seja necessário
}

// Função para exportar o resultado para um arquivo Excel
function exportToExcel() {
  const table = document.querySelector('#resultTable table');
  const worksheet = XLSX.utils.table_to_sheet(table);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'formatted_numbers.xlsx');
  // Exporta os resultados para um único arquivo Excel
}

// Função para ativar o link correspondente ao passar o mouse
function activelink() {
  const list = document.querySelectorAll('.list');
  list.forEach((item) => item.classList.remove('active'));
  this.classList.add('active');
}

// Adiciona evento para ativar o link correspondente ao passar o mouse
document.querySelectorAll('.list').forEach((item) =>
  item.addEventListener('mouseover', activelink)
);
