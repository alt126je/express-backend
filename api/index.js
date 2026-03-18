import express from "express";
import askRoute from "./ask.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente 🚀" });
});

app.use("/ask", askRoute);

export default app;
