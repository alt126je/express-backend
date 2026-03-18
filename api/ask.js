import OpenAI from "openai";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres el asistente profesional de José Enrique." },
        { role: "user", content: question }
      ]
    });

    res.json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error("ERROR /api/ask:", err);
    res.status(500).json({ answer: "Error interno consultando la IA." });
  }
});

export default router;
