// src/views/notFound.js
export function renderNotFound() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="pageContainer">
      <main class="pageMain">
        <section class="heroCard state--error">
          <h1 class="heroCard__title">404 — Ruta perdida en la niebla</h1>
          <p class="heroCard__desc">
            Incluso con mi sentido del olfato, no pude encontrar la ruta <code>${window.location.pathname}</code>.
          </p>
          <div class="heroCard__actions">
            <a href="/home" class="btnPrimary">Volver al Inicio</a>
            <a href="/chat" class="btnSecondary">Ir al Chat</a>
          </div>
        </section>
      </main>
    </div>
  `;
}