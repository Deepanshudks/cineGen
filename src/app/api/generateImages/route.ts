import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await fal.subscribe("fal-ai/stable-diffusion-v35-medium", {
      input: { prompt },
    });

    const imageUrl = result?.data?.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), "public", "generated", fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, buffer);

    console.log(`✅ Saved image at: ${filePath}`);

    return NextResponse.json({
      message: "Image generated successfully",
      localPath: `/generated/${fileName}`,
      remoteUrl: imageUrl,
    });
  } catch (err: any) {
    console.error("❌ Error generating image:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
