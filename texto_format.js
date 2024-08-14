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

// Abrir e fechar a sidebar
document.getElementById('menu-button').onclick = function() {
  document.getElementById('sidebar').style.left = '0';
};

document.getElementById('closeBtn').onclick = function() {
  document.getElementById('sidebar').style.left = '-250px';
};

// Função para transformar o texto
function transformText() {
  const editor = document.getElementById('editor').value;
  const format = document.getElementById('formato').value;
  let transformedText;

  switch (format) {
      case 'maiuscula':
          transformedText = editor.toUpperCase();
          break;
      case 'minuscula':
          transformedText = editor.toLowerCase();
          break;
      case 'capitalizar':
          transformedText = editor.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          break;
      case 'remover-espacos':
          transformedText = editor.replace(/\s+/g, '');
          break;
      default:
          transformedText = editor;
          break;
  }

  document.getElementById('outputText').textContent = transformedText;
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
