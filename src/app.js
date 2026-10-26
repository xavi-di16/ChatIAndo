// src/app.js
import { renderHome } from './views/home.js';
import { renderChat } from './views/chat.js';
import { renderAbout } from './views/about.js';
import { renderNotFound } from './views/notFound.js';

// 1. Tabla de rutas (mapea pathname a su función de render)
const routes = {
  '/': renderHome,
  '/home': renderHome,
  '/chat': renderChat,
  '/about': renderAbout,
};

// 2. Función central router(): lee la URL actual y renderiza la vista
export function router() {
  const rawPath = window.location.pathname;
  // Normalizar trailing slash excepto en la raíz '/'
  const path = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath;

  const render = routes[path] || renderNotFound;
  render();
}

// 3. Navegación programática: actualiza URL y ejecuta router() manualmente
export function navigateTo(path) {
  if (window.location.pathname + window.location.search === path) {
    return; // Evita duplicar entradas idénticas en el historial
  }
  history.pushState(null, '', path);
  router();
  // Accesibilidad: mover foco al contenedor principal tras cambiar de vista
  document.querySelector('#app')?.focus();
}

// 4. Intercepción selectiva de clicks en enlaces <a>
function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function setupLinkInterception() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Respetar comportamiento nativo en clicks modificados o target="_blank"
    if (isModifiedClick(event) || link.target === '_blank') return;

    // Ignorar anclas y protocolos especiales
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Solo interceptar rutas internas que comiencen con '/'
    if (!href.startsWith('/')) return;

    event.preventDefault();
    const url = new URL(link.href);
    navigateTo(url.pathname + url.search);
  });
}

// 5. Inicialización de la SPA (Orden crítico)
setupLinkInterception();
window.addEventListener('popstate', router);
router();