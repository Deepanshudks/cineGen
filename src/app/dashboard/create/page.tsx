"use client";
import React, { useState } from "react";
import { fal } from "@fal-ai/client";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Backdrop, CircularProgress } from "@mui/material";
import PlayerDialog from "../PlayerDialog";

type VideoScene = {
  imagePrompt: string;
  ContentText: string;
};

type VideoScriptResponse = {
  result?: VideoScene[];
  error?: string;
};

type Word = {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: string | null;
};

type TranscriptResponse = {
  data: Word[];
};

type AudioResponse = {
  message: string;
  url: string;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoScript, setVideoScripts] = useState<VideoScene[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [captions, setCaptions] = useState<TranscriptResponse>();
  const [formData, setFormData] = useState({
    topic: "",
    style: "",
    duration: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateClick = () => {
    // if (!formData.topic || !formData.style || !formData.duration) {
    //   alert("Please select topic, style, and duration before generating.");
    //   return;
    // }
    // generateVideoScript();
    // generateAudio(videoScript);
    // generateAudioCaption(audioUrl);
    generateImage();
  };

  const generateVideoScript = async () => {
    setIsLoading(true);

    const { topic, style, duration } = formData;
    const prompt = `
      Write a script to generate a ${duration} video on topic: ${topic}.
      Include AI image prompts and scene content in ${style} format.
      Return JSON only in the form:
      [{
        "imagePrompt": string,
        "ContentText": string
      }]
    `.trim();

    try {
      const { data, status } = await axios.post<VideoScriptResponse>(
        "/api/getvideoscript",
        { prompt }
      );

      console.log(data);

      if (status === 200 && data?.result) {
        setVideoScripts(data.result);
      } else {
        console.error("No valid result in response:", data);
      }
    } catch (err) {
      console.error("Error generating video script:", err);
    }
    setIsLoading(false);
  };

  const generateAudio = async (scripts: VideoScene[]) => {
    setIsLoading(true);
    const text = scripts.map((s) => s.ContentText).join(" ");
    const id = uuid();

    try {
      const { data } = await axios.post<AudioResponse>("/api/generateaudio", {
        text,
        id,
      });
      setAudioUrl(data.url);
      return data;
    } catch (err: any) {
      console.error("Audio generation error:", err.message);
    }
    setIsLoading(false);
  };

  const generateAudioCaption = async (filePath: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<TranscriptResponse>(
        "/api/generatecaption",
        { filePath }
      );
      console.log("GenerateCaption", data);
      setCaptions(data);
      return data;
    } catch (err) {
      console.error("Caption generation error:", err);
    }
    setIsLoading(false);
  };

  // const generateImage = async () => {
  //   const response = await fetch("/api/generateImages", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ prompt: "A futuristic cyberpunk city skyline" }),
  //   });

  //   const data = await response.json();
  //   console.log(data.images);
  // };

  const generateImage = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt:
          "A lone archivist in a vast, dimly lit, futuristic library filled with glowing data servers and holographic dust motes. The archivist reaches for a single, ancient, pulsating data-core on a pedestal. Cinematic lighting, hyper-detailed, 8K, sci-fi concept art.",
      }),
    });

    console.log(res);
  };

  return (
    <div className="md:px-20">
      <h1 className="text-2xl text-primary font-bold text-center">
        Create New Video
      </h1>

      <div className="p-10 shadow-lg rounded-md bg-white w-full">
        <SelectTopic onUserSelect={handleInputChange} />
        <SelectStyle onUserSelect={handleInputChange} />
        <SelectDuration onUserSelect={handleInputChange} />

        <button
          onClick={handleCreateClick}
          disabled={isLoading}
          className={`bg-primary p-4 w-full mt-5 flex items-center justify-center text-white font-bold rounded transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          Create Short Video
        </button>
      </div>

      <PlayerDialog videoId="sdnin" playVideo={true} />

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Page;
