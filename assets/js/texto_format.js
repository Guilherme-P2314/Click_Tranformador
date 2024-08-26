// Função para alternar entre temas escuro e claro
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  
  // Verifica o tema atual e alterna para o oposto
  if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeToggle.textContent = '🌙'; // Atualiza o ícone para lua
  } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeToggle.textContent = '🌞'; // Atualiza o ícone para sol
  }
  // A mudança de tema altera as variáveis de CSS que controlam cores e estilos
}


// Função para transformar o texto de acordo com o formato selecionado
function transformText() {
  const editor = document.getElementById('editor').value; // Obtém o texto inserido pelo usuário
  const format = document.getElementById('formato').value; // Obtém o formato selecionado pelo usuário
  let transformedText;

  // Aplica a transformação ao texto com base no formato selecionado
  switch (format) {
      case 'maiuscula':
          transformedText = editor.toUpperCase(); // Converte o texto para maiúsculas
          break;
      case 'minuscula':
          transformedText = editor.toLowerCase(); // Converte o texto para minúsculas
          break;
      case 'capitalizar':
          transformedText = editor.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' '); // Capitaliza a primeira letra de cada palavra
          break;
      case 'remover-espacos':
          transformedText = editor.replace(/\s+/g, ''); // Remove todos os espaços do texto
          break;
      default:
          transformedText = editor; // Se nenhum formato for selecionado, mantém o texto original
          break;
  }

  document.getElementById('outputText').textContent = transformedText; 
  // Exibe o texto transformado na área de saída
}

// Seleciona todos os elementos de lista na sidebar
const list = document.querySelectorAll('.list');

// Função para ativar o link do menu correspondente ao item ativo
function activelink(event) {
  // Remove a classe 'active' de todos os itens
  list.forEach((item) => item.classList.remove('active'));
  
  // Adiciona a classe 'active' ao item que acionou o evento
  event.currentTarget.classList.add('active');
}

// Adiciona o event listener para ativar o link ao passar o mouse
list.forEach((item) => item.addEventListener('mouseover', activelink));
