import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

const config = {
  responseMimeType: "application/json",
};

const model = "gemini-2.5-pro";

export const chatSession = async (prompt: string) => {
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const stream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let output = "";

    for await (const event of stream) {
      event.candidates?.forEach((candidate) => {
        candidate.content?.parts?.forEach((part) => {
          if (part.text) {
            output += part.text;
          }
        });
      });
    }

    if (config.responseMimeType === "application/json") {
      try {
        return JSON.parse(output);
      } catch {
        return { raw: output, error: "Failed to parse JSON" };
      }
    }

    return output;
  } catch (e) {
    console.error("AI Error:", e);
    throw e;
  }
};
