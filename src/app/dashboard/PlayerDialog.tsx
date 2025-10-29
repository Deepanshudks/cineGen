"use client";
import { Player } from "@remotion/player";
import { Button, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { RemotionVideo } from "./_components/RemotionVideo";
import { CancelSharp } from "@mui/icons-material";

interface PlayerDialogProps {
  videoId: string;
  playVideo: boolean;
}

const PlayerDialog = ({ videoId, playVideo }: PlayerDialogProps) => {
  const [openDailog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    playVideo && setOpenDialog(true);
  }, [playVideo]);
  return (
    <>
      <Dialog open={openDailog} onClose={handleClose}>
        <div className="p-4 flex flex-col gap-4 items-center">
          <div className="flex justify-between w-full">
            <h1 className="text-xl font-semibold flex flex-col">
              Your video is ready to play
            </h1>
            <button
              onClick={handleClose}
              className="self-end text-gray-500 hover:text-gray-700"
            >
              <CancelSharp />
            </button>
          </div>
          <Player
            component={RemotionVideo}
            durationInFrames={120}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
          />
          <div className="flex justify-between w-full">
            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
            <Button onClick={() => {}} variant="contained">
              Download Video
            </Button>
          </div>
        </div>
      </Dialog>
      ;
    </>
  );
};

export default PlayerDialog;
