document.addEventListener('DOMContentLoaded', function () {
  // Carrega o tema salvo no LocalStorage ao carregar a página
  loadSavedTheme();

  // Seleciona todos os elementos com a classe 'service'
  const services = document.querySelectorAll('.service');

  // Adiciona efeitos de hover e clique para cada serviço
  services.forEach(service => {
    service.addEventListener('mouseover', function () {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
    });

    service.addEventListener('mouseout', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    });

    service.addEventListener('click', function () {
      saveServiceInteraction(service.id);
    });
  });

  // Carrega interações salvas do usuário
  loadSavedInteractions();
});

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

// Função para carregar o tema salvo do LocalStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');

  if (savedTheme) {
    body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === 'dark-mode' ? '🕳️' : '💡'
  } else {
    // Define o modo claro como padrão
    body.classList.add('light-mode');
    themeToggle.textContent = '💡';
  }
}

// Funções para navegação para diferentes serviços
function proximo1() {
  window.location.href = 'number_format.html';
}

function proximo2() {
  window.location.href = 'texto_format.html';
}

function proximo3() {
  window.location.href = 'transformar_minutos.html';
}

function proximo4() {
  window.location.href = 'calculadora.html';
}

// Função para salvar interações de serviço no LocalStorage
function saveServiceInteraction(serviceId) {
  let interactions = JSON.parse(localStorage.getItem('service-interactions')) || [];
  interactions.push({ serviceId: serviceId, timestamp: new Date().toISOString() });
  localStorage.setItem('service-interactions', JSON.stringify(interactions));
}

// Função para carregar interações salvas
function loadSavedInteractions() {
  const interactions = JSON.parse(localStorage.getItem('service-interactions')) || [];
  interactions.forEach(interaction => {
    const service = document.getElementById(interaction.serviceId);
    if (service) {
      service.style.border = '2px solid var(--primary-color)';
    }
  });
}

// Função para limpar o cache do navegador
function clearCache() {
  localStorage.clear();
  alert('O cache do navegador foi limpo!');
}

// Função para ativar link do menu
const list = document.querySelectorAll('.list');
function activelink() {
  list.forEach((item) => item.classList.remove('active'));
  this.classList.add('active');
}

list.forEach((item) => item.addEventListener('mouseover', activelink));
