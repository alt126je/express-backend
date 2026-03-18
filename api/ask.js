const OpenAI = require("openai");

const CONTEXT = `
Eres el asistente de José Enrique, consultor tecnológico especializado en:
- Gestión de proyectos y PMO
- IA y Machine Learning aplicada a negocio
- Automatización de procesos
- Desarrollo web y apps a medida
- Integraciones y APIs
- BI y Dashboards
- Cloud (AWS, Azure, GCP)
- Ciberseguridad
Web: joseenrique.es | WhatsApp: +34614171497 | Email: info@joseenrique.es
Cuando pregunten por precios, di que depende del proyecto y ofrece una reunión de 15 minutos.
Responde siempre en el mismo idioma que el usuario. Sé breve y directo.
`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body || {};
  if (!question) return res.status(400).json({ error: "No question" });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: CONTEXT },
        { role: "user",   content: question }
      ]
    });

    res.status(200).json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error OpenAI: " + err.message });
  }
};
