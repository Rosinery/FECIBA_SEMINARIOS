// Inicialização do Widget VLibras
new window.VLibras.Widget('https://vlibras.gov.br/app');

// Sintetizador de Voz Nativo (Web Speech API)
// Sintetizador de Voz Nativo (Web Speech API) - Versão Otimizada Web/GitHub
// Sintetizador de Voz Nativo (Otimizado para Mobile & GitHub Pages)
// ==========================================================================
// SINTETIZADOR DE VOZ NATIVO (Compatível com Celular, Computador e GitHub)
// ==========================================================================
// ==========================================================================
// SINTETIZADOR DE VOZ NATIVO (Compatível com Celular, Computador e GitHub)
// ==========================================================================
const synth = window.speechSynthesis;
let speechQueue = [];
let currentUtteranceIndex = 0;
let isSpeaking = false;

// Função universal que toca a fila de frases sem cortar
function processQueue() {
  if (!isSpeaking || currentUtteranceIndex >= speechQueue.length) {
    stopSpeech();
    return;
  }

  const textChunk = speechQueue[currentUtteranceIndex];
  if (!textChunk || !textChunk.trim()) {
    currentUtteranceIndex++;
    processQueue();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(textChunk.trim());
  utterance.lang = 'pt-BR';
  utterance.rate = 1.0;

  // Seleção de voz em Português
  const voices = synth.getVoices();
  const ptVoice = voices.find(v => v.lang && (v.lang.includes('pt') || v.lang.includes('PT')));
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  // Avança para a próxima frase da fila quando terminar a atual
  utterance.onend = () => {
    currentUtteranceIndex++;
    processQueue();
  };

  // Prevenção de erro em celulares
  utterance.onerror = (e) => {
    console.error('Erro na fala:', e);
    currentUtteranceIndex++;
    processQueue();
  };

  synth.speak(utterance);
}

// Parar o áudio imediatamente e resetar estado
function stopSpeech() {
  isSpeaking = false;
  speechQueue = [];
  currentUtteranceIndex = 0;
  
  if (synth) {
    synth.cancel();
  }
  
  const btnOuvirTudo = document.getElementById('btn-ouvir-tudo');
  if (btnOuvirTudo) {
    btnOuvirTudo.innerHTML = '🔊 Ouvir ';
  }

  const botoesEtapas = document.querySelectorAll('.btn-ouvir-card');
  botoesEtapas.forEach((btn, index) => {
    btn.innerHTML = `🔊 Ouvir Etapa ${index + 1}`;
  });
}

// 1. LER PÁGINA COMPLETA
// 1. LER PÁGINA COMPLETA (Sem quebras de linha que cortam a frase inicial)
// 1. LER PÁGINA COMPLETA (Com "Rompendo barreiras" no início de tudo)
function speakFullStory() {
  if (!synth) {
    alert('Seu navegador não suporta leitura em voz alta.');
    return;
  }

  stopSpeech();

  const elTituloPrincipal = document.querySelector('h1');
  const elSubtitulo = document.querySelector('.header-subtitle');
  const tituloPrincipal = elTituloPrincipal ? elTituloPrincipal.innerText : '';
  const subtitulo = elSubtitulo ? elSubtitulo.innerText : '';

  const elementoResumo = document.getElementById('texto-resumo');
  const resumo = elementoResumo ? elementoResumo.innerText : '';
  
  // A frase agora vem PRIMEIRO, antes do título principal e do subtítulo
  let fullText = `Rompendo barreiras, buscando acessibilidade. ${tituloPrincipal}. ${subtitulo}. ${resumo}. A seguir, apresentamos as seis etapas do projeto: `;

  for (let i = 1; i <= 6; i++) {
    const elTitulo = document.getElementById(`card${i}-titulo`);
    const elTexto = document.getElementById(`card${i}-texto`);
    const elImg = document.getElementById(`img-card-${i}`) || document.getElementById(`img-card${i}`);

    const titulo = elTitulo ? elTitulo.innerText : '';
    const texto = elTexto ? elTexto.innerText : '';
    const imgAlt = (elImg && elImg.alt) ? elImg.alt : '';

    fullText += `Etapa ${i}: ${titulo}. ${imgAlt ? 'Descrição da imagem: ' + imgAlt + '.' : ''} ${texto}. `;
  }

  // Sanitiza quebras de linha e limpa múltiplos espaços para não devorar a frase no mobile
  const cleanText = fullText.replace(/\s+/g, ' ').trim();
  speechQueue = cleanText.split(/(?<=[.?!])\s+/);
  
  currentUtteranceIndex = 0;
  isSpeaking = true;

  const btnOuvirTudo = document.getElementById('btn-ouvir-tudo');
  if (btnOuvirTudo) {
    btnOuvirTudo.innerHTML = '🔊 Lendo...';
  }

  processQueue();
}

// 2. LER ETAPA INDIVIDUAL (1 a 6)
// 2. LER ETAPA INDIVIDUAL (Compatível com atributos data-title, data-text e data-img)
function speakCardTextFromButton(button) {
  document.getElementById('btn-ouvir-tudo').innerHTML = '🔊 Lendo...';
  if (!synth) {
    alert('Seu navegador não suporta leitura em voz alta.');
    return;
  }

  stopSpeech();
  

  // Pega os IDs diretamente dos atributos data-* do botão que foi clicado
  const idTitulo = button.getAttribute('data-title');
  const idTexto = button.getAttribute('data-text');
  const idImg = button.getAttribute('data-img');

  const elTitulo = idTitulo ? document.getElementById(idTitulo) : null;
  const elTexto = idTexto ? document.getElementById(idTexto) : null;
  const elImg = idImg ? document.getElementById(idImg) : null;

  const titulo = elTitulo ? elTitulo.innerText : '';
  const texto = elTexto ? elTexto.innerText : '';
  const imgAlt = (elImg && elImg.alt) ? elImg.alt : '';

  let textToSpeak = `${titulo}. `;
  if (imgAlt) {
    textToSpeak += `Descrição da imagem: ${imgAlt}. `;
  }
  textToSpeak += `${texto}`;

  // Divide em frases curtas para funcionar perfeitamente no celular e no computador
  speechQueue = textToSpeak.split(/(?<=[.?!])\s+/);
  currentUtteranceIndex = 0;
  isSpeaking = true;

  processQueue();
}

// CONECTA AUTOMATICAMENTE OS BOTÕES DAS ETAPAS AO CLIQUE
document.addEventListener('DOMContentLoaded', () => {
  const botoesEtapas = document.querySelectorAll('.btn-ouvir-card');
  
  botoesEtapas.forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      speakCardTextFromButton(botao);
    });
  });
});

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

let fullText = `Rompendo barreiras, buscando acessibilidade ${resumo}. `;

