// Inicialização do Widget VLibras
new window.VLibras.Widget('https://vlibras.gov.br/app');

// Sintetizador de Voz Nativo (Web Speech API)
// Sintetizador de Voz Nativo (Web Speech API) - Versão Otimizada Web/GitHub
// Sintetizador de Voz Nativo (Otimizado para Mobile & GitHub Pages)
const synth = window.speechSynthesis;
let speechQueue = [];
let currentUtteranceIndex = 0;
let isSpeakingFullStory = false;

// Função auxiliar para tocar a fila no celular
function processQueue() {
  if (!isSpeakingFullStory || currentUtteranceIndex >= speechQueue.length) {
    isSpeakingFullStory = false;
    currentUtteranceIndex = 0;
    const btnOuvir = document.getElementById('btn-ouvir-tudo');
    if (btnOuvir) btnOuvir.innerHTML = '🔊 Ouvir História Completa';
    return;
  }

  const textChunk = speechQueue[currentUtteranceIndex];
  if (!textChunk.trim()) {
    currentUtteranceIndex++;
    processQueue();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(textChunk);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.0;

  // Seleção segura de voz PT-BR
  const voices = synth.getVoices();
  const ptVoice = voices.find(v => v.lang && (v.lang.includes('pt') || v.lang.includes('PT')));
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  // Quando terminar a frase atual, passa para a próxima da fila
  utterance.onend = () => {
    currentUtteranceIndex++;
    processQueue();
  };

  // Tratamento de erro no mobile
  utterance.onerror = (e) => {
    console.error('Erro na reprodução de trecho:', e);
    currentUtteranceIndex++;
    processQueue();
  };

  synth.speak(utterance);
}

// Parar o áudio imediatamente
function stopSpeech() {
  isSpeakingFullStory = false;
  speechQueue = [];
  currentUtteranceIndex = 0;
  if (synth) {
    synth.cancel();
  }
  const btnOuvir = document.getElementById('btn-ouvir-tudo');
  if (btnOuvir) btnOuvir.innerHTML = '🔊 Ouvir História Completa';
}

// Ler toda a história do projeto (Compatível com Celular)
function speakFullStory() {
  if (!synth) {
    alert('Seu navegador não suporta leitura em voz alta.');
    return;
  }

  // Cancela áudios anteriores
  stopSpeech();

  // Coleta os textos com segurança
  const elementoResumo = document.getElementById('texto-resumo');
  const resumo = elementoResumo ? elementoResumo.innerText : '';
  
  let fullText = `Apresentação do Projeto FECIBA: Bengala Inteligente e Maquete Sensorial. ${resumo}. `;

  for (let i = 1; i <= 6; i++) {
    const elTitulo = document.getElementById(`card${i}-titulo`);
    const elTexto = document.getElementById(`card${i}-texto`);
    const elImg = document.getElementById(`img-card-${i}`);

    const titulo = elTitulo ? elTitulo.innerText : '';
    const texto = elTexto ? elTexto.innerText : '';
    const imgAlt = (elImg && elImg.alt) ? elImg.alt : '';

    fullText += `Etapa ${i}: ${titulo}. Descrição da imagem: ${imgAlt}. ${texto}. `;
  }

  // DIVIDE O TEXTO EM FRASES CURTAS (Evita que o celular cancele textos longos)
  speechQueue = fullText.split(/(?<=[.?!])\s+/);
  currentUtteranceIndex = 0;
  isSpeakingFullStory = true;

  const btnOuvir = document.getElementById('btn-ouvir-tudo');
  if (btnOuvir) btnOuvir.innerHTML = '🔊 Lendo...';

  // Inicia a fila de áudio imediatamente no toque do usuário
  processQueue();
}

// Ler apenas o card/etapa individual no celular
function speakCardText(cardNumber) {
  if (!synth) return;
  stopSpeech();

  const elTitulo = document.getElementById(`card${cardNumber}-titulo`);
  const elTexto = document.getElementById(`card${cardNumber}-texto`);
  const elImg = document.getElementById(`img-card-${cardNumber}`);

  const titulo = elTitulo ? elTitulo.innerText : '';
  const texto = elTexto ? elTexto.innerText : '';
  const imgAlt = (elImg && elImg.alt) ? elImg.alt : '';

  const textToSpeak = `Etapa ${cardNumber}: ${titulo}. Descrição da imagem: ${imgAlt}. ${texto}`;
  
  speechQueue = textToSpeak.split(/(?<=[.?!])\s+/);
  currentUtteranceIndex = 0;
  isSpeakingFullStory = true;
  processQueue();
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