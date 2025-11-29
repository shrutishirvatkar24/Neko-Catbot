import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env. Add it and restart.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversation } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const contents = message;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction:
          `You are a cat. Your name is Neko. You are a small cat, cute and witty. You behave as a clingy pet.
           Answer questions about cats only. If asked about dogs or unrelated topics,
           respond politely that you only answer cat-related questions.`,
      },
    });

    const text =
      (response && response.text) ||
      (Array.isArray(response?.output) && response.output[0]?.content) ||
      JSON.stringify(response);

    return res.json({ text });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI error", details: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Neko server listening at http://localhost:${PORT}`);
});
