import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import * as fs from "node:fs";

interface PromptRequest {
  prompt: string;
}

export default async function POST(req: Request): Promise<Response> {
  try {
    const { prompt }: PromptRequest = await req.json();
    await main(prompt);
    return new Response("API is running", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function main(prompt: string): Promise<void> {
  const ai = new GoogleGenAI({});

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  const candidate = response.candidates?.[0];
  const parts = candidate?.content?.parts;

  if (!parts || parts.length === 0) {
    console.error("No parts found in the model response.");
    return;
  }

  for (const part of parts) {
    if ("text" in part && part.text) {
      console.log(part.text);
    } else if ("inlineData" in part && part.inlineData?.data) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}
