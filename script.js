// Inicialização do Widget VLibras
new window.VLibras.Widget('https://vlibras.gov.br/app');

// Sintetizador de Voz Nativo (Web Speech API)
// Sintetizador de Voz Nativo (Web Speech API) - Versão Otimizada Web/GitHub
const synth = window.speechSynthesis;

function speakText(text) {
  if (!synth) {
    alert('Seu navegador não suporta a funcionalidade de leitura em voz alta.');
    return;
  }
  
  // Cancela qualquer fala anterior antes de iniciar
  synth.cancel();

  // Pequeno timeout para garantir que o cancelamento anterior foi processado pelo navegador
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Tenta selecionar uma voz em português disponível no sistema
    const voices = synth.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes('pt') || voice.lang.includes('PT'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    synth.speak(utterance);
  }, 50);
}

// Parar o áudio imediatamente
function stopSpeech() {
  if (synth) {
    synth.cancel();
  }
}

// Ler toda a história do projeto (Versão Segura para GitHub Pages)
function speakFullStory() {
  const elementoResumo = document.getElementById('texto-resumo');
  const resumo = elementoResumo ? elementoResumo.innerText : '';
  
  let fullContent = `Apresentação do Projeto FECIBA: Bengala Inteligente e Maquete Sensorial. ${resumo}. A seguir, apresentamos as seis etapas do projeto: `;

  for (let i = 1; i <= 6; i++) {
    const elTitulo = document.getElementById(`card${i}-titulo`);
    const elTexto = document.getElementById(`card${i}-texto`);
    const elImg = document.getElementById(`img-card-${i}`);

    const titulo = elTitulo ? elTitulo.innerText : '';
    const texto = elTexto ? elTexto.innerText : '';
    const imgAlt = (elImg && elImg.alt) ? elImg.alt : '';

    fullContent += ` Etapa ${i}: ${titulo}. Descrição da imagem: ${imgAlt}. História: ${texto}. `;
  }
  
  speakText(fullContent);
}

function speakCard(titleId, textId, imgId) {
  const titulo = document.getElementById(titleId).innerText;
  const texto = document.getElementById(textId).innerText;
  const imgAlt = document.getElementById(imgId).alt;
  const content = `${titulo}. Descrição da foto: ${imgAlt}. ${texto}`;
  speakText(content);
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
}

let currentFontSize = 100;

function changeFontSize(delta) {
  // Aumenta ou diminui de 10 em 10% (limite entre 80% e 160%)
  currentFontSize += delta * 10;
  if (currentFontSize < 80) currentFontSize = 80;
  if (currentFontSize > 160) currentFontSize = 160;

  // Seleciona os contêineres principais da página
  const main = document.getElementById('conteudo-principal');
  const header = document.querySelector('header');
  
  // Aplica o tamanho percentual
  if (main) main.style.fontSize = `${currentFontSize}%`;
  if (header) header.style.fontSize = `${currentFontSize}%`;
}

function handleImagePreview(event) {
  const file = event.target.files[0];
  const targetImgId = event.target.getAttribute('data-target');
  
  if (file && targetImgId) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(targetImgId);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-alto-contraste').addEventListener('click', toggleHighContrast);
  document.getElementById('btn-aumentar-fonte').addEventListener('click', () => changeFontSize(1));
  document.getElementById('btn-diminuir-fonte').addEventListener('click', () => changeFontSize(-1));
  document.getElementById('btn-ouvir-tudo').addEventListener('click', speakFullStory);
  document.getElementById('btn-parar-audio').addEventListener('click', stopSpeech);

  const btnCards = document.querySelectorAll('.btn-ouvir-card');
  btnCards.forEach(btn => {
    btn.addEventListener('click', () => {
      const titleId = btn.getAttribute('data-title');
      const textId = btn.getAttribute('data-text');
      const imgId = btn.getAttribute('data-img');
      speakCard(titleId, textId, imgId);
    });
  });

  const photoInputs = document.querySelectorAll('.input-foto');
  photoInputs.forEach(input => {
    input.addEventListener('change', handleImagePreview);
  });
});