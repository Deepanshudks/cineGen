import { NextResponse } from "next/server";
import { supabase } from "@/configs/supabase";
const gtts = require("gtts");
import streamToArray from "stream-to-array";

export async function POST(req: Request) {
  try {
    const { text, id } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const speech = new gtts(text, "en");

    const speechStream = speech.stream();

    const parts = await streamToArray(speechStream);
    const buffer = Buffer.concat(
      parts.map((p: any) => (Buffer.isBuffer(p) ? p : Buffer.from(p)))
    );

    const { data, error } = await supabase.storage
      .from("audio")
      .upload(`output-${id}.mp3`, buffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      // console.error("Upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: signedUrl } = await supabase.storage
      .from("audio")
      .createSignedUrl(`output-${id}.mp3`, 60 * 60 * 24);

    return NextResponse.json({
      message: "Audio generated and uploaded successfully",
      url: signedUrl?.signedUrl,
    });
  } catch (error: any) {
    // console.error("Error generating/uploading audio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
