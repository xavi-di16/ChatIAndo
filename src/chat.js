// src/chat.js
import {
  isValidMessage,
  escapeHtml,
  formatTimestamp,
  appendMessage,
  getTrimmedHistory,
  getTopicStarterMessage,
  parseApiResponse,
} from './utils.js';

const STORAGE_KEY = 'chatiando_tanjiro_history';

const INITIAL_GREETING =
  '¡Hola! Soy Tanjiro Kamado 🌊🔥. Además de cazador de demonios, hoy soy tu compañero de entrenamiento para la vida. Así como entrené la Respiración de Concentración Total, ¡estoy aquí para ayudarte a no rendirte nunca con tus metas, hábitos o estudios! ¿Qué objetivo vamos a conquistar juntos hoy?';

function createInitialHistory() {
  return [
    {
      role: 'assistant',
      content: INITIAL_GREETING,
      timestamp: formatTimestamp(),
    },
  ];
}

// Leer historial guardado en localStorage o devolver el saludo inicial
function loadHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialHistory();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('No se pudo leer localStorage:', err);
  }
  return createInitialHistory();
}

// Guardar historial en localStorage
function saveHistoryToStorage(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage:', err);
  }
}

let chatHistory = loadHistoryFromStorage();
let isLoading = false;
let errorMessage = null;
let animateLatestReply = false;

function scrollToBottom(container) {
  if (!container) return;
  container.scrollTop = container.scrollHeight;
}

// Actualizar visibilidad del indicador "💾 Sesión guardada" y botón Reiniciar
function updateStorageIndicator() {
  const badge = document.querySelector('#storage-badge');
  const clearBtn = document.querySelector('#clear-chat-btn');
  // Consideramos que hay sesión guardada cuando hay más que el saludo inicial
  const hasSavedConversation = chatHistory.length > 1;

  if (badge) {
    badge.classList.toggle('hidden', !hasSavedConversation);
  }
  if (clearBtn) {
    clearBtn.disabled = !hasSavedConversation || isLoading;
  }
}

export async function sendChatRequest(messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Enviamos solo role y content limpios al backend
      messages: getTrimmedHistory(messages, 12).map(({ role, content }) => ({
        role,
        content,
      })),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || `Error del servidor (HTTP ${response.status})`
    );
  }

  const parsed = parseApiResponse(data);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }

  return parsed.reply;
}

export function renderMessages(container) {
  if (!container) return;

  const lastIndex = chatHistory.length - 1;

  const bubblesHtml = chatHistory
    .map((msg, index) => {
      const isUser = msg.role === 'user';
      const modifier = isUser ? 'message--user' : 'message--character';
      const isNewCharacterReply =
        !isUser && index === lastIndex && animateLatestReply;
      const fireClass = isNewCharacterReply ? 'message--fire-burst' : '';
      const timeLabel = escapeHtml(msg.timestamp || formatTimestamp());

      // Botón para copiar solo en los mensajes de Tanjiro
      const copyButtonHtml = !isUser
        ? `<button
             type="button"
             class="message__copyBtn"
             data-message-index="${index}"
             aria-label="Copiar respuesta de Tanjiro"
             title="Copiar mensaje"
           >
             📋 Copiar
           </button>`
        : '';

      return `
        <div class="message ${modifier} ${fireClass}">
          <div class="message__text">${escapeHtml(msg.content)}</div>
          <div class="message__meta">
            <time class="message__time">${timeLabel}</time>
            ${copyButtonHtml}
          </div>
        </div>
      `;
    })
    .join('');

  if (animateLatestReply) {
    animateLatestReply = false;
  }

  const loadingHtml = isLoading
    ? `<div class="message message--character state--loading water-breathing" id="typing-indicator">
         <span class="water-breathing__waves" aria-hidden="true">
           <span></span><span></span><span></span>
         </span>
         <span class="water-breathing__text">
           Tanjiro está concentrando su respiración para responderte...
         </span>
       </div>`
    : '';

  const errorHtml = errorMessage
    ? `<div class="state--error chatErrorBox" role="alert">
         <p class="chatErrorBox__text">⚠️ ${escapeHtml(errorMessage)}</p>
         <button type="button" class="stateRetry" id="retry-btn">
           🔄 Reintentar último mensaje
         </button>
       </div>`
    : '';

  container.innerHTML = bubblesHtml + loadingHtml + errorHtml;
  updateStorageIndicator();
  scrollToBottom(container);
}

export function initChat() {
  const messagesContainer = document.querySelector('#chat-messages');
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#chat-input');
  const sendBtn = document.querySelector('#chat-send');
  const clearBtn = document.querySelector('#clear-chat-btn');

  if (!messagesContainer || !form || !input || !sendBtn) return;

  async function requestAssistantReply() {
    if (isLoading) return;

    isLoading = true;
    errorMessage = null;
    animateLatestReply = false;
    sendBtn.disabled = true;
    input.disabled = true;
    renderMessages(messagesContainer);

    try {
      const reply = await sendChatRequest(chatHistory);
      chatHistory = appendMessage(chatHistory, 'assistant', reply);
      saveHistoryToStorage(chatHistory);
      animateLatestReply = true;
    } catch (error) {
      console.error('Error al comunicarse con Tanjiro:', error);
      errorMessage =
        error.message ||
        'No se pudo conectar con Tanjiro. Verifica tu conexión e intenta de nuevo.';
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.disabled = false;
      renderMessages(messagesContainer);
      input.focus();
    }
  }

  renderMessages(messagesContainer);

  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');
  if (topic) {
    const starterText = getTopicStarterMessage(topic);
    if (starterText) {
      input.value = starterText;
      input.focus();
    }
    window.history.replaceState(null, '', '/chat');
  }

  // Enviar mensaje
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isLoading) return;

    const userText = input.value;
    if (!isValidMessage(userText)) return;

    chatHistory = appendMessage(chatHistory, 'user', userText);
    saveHistoryToStorage(chatHistory);
    input.value = '';

    await requestAssistantReply();
  });

  // Limpiar historial y localStorage (Botón Reiniciar en Header)
  clearBtn?.addEventListener('click', () => {
    if (isLoading) return;
    localStorage.removeItem(STORAGE_KEY);
    chatHistory = createInitialHistory();
    errorMessage = null;
    animateLatestReply = false;
    renderMessages(messagesContainer);
    input.focus();
  });

  // Delegación en #chat-messages: Botón Reintentar + Botón Copiar
  messagesContainer.addEventListener('click', async (event) => {
    // Caso 1: Botón Reintentar
    const retryBtn = event.target.closest('#retry-btn');
    if (retryBtn && !isLoading) {
      await requestAssistantReply();
      return;
    }

    // Caso 2: Botón Copiar mensaje de Tanjiro
    const copyBtn = event.target.closest('.message__copyBtn');
    if (copyBtn) {
      const index = Number(copyBtn.dataset.messageIndex);
      const targetMsg = chatHistory[index];
      if (!targetMsg?.content) return;

      try {
        await navigator.clipboard.writeText(targetMsg.content);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ ¡Copiado!';
        copyBtn.classList.add('message__copyBtn--copied');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('message__copyBtn--copied');
        }, 1500);
      } catch (err) {
        console.error('No se pudo copiar al portapapeles:', err);
      }
    }
  });
}