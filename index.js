document.addEventListener('DOMContentLoaded', function() {
  // Carrega o tema salvo no LocalStorage ao carregar a página
  loadSavedTheme();

  const services = document.querySelectorAll('.service');

  services.forEach(service => {
      service.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-10px)';
          this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
      });

      service.addEventListener('mouseout', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      });

      service.addEventListener('click', function() {
          saveServiceInteraction(service.id);
      });
  });

  document.getElementById('menu-button').addEventListener('click', function() {
      document.getElementById('sidebar').style.left = '0';
  });

  document.getElementById('closeBtn').addEventListener('click', function() {
      document.getElementById('sidebar').style.left = '-250px';
  });

  loadSavedInteractions();
});

// Função para alternar entre temas escuro e claro
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark-mode');
  } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeToggle.textContent = '🌞';
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
      themeToggle.textContent = savedTheme === 'dark-mode' ? '🌙' : '🌞';
  } else {
      // Define o modo claro como padrão
      body.classList.add('light-mode');
      themeToggle.textContent = '🌞';
  }
}

function proximo1() {
  window.location.href =  'number_format.html';
}

function proximo2() {
  window.location.href =  'texto_format.html';
}

function proximo3() {
  window.location.href =  'transformar_minutos.html';
}

function proximo4() {
  window.location.href =  'calculadora.html';
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
}

function clearCache() {
  localStorage.clear();
  alert('O cache do navegador foi limpo!');
}
