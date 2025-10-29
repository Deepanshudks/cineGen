"use client";
import React, { useState } from "react";
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

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, setVideoScripts] = useState<VideoScene[] | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    style: "",
    duration: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateClick = () => {
    if (!formData.topic || !formData.style || !formData.duration) {
      alert("Please select topic, style, and duration before generating.");
      return;
    }
    generateVideoScript();
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

      console.log("Script", data);

      if (status === 200 && data?.result) {
        setVideoScripts(data.result);
        const audioResponse: any = await generateAudio(data.result);
        if (!audioResponse) {
          alert("Audio generation failed.");
        } else {
          const res = await generateAudioCaption(audioResponse?.url);
        }
      } else {
        console.error("No valid result in response:", data);
      }
    } catch (err) {
      console.error("Error generating video script:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudio = async (scripts: VideoScene[]) => {
    const text = scripts.map((s) => s.ContentText).join(" ");
    const id = uuid();

    try {
      const { data } = await axios.post("/api/generateaudio", { text, id });
      // console.log(data, " Audio generated successfully");
      return data;
    } catch (err: any) {
      console.error("Audio generation error:", err.message);
    }
  };

  const generateAudioCaption = async (filePath: string) => {
    try {
      const { data } = await axios.post("/api/generatecaption", { filePath });
      return data;
    } catch (err) {
      console.error("Caption generation error:", err);
    }
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
