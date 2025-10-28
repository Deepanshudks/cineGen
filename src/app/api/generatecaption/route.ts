import { AssemblyAI, type TranscribeParams } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { filePath } = await req.json();

  try {
    const client = new AssemblyAI({
      apiKey: process.env.NEXT_ASSYMBLY_API_KEY as string,
    });

    if (!filePath) {
      return NextResponse.json(
        { message: "File path is required" },
        { status: 400 }
      );
    }

    const params: TranscribeParams = {
      audio: filePath,
      speech_model: "universal" as TranscribeParams["speech_model"],
    };

    const transcript = await client.transcripts.transcribe(params);

    // console.log("Transcript:", transcript);

    return NextResponse.json({ message: "Done", text: transcript.text });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
