// src/views/about.js
export function renderAbout() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="pageContainer">
      <header class="chatHeader">
        <div class="chatHeader__info">
          <span class="chatHeader__avatar" role="img" aria-label="Tanjiro">🌊</span>
          <div>
            <h1 class="chatTitle">Acerca de ChatIAndo</h1>
            <p class="chatSubtitle">Proyecto Integrador M3 • ComicSansCon</p>
          </div>
        </div>
        <nav class="mainNav" aria-label="Navegación principal">
          <a href="/home" class="navLink">Inicio</a>
          <a href="/chat" class="navLink">Chat</a>
          <a href="/about" class="navLink active">Acerca</a>
        </nav>
      </header>

      <main class="pageMain">
        <article class="aboutCard">
          <h2>Sobre el Proyecto</h2>
          <p>
            <strong>ChatIAndo</strong> es una Single Page Application (SPA) construida con HTML5, CSS3 Mobile-First y JavaScript Vanilla, conectada a <strong>Google Gemini AI</strong> mediante Vercel Serverless Functions para proteger las credenciales en el backend.
          </p>

          <h2>¿Por qué Tanjiro Kamado?</h2>
          <p>
            Protagonista de <em>Kimetsu no Yaiba (Demon Slayer)</em>, Tanjiro destaca por su empatía, su respeto incluso hacia sus adversarios y su dominio de la Respiración del Agua y la Danza del Dios del Fuego (<em>Hinokami Kagura</em>).
          </p>

          <div class="heroCard__actions">
            <a href="/chat" class="btnPrimary">Ir al Chat</a>
            <a href="/home" class="btnSecondary">Volver al Inicio</a>
          </div>
        </article>
      </main>
    </div>
  `;
}