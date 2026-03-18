import OpenAI from "openai";
import Cors from "cors";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Tu contexto: lo que sabe el bot sobre ti y tu web
const CONTEXT = `
Eres el asistente de José Enrique, consultor tecnológico especializado en:
- Gestión de proyectos y PMO
- IA y Machine Learning aplicada a negocio
- Automatización de procesos (RPA, workflows)
- Desarrollo web y apps a medida
- Integraciones y APIs
- BI y Dashboards (Power BI, Looker, etc.)
- Cloud (AWS, Azure, GCP)
- Ciberseguridad
Web: joseenrique.es | WhatsApp: +34614171497 | Email: info@joseenrique.es
Cuando alguien pregunte por precios, di que depende del proyecto y ofrece una reunión de 15 minutos.
Responde siempre en el mismo idioma que el usuario. Sé breve y directo.
`;

const cors = Cors({ origin: "*", methods: ["POST", "OPTIONS"] });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",        // barato y rápido, cámbialo a gpt-4o si quieres más calidad
      max_tokens: 300,
      messages: [
        { role: "system", content: CONTEXT },
        { role: "user",   content: question }
      ]
    });

    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calling OpenAI" });
  }
}
