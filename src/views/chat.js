// src/views/chat.js
import { initChat } from '../chat.js';

export function renderChat() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="chatLayout">
      <div class="chatApp">
        <header class="chatHeader">
          <div class="chatHeader__info">
            <span class="chatHeader__avatar" role="img" aria-label="Tanjiro">🌊</span>
            <div>
              <h1 class="chatTitle">Tanjiro Kamado</h1>
              <p class="chatSubtitle">Trainer de Vida & Cazador • En línea</p>
            </div>
          </div>

          <div class="chatHeader__controls">
            <div class="storageControls">
              <span id="storage-badge" class="storageBadge hidden" title="Tu conversación está guardada en este navegador">
                💾 Sesión guardada
              </span>
              <button
                type="button"
                id="clear-chat-btn"
                class="btnClearChat"
                title="Borrar historial y reiniciar entrenamiento"
              >
                🗑️ Reiniciar
              </button>
            </div>

            <nav class="mainNav" aria-label="Navegación principal">
              <a href="/home" class="navLink">Inicio</a>
              <a href="/chat" class="navLink active">Chat</a>
              <a href="/about" class="navLink">Acerca</a>
            </nav>
          </div>
        </header>

        <main class="chatMessages" id="chat-messages" aria-label="Mensajes de la conversación" aria-live="polite">
          <!-- El saludo inicial de Tanjiro y el historial se renderizan desde src/chat.js -->
        </main>

        <form class="chatComposer" id="chat-form">
          <input
            class="chatInput"
            id="chat-input"
            type="text"
            maxlength="500"
            placeholder="Cuéntale tu meta o desafío a Tanjiro..."
            aria-label="Escribe tu mensaje"
            autocomplete="off"
          />
          <button class="chatSend" id="chat-send" type="submit">Enviar</button>
        </form>
      </div>

      <aside class="characterSidebar" aria-label="Ficha del personaje">
        <div class="sidebarCard">
          <div class="sidebarCard__header">
            <span class="sidebarCard__badge">Mentor de Perseverancia</span>
            <h2 class="sidebarCard__title">Ficha de Trainer</h2>
          </div>
          <ul class="sidebarStats">
            <li><strong>Especialidad:</strong> Disciplina y Resiliencia 🔥</li>
            <li><strong>Método:</strong> Respiración de Concentración Total</li>
            <li><strong>Filosofía:</strong> Dar un paso más cada día</li>
            <li><strong>Compañera:</strong> Nezuko (apoyo incondicional 📦)</li>
            <li><strong>Superpoder:</strong> Empatía absoluta</li>
          </ul>
          <p class="sidebarQuote">
            "¡No importa cuántas veces caigas, yo te ayudaré a levantarte hasta que domines tu propia respiración!"
          </p>
        </div>
      </aside>
    </div>
  `;

  initChat();
}