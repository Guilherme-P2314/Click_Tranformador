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

let history = [];

// Adiciona valores ao display
function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

// Limpa o display
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

// Configura os eventos de abertura e fechamento do menu lateral
window.onload = loadHistory;

document.getElementById('menu-button').addEventListener('click', function () {
  document.getElementById('sidebar').style.left = '0';
});

document.getElementById('closeBtn').addEventListener('click', function () {
  document.getElementById('sidebar').style.left = '-300px';
});
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
