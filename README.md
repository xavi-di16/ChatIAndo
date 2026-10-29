# 🌊🔥 ChatIAndo con Tanjiro Kamado — Trainer de Vida (M3 - ComicSansCon)

Single Page Application (SPA) responsive construida con HTML5, CSS3 Mobile-First y JavaScript Vanilla que permite conversar en tiempo real con **Tanjiro Kamado** (*Demon Slayer / Kimetsu no Yaiba*), potenciada por **Google Gemini AI** y asegurada mediante **Vercel Serverless Functions**.

🔗 **Demo en Producción (Vercel):** [https://chatiando-tanjiro.vercel.app/](https://chatiando-tanjiro.vercel.app/)  
🎬 **Demostración en Video del Proyecto:** [Ver video de uso en el repositorio](./chatiando.mp4)

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
   git clone https://github.com/xavi-di16/ChatIAndo.git
   cd chatiando-tanjiro
   npm install
   ```
2. **Configurar las variables de entorno:**
   Copia el archivo `.env.example` a un nuevo archivo `.env` en la raíz:
   ```bash
   cp .env.example .env
   ```
3. **Edita el archivo `.env` y coloca tu clave real generada en Google AI Studio:**
   ```env
   GEMINI_API_KEY=tu_clave_real_de_gemini
   ```
4. **Levantar el entorno de desarrollo completo (Frontend + Serverless Function):**
   ```bash
   npx vercel dev
   ```
   Abre `http://localhost:3000` en tu navegador.

---

## 🧪 Ejecución de Tests Unitarios (Vitest)
El proyecto cuenta con una suite robusta de tests unitarios en `tests/utils.test.js` que valida funciones puras (validación, sanitización XSS, formateo de hora, inmutabilidad de historial, parseo de API) y mockea `fetch` para testear `sendChatRequest` sin depender de la red ni consumir tokens:
```bash
npm test
```
*(Para ejecutar una sola corrida en terminal sin modo watch: `npx vitest run`).*

---

## ☁️ Cómo Desplegar a Producción en Vercel
1. Sube el repositorio a GitHub verificando previamente que `.env`, `node_modules/` y `.vercel/` estén incluidos en `.gitignore`.
2. Importa el repositorio en [Vercel](https://vercel.com) o ejecuta `npx vercel` desde la terminal en la raíz del proyecto.
3. Configura la variable de entorno en el servidor de Vercel (**Settings → Environment Variables**) agregando `GEMINI_API_KEY` para los entornos *Production*, *Preview* y *Development*.
4. Despliega a producción ejecutando:
   ```bash
   npx vercel --prod
   ```

---

## 📸 Capturas de Pantalla y Demostración
- **Demostración en Video:** Puedes revisar el archivo `chatiando.mp4` adjunto en la raíz del repositorio para ver el flujo completo de navegación SPA, interacciones con el chat y los estados visuales en funcionamiento.
- **Vista Mobile (320px):** Layout adaptado con menú superior accesible y burbujas optimizadas.
- **Vista Desktop con Ficha Lateral (1024px+):** Distribución en rejilla Grid mostrando la Ficha de Trainer de Tanjiro junto al panel conversacional.

---

## 🤖 Registro del Uso de AI en el Proyecto (AI Prompting Log)

Este documento registra el uso estratégico de Inteligencia Artificial como *Pair Programmer* y asistente técnico durante el diseño, desarrollo y depuración de **ChatIAndo**, aplicando rigurosamente la estructura de prompting avanzada del Módulo 3 (**Contexto → Objetivo → Restricciones → Evidencia → Formato de salida → Criterios de éxito**).

### 📱 Caso Técnico 1: Diseño Responsive Mobile-First y Aislamiento de Scroll en CSS3
- **Contexto del Problema:** Al maquetar la vista de chat en dispositivos móviles pequeños (320px) y simular la apertura del teclado virtual mediante Chrome DevTools Device Mode, el contenedor del chat colapsaba y la barra de entrada de mensajes (`.chatComposer`) quedaba oculta o desplazada fuera del viewport. Además, el scroll afectaba a toda la página en lugar de limitarse exclusivamente al panel de mensajes (`.chatMessages`).
- **Prompt Estructurado Utilizado:**
  > *Contexto:* Estoy construyendo una SPA de chat en JavaScript Vanilla y CSS3 puro con enfoque estricto Mobile-First (desde 320px) para ComicSansCon. 
  > *Objetivo:* Lograr un layout vertical de altura fija (`100dvh`) donde el header y el composer permanezcan estáticos en su posición, mientras que el contenedor central (`#chat-messages`) gestione un scroll interno aislado de manera fluida y sin desbordes horizontales.
  > *Restricciones:* No usar librerías de UI (Bootstrap/Tailwind). Mantener Flexbox y unidades relativas (`rem`, `%`, `dvh`).
  > *Evidencia:* El body scrolleaba completo al acumularse burbujas de texto y el input desaparecía al aparecer el teclado virtual en mobile.
  > *Formato:* Solución en CSS puro con propiedades exactas para el contenedor y los hijos flexibles.
- **Solución Aplicada y Verificada:**
  - Se configuró la raíz con `height: 100dvh` (con fallback a `100vh`) y el layout principal con un modelo Flexbox estricto.
  - Al panel de mensajes se le aplicó `flex: 1`, `min-height: 0` y `overflow-y: auto`, permitiendo que el navegador calcule correctamente el espacio disponible y aísle el scroll de forma nativa.
  - Verificado empíricamente en emuladores de dispositivos móviles y tablets (320px, 768px y 1024px) en Chrome DevTools.

### ⚡ Caso Técnico 2: Depuración de Lógica Asíncrona en Fetch API y Estados de UI
- **Contexto del Problema:** Al integrar la comunicación con la Vercel Serverless Function (`/api/chat`), la aplicación implementaba un bloque `try/catch/finally` estándar. Sin embargo, cuando la API de Gemini respondía con un código de error HTTP controlado (como un Rate Limit `429` o un error de servidor `500`), la aplicación procesaba el JSON erróneamente como un éxito en lugar de lanzar una excepción, dejando la interfaz en un estado confuso o congelada en el indicador de carga.
- **Prompt Estructurado Utilizado:**
  > *Contexto:* Desarrollando una SPA en JS Vanilla con llamadas a `/api/chat` usando `async/await`. 
  > *Objetivo:* Asegurar que cualquier respuesta HTTP fallida (`4xx` o `5xx`) sea detectada inmediatamente por el flujo asíncrono para apagar el estado de carga (`isLoading = false`), limpiar inputs y renderizar un cuadro de error accesible con un botón de reintento.
  > *Evidencia:* `fetch()` no genera un rechazo (`catch`) ante códigos HTTP como 429 o 500 por sí solo; el bloque `response.ok` debía evaluarse explícitamente.
  > *Formato:* Snippet de refactorización mínima para `sendChatRequest()` en `src/chat.js` y manejo del estado visual en la UI.
- **Solución Aplicada y Verificada:**
  - Se añadió la validación explícita `if (!response.ok)` analizando el cuerpo JSON recibido antes de parsear la respuesta del asistente.
  - Se estructuró un bloque de manejo de errores con atributos de accesibilidad (`role="alert"`, `aria-live="polite"`) y un botón de reintento (`#retry-btn`) que reutiliza el historial sin obligar al usuario a reescribir su mensaje.
  - Verificado mediante la simulación de red en estado "Offline" y simulación de códigos de error de servidor en la pestaña *Network* de DevTools.

### 🤖 Caso Técnico 3: Optimización del System Prompt y Manejo de Respuestas Truncadas en el LLM
- **Contexto del Problema:** Durante las primeras pruebas de integración con el SDK `@google/generative-ai` y el modelo `gemini-2.5-flash`, las respuestas emitidas por el personaje (Tanjiro Kamado) se cortaban abruptamente a mitad de oración debido a un límite restrictivo en los tokens de salida (`maxOutputTokens`), lo que rompía la inmersión del rol y la brevedad exigida para un chat.
- **Prompt Estructurado Utilizado:**
  > *Contexto:* Integración de Google Gemini AI mediante una Serverless Function en Node.js con un System Prompt estricto que define la personalidad de Tanjiro Kamado (Trainer de Vida de la era Taisho).
  > *Objetivo:* Evitar que las respuestas se trunquen a mitad de frase, manteniendo estrictamente el límite de longitud (3 a 4 oraciones cortas con cierre en pregunta o micro-reto) mediante una distribución correcta entre parámetros de generación e instrucciones del sistema.
  > *Evidencia:* Respuestas cortadas con código de parada `max_tokens` al usar un techo de 220 tokens de salida combinados con instrucciones de formato dispersas.
  > *Formato:* Ajuste de la configuración del modelo en `api/chat.js` y reestructuración del contrato de system prompt.
- **Solución Aplicada y Verificada:**
  - Se amplió el umbral de seguridad de `maxOutputTokens` a un rango holgado (`1000`) en la configuración de la Serverless Function (`api/chat.js`), delegando la restricción de brevedad y formato conversacional directamente al `TANJIRO_SYSTEM_PROMPT`.
  - Se implementó la función pura de parseo y validación `parseApiResponse()` para verificar que el texto retorne limpio antes de inyectarlo en el DOM.
  - Verificado mediante pruebas de estrés conversacionales en el entorno de desarrollo local con `vercel dev`.
