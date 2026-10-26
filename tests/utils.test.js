// test/utils.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isValidMessage,
  escapeHtml,
  formatTimestamp,
  appendMessage,
  getTrimmedHistory,
  getTopicStarterMessage,
  parseApiResponse,
} from '../src/utils.js';
import { sendChatRequest } from '../src/chat.js';

describe('1. isValidMessage (Validación de input del usuario)', () => {
  it('debería retornar true para mensajes válidos con contenido', () => {
    expect(isValidMessage('Hola Tanjiro, quiero entrenar')).toBe(true);
  });

  it('debería retornar false para strings vacíos o solo espacios', () => {
    expect(isValidMessage('')).toBe(false);
    expect(isValidMessage('    ')).toBe(false);
  });

  it('debería retornar false si supera el máximo de caracteres o no es string', () => {
    const tooLong = 'a'.repeat(501);
    expect(isValidMessage(tooLong, 500)).toBe(false);
    expect(isValidMessage(null)).toBe(false);
  });
});

describe('2. escapeHtml (Sanitización contra XSS)', () => {
  it('debería escapar etiquetas HTML peligrosas', () => {
    const malicious = '<script>alert("xss")</script>';
    expect(escapeHtml(malicious)).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('debería retornar string vacío si recibe null o undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('3. formatTimestamp (Formateo puro de hora HH:MM)', () => {
  it('debería formatear correctamente una fecha específica con ceros a la izquierda', () => {
    const fixedDate = new Date(2026, 9, 24, 8, 5); // 08:05
    expect(formatTimestamp(fixedDate)).toBe('08:05');
  });
});

describe('4. appendMessage (Inmutabilidad del historial)', () => {
  it('debería agregar un nuevo mensaje sin mutar el array original', () => {
    const initial = [{ role: 'assistant', content: 'Hola', timestamp: '10:00' }];
    const updated = appendMessage(initial, 'user', '  Entrenar hoy  ', '10:01');

    expect(initial).toHaveLength(1);
    expect(updated).toHaveLength(2);
    expect(updated[1]).toEqual({
      role: 'user',
      content: 'Entrenar hoy',
      timestamp: '10:01',
    });
  });
});

describe('5. getTrimmedHistory (Control de ventana de contexto)', () => {
  it('debería conservar únicamente los últimos N mensajes', () => {
    const history = [
      { role: 'user', content: '1' },
      { role: 'assistant', content: '2' },
      { role: 'user', content: '3' },
      { role: 'assistant', content: '4' },
    ];
    const trimmed = getTrimmedHistory(history, 2);
    expect(trimmed).toHaveLength(2);
    expect(trimmed[0].content).toBe('3');
    expect(trimmed[1].content).toBe('4');
  });
});

describe('6. getTopicStarterMessage (Mapeo de insignias de /home)', () => {
  it('debería devolver el mensaje inicial para un tópico conocido y vacío para desconocido', () => {
    expect(getTopicStarterMessage('respiracion')).toContain('concentración');
    expect(getTopicStarterMessage('inexistente')).toBe('');
  });
});

describe('7. parseApiResponse (Transformación y validación de JSON de API)', () => {
  it('debería normalizar una respuesta exitosa de /api/chat', () => {
    const result = parseApiResponse({ reply: '  ¡No te rindas nunca! 🔥  ' });
    expect(result).toEqual({
      ok: true,
      reply: '¡No te rindas nunca! 🔥',
      error: null,
    });
  });

  it('debería detectar errores explícitos o respuestas vacías del servidor', () => {
    const errorRes = parseApiResponse({ error: 'Límite 429 alcanzado' });
    expect(errorRes.ok).toBe(false);
    expect(errorRes.error).toBe('Límite 429 alcanzado');

    const emptyRes = parseApiResponse({ reply: '   ' });
    expect(emptyRes.ok).toBe(false);
    expect(emptyRes.error).toContain('respuesta vacía');
  });
});

describe('8. sendChatRequest (Mocking de fetch hacia /api/chat)', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('debería enviar petición POST con el historial limpio y retornar reply en 200 OK', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ reply: '¡Respira profundo y sigue adelante!' }),
    });

    const sampleHistory = [
      { role: 'user', content: 'Hola Tanjiro', timestamp: '12:00' },
    ];

    const reply = await sendChatRequest(sampleHistory);

    expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hola Tanjiro' }],
      }),
    });
    expect(reply).toBe('¡Respira profundo y sigue adelante!');
  });

  it('debería lanzar un Error cuando response.ok es false (ej. HTTP 429 o 500)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Demasiados entrenamientos seguidos (429)' }),
    });

    await expect(
      sendChatRequest([{ role: 'user', content: 'Hola' }])
    ).rejects.toThrow('Demasiados entrenamientos seguidos (429)');
  });
});