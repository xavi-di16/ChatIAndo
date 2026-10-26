# 🌊🔥 ChatIAndo con Tanjiro Kamado — Trainer de Vida (M3 - ComicSansCon)

Single Page Application (SPA) responsive construida con HTML5, CSS3 Mobile-First y JavaScript Vanilla que permite conversar en tiempo real con **Tanjiro Kamado** (*Demon Slayer / Kimetsu no Yaiba*), potenciada por **Google Gemini AI** y asegurada mediante **Vercel Serverless Functions**.

🔗 **Demo en Producción (Vercel):** `[Pegar aquí tu URL https://tu-proyecto.vercel.app]`

---

## 🗡️ Sobre el Personaje Elegido: Tanjiro Kamado (Trainer de Vida)
En esta experiencia interactiva, **Tanjiro Kamado** actúa como tu mentor personal de disciplina, estudio y perseverancia. Manteniendo su empatía característica, su sentido del olfato agudo, el amor protector hacia su hermana Nezuko y las enseñanzas de la *Respiración de Concentración Total* y la *Danza del Dios del Fuego (Hinokami Kagura)*, Tanjiro guía al usuario con respuestas concisas (3-4 oraciones) cerrando siempre con un micro-reto práctico, sin salirse jamás de su contexto de la era Taisho.

---

## ✨ Características Principales y Extra Credit
- **Diseño Responsive Mobile-First (320px → 768px → 1024px):** Layout Flexbox con scroll interno aislado en el panel de mensajes y patrón híbrido CSS Grid en Desktop con tarjeta lateral (*Ficha de Trainer*).
- **Enrutamiento SPA Nativo (History API):** Navegación fluida sin recarga entre `/home`, `/chat`, `/about` y vista `404` de fallback usando `history.pushState`, `popstate` e intercepción selectiva de enlaces.
- **Arquitectura Segura (Backend Proxy):** La clave `GEMINI_API_KEY` vive exclusivamente en el entorno del servidor (`process.env.GEMINI_API_KEY`) dentro de `api/chat.js`.
- **Efectos Elementales CSS (Bonus 1):** Animación de *Respiración del Agua* alrededor del indicador de carga mientras Tanjiro piensa, y estallido ígneo (*Hinokami Kagura*) al aparecer cada respuesta nueva.
- **UX Avanzada y Persistencia (Bonus 2):** Timestamps locales (`HH:MM`), botón para copiar respuestas al portapapeles (`navigator.clipboard`), manejo de errores accesible (`role="alert"`) con botón de reintento, y persistencia en `localStorage` con botón de reinicio de sesión.

---

## 🚀 Requisitos y Ejecución Local

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd chatiando-tanjiro
   npm install

2. **Configurar las variables de entorno:**
Copia el archivo .env.example a un nuevo archivo .env en la raíz:
    ```bash
    cp .env.example .env

3. **Edita .env y coloca tu clave real generada en Google AI Studio:**
    ```bash
    GEMINI_API_KEY=tu_clave_real_de_gemini

4. **Levantar el entorno de desarrollo completo (Frontend + Serverless Function):**
    ```bash
    npx vercel dev
    
Abre http://localhost:3000 en tu navegador.

5. **🧪 Ejecución de Tests Unitarios (Vitest)**
El proyecto cuenta con una suite de tests unitarios en test/utils.test.js que valida funciones puras (validación, sanitización XSS, formateo de hora, inmutabilidad de historial, parseo de API) y mockea fetch para testear sendChatRequest sin depender de la red ni consumir tokens:

npm test
(Para ejecutar una sola corrida en terminal sin modo watch: npx vitest run).