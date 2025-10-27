"use client";
import React, { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Backdrop, CircularProgress } from "@mui/material";

type VideoScene = {
  imagePrompt: string;
  ContentText: string;
};

type VideoScriptResponse = {
  result?: VideoScene[];
  error?: string;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setVideoScripts] = useState<VideoScene[] | null>(null);
  const [formData, setFormData] = useState<{
    topic?: string;
    style?: string;
    duration?: string;
  }>({});

  const onHandleInputChange = (fieldname: string, fieldValue: string) => {
    setFormData((prev) => ({ ...prev, [fieldname]: fieldValue }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
  };

  const GetVideoScript = async () => {
    setIsLoading(true);

    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.style} format. For each scene, include an AI image prompt in ${formData.style} format and the corresponding content text. Provide the just result in JSON format with 'imagePrompt' and 'ContentText' as fields. Do not include any plain text outside of the JSON structure. json format: [{
    imagePrompt: string;
    ContentText: string;
    }]`;

    try {
      const res = await axios.post<VideoScriptResponse>("/api/getvideoscript", {
        prompt,
      });

      console.log(res);

      if (res.status == 200) {
        const ResponseScripts = res.data?.result;

        console.log(ResponseScripts);

        setVideoScripts(ResponseScripts || null);
        GenerateAudio(ResponseScripts || []);
        GenerateAudioCaption(
          `./public/audio/output-20e014a6-7db9-4f35-b29f-e47acd9c29ea.mp3`
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.log("ERROR", err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const GenerateAudio = async (scripts: VideoScene[]) => {
    let script = "";
    scripts?.forEach((item) => (script += item.ContentText + " "));

    const id = uuid();

    console.log("TEXT", script);
    try {
      const file = await axios.post("/api/generateaudio", {
        text: script,
        id,
      });
      return file;
      // console.log("file", file);
    } catch (e: any) {
      console.log("AUDIO ERROR", e.message);
    }
  };

  const GenerateAudioCaption = async (filePath: string) => {
    await axios
      .post("/api/generatecaption", { filePath })
      .then((res) => res.data);
  };
  return (
    <div className="md:px-20">
      <h1 className="text-2xl text-primary font-bold text-center">
        Create New Video
      </h1>
      <div className=" p-10 shadow-lg rounded-md bg-white w-full">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <button
          onClick={onCreateClickHandler}
          className="bg-primary p-4 hover:scale-105 cursor-pointer transition-all w-full  items-center justify-center flex text-white font-bold rounded mt-5 "
        >
          {/* {isLoading ? (
            <CircularProgress size={28} color="inherit" />
          ) : (
            "Create Short Video"
          )} */}
          Create Short Video
        </button>
      </div>
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
