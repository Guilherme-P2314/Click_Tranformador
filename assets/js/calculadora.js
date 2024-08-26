// Função para alternar entre temas escuro e claro
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggle.textContent = '🕳️';
    localStorage.setItem('theme', 'dark-mode');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggle.textContent = '💡';
    localStorage.setItem('theme', 'light-mode');
  }
}

// Variável para armazenar o histórico de cálculos
let history = [];

// Adiciona valores ao display da calculadora
function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

// Limpa o display da calculadora
function clearDisplay() {
  document.getElementById('display').value = '';
}

// Apaga o último caractere do display
function deleteLast() {
  const display = document.getElementById('display');
  display.value = display.value.slice(0, -1);
}

// Realiza o cálculo com o valor no display, incluindo a regra de porcentagem
function calculate() {
  const display = document.getElementById('display');
  try {
    let expression = display.value;

    // Implementação de porcentagem
    if (expression.includes('%')) {
      expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    }

    // Avalia a expressão e armazena o resultado no histórico
    const result = eval(expression);
    history.push(expression + ' = ' + result);
    display.value = result;
    saveHistory();
    showHistory();
  } catch (error) {
    display.value = 'Erro';
  }
}

// Exibe o histórico de cálculos
function showHistory() {
  document.querySelector('.history').classList.remove('hidden');
  document.getElementById('historyContent').textContent = history.join('\n');
}

// Limpa o histórico de cálculos
function clearHistory() {
  history = [];
  document.getElementById('historyContent').textContent = '';
  saveHistory();
}

// Salva o histórico no localStorage
function saveHistory() {
  localStorage.setItem('calcHistory', JSON.stringify(history));
}

// Carrega o histórico do localStorage ao iniciar a página
function loadHistory() {
  const storedHistory = localStorage.getItem('calcHistory');
  if (storedHistory) {
    history = JSON.parse(storedHistory);
    showHistory();
  }
}

// Carrega o histórico e o tema salvo ao carregar a página
window.onload = function() {
  loadHistory();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = savedTheme === 'dark-mode' ? '🕳️' : '💡';
  }
};


// Função para marcar o link ativo no menu
function activelink() {
  const list = document.querySelectorAll('.list');
  list.forEach((item) => item.classList.remove('active'));
  this.classList.add('active');
}

// Adiciona evento para ativar o link correspondente ao passar o mouse
document.querySelectorAll('.list').forEach((item) =>
  item.addEventListener('mouseover', activelink)
);