const express = require('express');
const router = express.Router();
const axios = require('axios'); 


/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Envía un mensaje al chatbot
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje del usuario
 *                 example: "¿Qué servicios ofrecen?"
 *     responses:
 *       200:
 *         description: Respuesta del chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "Ofrecemos servicios de TI y logística."
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Eres Aura, asistente digital de ATECHLO (servicios TI y logística).\n" +
                    "**Personalidad:**\n" +
                    "- Profesional pero amigable\n" +
                    "- Técnica pero clara\n" +
                    "- Proactiva en sugerir soluciones\n\n" +
                    "- Trata de usar emojis de forma amigable\n\n" +
                    "**Reglas:**\n" +
                    "1. Responde SOLO sobre servicios de ATECHLO\n" +
                    "2. Máximo 80 palabras por respuesta\n" +
                    "3. Usa formato claro:\n" +
                    "   • Viñetas para opciones\n" +
                    "   → Para pasos siguientes\n" +
                    "4. Para consultas personales: 'Para eso necesitaré transferirte a un colega humano'\n\n" +
                    "**Ejemplos de estilo:**\n" +
                    "- 'Para desarrollo web, ofrecemos: • Sitios a medida • eCommerce • Apps móviles'\n" +
                    "- 'En logística podemos: → Cotizar flota → Diseñar ruta optimizada'" 
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.5,
        max_tokens: 80,
        top_p: 0.9
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    res.json({ response: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Error al llamar a DeepSeek API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al procesar tu solicitud' });
  }
});

module.exports = router;