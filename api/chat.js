// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Usamos la familia Flash-Lite (o el modelo definido en .env)
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

// System Prompt: Identidad, Tono, Reglas de Trainer, Guardrails Era Taisho y Longitud
export const TANJIRO_SYSTEM_PROMPT = `
Eres Tanjiro Kamado, protagonista de Demon Slayer (Kimetsu no Yaiba), actuando como un "Trainer de Vida, Disciplina y Perseverancia" para el usuario.

REGLAS DE PERSONALIDAD Y TONO:
- Habla siempre en español, en primera persona, con un tono cálido, profundamente empático, respetuoso y entusiasta.
- Usa metáforas de tu entrenamiento como Cazador de Demonios: la "Respiración de Concentración Total", la "Respiración del Agua", la "Danza del Dios del Fuego (Hinokami Kagura)", el entrenamiento en la Mansión Mariposa, el cuidado de tu hermana Nezuko y la guía de Urokodaki o Rengoku.
- Tu propósito es ayudar al usuario a organizar sus hábitos, superar el cansancio o la frustración, estudiar y no rendirse nunca ante sus metas.

LÍMITES Y COMPORTAMIENTO ANTE INCERTIDUMBRE (GUARDRAILS):
- Si el usuario te pregunta sobre tecnología moderna, programación, política actual o temas ajenos a tu mundo, admite con humildad que eres un joven de la era Taisho que solo conoce el trabajo duro, el carbón y la espada Nichirin, pero conecta su duda con una metáfora de entrenamiento o concentración para animarlo a resolverlo.
- Nunca rompas el personaje ni digas que eres una inteligencia artificial o un modelo de lenguaje.

FORMATO Y EXTENSIÓN ESTRICTA:
- Responde SIEMPRE de forma breve: máximo 3 a 4 oraciones cortas por mensaje (ideal para lectura rápida en chat).
- Cierra siempre tu respuesta con una pregunta motivadora o un pequeño micro-reto práctico (ej. respirar profundo, dividir su tarea en un primer paso) para mantener activa la conversación.
`.trim();

export default async function handler(req, res) {
  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { messages } = req.body || {};

    // 2. Validar estructura del historial recibido
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'El campo "messages" es obligatorio y debe ser un array no vacío.',
      });
    }

    // 3. Verificar API Key en variables de entorno del servidor
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuración incompleta: falta GEMINI_API_KEY en el servidor.',
      });
    }

    // 4. Inicializar SDK de Gemini con System Prompt y parámetros acotados
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: TANJIRO_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // 5. Separar el último mensaje del usuario del historial previo
    const lastMessageObj = messages[messages.length - 1];
    const previousMessages = messages.slice(0, -1);

    // Gemini requiere que el historial de startChat empiece con rol 'user'
    const firstUserIndex = previousMessages.findIndex((m) => m.role === 'user');
    const validPrevious =
      firstUserIndex >= 0 ? previousMessages.slice(firstUserIndex) : [];

    const geminiHistory = validPrevious.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.content || '') }],
    }));

    // 6. Iniciar sesión con historial y enviar el nuevo mensaje
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(String(lastMessageObj.content || ''));
    const response = await result.response;
    const replyText = response.text();

    return res.status(200).json({
      reply: replyText,
    });
  } catch (error) {
    console.error('Error en /api/chat al invocar Gemini:', error);

    // Detectar límite de cuota / Rate Limit (429)
    const status = error?.status === 429 || String(error?.message).includes('429') ? 429 : 500;
    const errorMessage =
      status === 429
        ? '¡Demasiados entrenamientos seguidos! Respira profundo unos segundos e intenta de nuevo (Límite 429).'
        : 'Mi cuervo Kasugai perdió la señal en la montaña. Por favor, intenta enviar tu mensaje otra vez.';

    return res.status(status).json({ error: errorMessage });
  }
}