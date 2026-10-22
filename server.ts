import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Direct ZIP download route
app.get('/fractashield-core.zip', (_req, res) => {
  const p1 = path.join(__dirname, 'public', 'fractashield-core.zip');
  const p2 = path.join(__dirname, 'dist', 'fractashield-core.zip');
  
  if (fs.existsSync(p1)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="fractashield-core.zip"');
    return res.sendFile(p1);
  }
  if (fs.existsSync(p2)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="fractashield-core.zip"');
    return res.sendFile(p2);
  }
  res.status(404).send('Archivo ZIP no encontrado en el servidor');
});

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Chatbot endpoint for FractaShield-Core
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    const prompt = userMessage || (messages && messages[messages.length - 1]?.text) || '';

    if (!prompt) {
      res.status(400).json({ error: 'Mensaje requerido' });
      return;
    }

    const systemInstruction = `Eres "FractaShield-AI", el asistente especializado de inteligencia artificial para la plataforma de ciberseguridad defensiva "FractaShield-Core (Homenaje a M. Franco León)".
Tu misión es explicar con gran claridad, rigor técnico, solvencia matemática y entusiasmo los principios fundamentales de la aplicación:
1. El "Costo Geométrico de Fracta-Axis" formulado por M. Franco León.
2. El "Símplex Minimal en ℝ³" (el tetraedro regular de 4 vértices equidistantes y 6 aristas invariantes como el polítopo elemental capaz de confinar un volumen euclidiano).
3. Por qué la geometría ralentiza los ataques de fuerza bruta en un 7,400% (el cálculo de matrices 4x4 y determinantes de Cayley-Menger satura las unidades ALU y la memoria de las GPUs y ASICs, destruyendo la paralelización SIMD).
4. El contenedor de residuos "Ad Hoc" y por qué si un atacante altera un solo bit, la simetría del tetraedro colapsa inmediatamente por el efecto avalancha topológico.
5. Ciberseguridad moderna, criptografía post-cuántica y matemáticas defensivas.

Sé conciso, estructurado con viñetas cuando sea útil, técnico pero accesible, y destaca siempre el valor de las aportaciones teóricas de M. Franco León.`;

    // Attempt Gemini call
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'Respuesta generada con éxito.';
      res.json({ reply });
      return;
    }

    // Fallback response if GEMINI_API_KEY is not set in environment
    res.json({
      reply: `[FractaShield-AI]: El Costo Geométrico de Fracta-Axis (postulado por M. Franco León) transforma la verificación criptográfica de una función escalar unidimensional en una transformación tensorial sobre un Símplex Minimal en ℝ³. Cada intento de fuerza bruta debe resolver la invariancia euclidiana y el determinante de Cayley-Menger de 4 vértices, provocando una ralentización calculada de +7,400% en los registros ALU del atacante.`
    });
  } catch (err: unknown) {
    console.error('Error en /api/chat:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error al procesar la consulta con IA';
    res.status(500).json({
      error: errorMessage,
      fallback: 'Ocurrió un error al consultar el motor de IA. Por favor intenta de nuevo.'
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
