// src/views/home.js
export function renderHome() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="pageContainer">
      <header class="chatHeader">
        <div class="chatHeader__info">
          <span class="chatHeader__avatar" role="img" aria-label="Tanjiro">🌊</span>
          <div>
            <h1 class="chatTitle">ChatIAndo</h1>
            <p class="chatSubtitle">Experiencia interactiva • Demon Slayer</p>
          </div>
        </div>
        <nav class="mainNav" aria-label="Navegación principal">
          <a href="/home" class="navLink active">Inicio</a>
          <a href="/chat" class="navLink">Chat</a>
          <a href="/about" class="navLink">Acerca</a>
        </nav>
      </header>

      <main class="pageMain">
        <section class="heroCard">
          <span class="sidebarCard__badge">Cuerpo de Exterminio de Demonios</span>
          <h2 class="heroCard__title">Habla con Tanjiro Kamado</h2>
          <p class="heroCard__desc">
            Un joven cazador de demonios de corazón noble, olfato agudo y una determinación inquebrantable por proteger a su hermana Nezuko.
          </p>

          <div class="topicSection">
            <p class="topicSection__label">✨ Elige un tema para romper el hielo o inicia libremente:</p>
            <div class="topicBadges">
              <a href="/chat?topic=respiracion" class="topicBadge">🌊 Entrenamiento de Respiración</a>
              <a href="/chat?topic=nezuko" class="topicBadge">📦 Historia de Nezuko</a>
              <a href="/chat?topic=perseverancia" class="topicBadge">🔥 Consejos de perseverancia</a>
            </div>
          </div>

          <div class="heroCard__actions">
            <a href="/chat" class="btnPrimary">¡Comenzar a chatear con Tanjiro!</a>
            <a href="/about" class="btnSecondary">Conocer más del proyecto</a>
          </div>
        </section>
      </main>
    </div>
  `;
}