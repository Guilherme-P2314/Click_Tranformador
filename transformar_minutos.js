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

function showInputField() {
  const timeUnit = document.getElementById('timeUnit').value;
  const timeInputField = document.getElementById('timeInputField');
  if (timeUnit) {
      timeInputField.classList.remove('hidden');
  } else {
      timeInputField.classList.add('hidden');
  }
}

function convertTime() {
  const timeValue = document.getElementById('timeValue').value;
  const timeUnit = document.getElementById('timeUnit').value;
  let result;

  switch (timeUnit) {
      case 'hours':
          result = `${timeValue * 60} minutos`;
          break;
      case 'days':
          result = `${timeValue * 1440} minutos`;
          break;
      case 'weeks':
          result = `${timeValue * 10080} minutos`;
          break;
      case 'months':
          result = `${timeValue * 43800} minutos`;
          break;
      case 'years':
          result = `${timeValue * 525600} minutos`;
          break;
      default:
          result = 'Por favor, selecione uma unidade de tempo válida.';
  }

  document.getElementById('convertedTime').textContent = result;
}

function copyResult() {
  const result = document.getElementById('convertedTime').textContent;
  navigator.clipboard.writeText(result).then(() => {
      alert('Resultado copiado para a área de transferência!');
  }).catch(err => {
      alert('Erro ao copiar resultado: ', err);
  });
}

function clearResult() {
  document.getElementById('convertedTime').textContent = '';
  document.getElementById('timeValue').value = '';
  document.getElementById('timeUnit').value = '';
  document.getElementById('timeInputField').classList.add('hidden');
}

document.getElementById('menu-button').addEventListener('click', function () {
  document.getElementById('sidebar').style.left = '0';
});

document.getElementById('closeBtn').addEventListener('click', function () {
  document.getElementById('sidebar').style.left = '-250px';
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
