import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { InferenceClient } from "@huggingface/inference";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
  const id = uuid();

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const image: any = await client.textToImage({
      provider: "nebius",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
      parameters: { num_inference_steps: 5 },
    });

    let imageBuffer: Buffer;

    if (typeof image === "string") {
      const base64Data = image.split(",").pop() || image;
      imageBuffer = Buffer.from(base64Data, "base64");
    } else if (typeof image === "object" && "arrayBuffer" in image) {
      const arrayBuffer = await (image as Blob).arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      throw new Error("Unexpected response type from Hugging Face API");
    }

    const fileName = `image_${id}.png`;
    const folderPath = path.join(process.cwd(), "public", "generatedImages");
    const filePath = path.join(folderPath, fileName);

    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, imageBuffer);

    console.log(`✅ Image saved locally at: ${filePath}`);

    return NextResponse.json({
      message: "Image generated and saved successfully",
      localPath: `/generatedImages/${fileName}`,
      image: `data:image/png;base64,${imageBuffer.toString("base64")}`,
    });
  } catch (error: any) {
    console.error("❌ Error generating image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
