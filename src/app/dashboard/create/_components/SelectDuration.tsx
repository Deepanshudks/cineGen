"use client";
import { MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";

const SelectDuration = ({
  onUserSelect,
}: {
  onUserSelect: (a: string, b: string) => void;
}) => {
  const [, setSelectDuration] = useState("");
  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 text-secondary">Duration</h2>
      <p className="text-gray-500">Select the duration of your video?</p>
      <div className="py-2 flex flex-col gap-2 mt-2">
        <TextField
          id="content-duration"
          name="content-duration"
          onChange={(e) => {
            setSelectDuration(e.target.value);
            onUserSelect("duration", e.target.value);
          }}
          select
          label="Content Duration"
          className="w-full"
        >
          <MenuItem value="30 seconds">30 Seconds</MenuItem>
          <MenuItem value="60 seconds">60 Seconds</MenuItem>
        </TextField>
      </div>
    </div>
  );
};

export default SelectDuration;
