import { NextResponse } from "next/server";
const gtts = require("gtts");
import { supabase } from "@/configs/supabase";

export async function POST(req: Request) {
  try {
    const { text, id } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const speech = new gtts(text, "en");

    if (!speech) {
      return NextResponse.json({
        message: "Failed to generate audio",
      });
    }

    await new Promise<void>((resolve, reject) => {
      speech.save(`./public/audio/output-${id}.mp3`, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { data, error } = await supabase.storage
      .from("audio")
      .upload(`output-${id}.mp3`, speech);

    console.log(data, error);

    return NextResponse.json({
      message: "Audio generated",
      audioUrl: data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
