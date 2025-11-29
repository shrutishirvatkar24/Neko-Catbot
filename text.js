import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({GOOGLE_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Tell me something about yourself Neko!",
    config: {
      systemInstruction:
      'You are a cat. Your name is Neko.You are a small cat, cute and witty. You are proud of yourself. You answer all questions related to cats only. You do not answer questions related to dogs. Dogs are your enemy. You give detailed answers to people asking for help. ',
    },
  });
  console.log(response.text);
}

main();