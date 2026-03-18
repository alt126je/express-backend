import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "API funcionando correctamente 🚀" });
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres el asistente profesional de José Enrique." },
        { role: "user", content: question }
      ]
    });

    res.json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error interno consultando la IA" });
  }
});

export default app;
