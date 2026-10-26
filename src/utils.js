// src/utils.js

// 1. Validar que el mensaje del usuario no esté vacío ni exceda el límite
export function isValidMessage(text, maxLength = 500) {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= 1 && trimmed.length <= maxLength;
}

// 2. Sanitizar texto para prevenir inyección HTML al renderizar burbujas
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 3. Formatear hora local en formato HH:MM (Función pura testeable)
export function formatTimestamp(date = new Date()) {
  const validDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const hours = String(validDate.getHours()).padStart(2, '0');
  const minutes = String(validDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 4. Agregar un mensaje al historial de forma inmutable (incluye timestamp)
export function appendMessage(history, role, content, timestamp = formatTimestamp()) {
  const safeHistory = Array.isArray(history) ? history : [];
  return [
    ...safeHistory,
    {
      role, // 'user' o 'assistant'
      content: String(content || '').trim(),
      timestamp,
    },
  ];
}

// 5. Recortar el historial a los últimos N mensajes para cuidar tokens
export function getTrimmedHistory(history, maxMessages = 12) {
  if (!Array.isArray(history)) return [];
  return history.slice(-maxMessages);
}

// 6. Mapear el query param ?topic=... de /home a un mensaje inicial sugerido
export function getTopicStarterMessage(topic) {
  const topics = {
    respiracion: '¡Hola Tanjiro! Quiero entrenar mi concentración y disciplina hoy. ¿Por dónde empezamos?',
    nezuko: 'Tanjiro, ¿cómo logras proteger a Nezuko y mantenerte positivo ante tanta dificultad?',
    perseverancia: 'Siento que mi meta es muy difícil y estoy cansado. ¿Qué haces cuando sientes que no puedes más?',
  };
  return topics[topic] ?? '';
}

// 7. Normalizar y validar la respuesta JSON proveniente de /api/chat
export function parseApiResponse(data) {
  if (!data || typeof data !== 'object') {
    return {
      ok: false,
      reply: '',
      error: 'Respuesta inválida del servidor.',
    };
  }

  if (data.error) {
    return {
      ok: false,
      reply: '',
      error: String(data.error),
    };
  }

  const reply = typeof data.reply === 'string' ? data.reply.trim() : '';
  if (!reply) {
    return {
      ok: false,
      reply: '',
      error: 'Tanjiro se quedó sin palabras (respuesta vacía).',
    };
  }

  return {
    ok: true,
    reply,
    error: null,
  };
}