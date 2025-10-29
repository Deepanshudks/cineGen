import React, { ComponentType } from "react";

export interface CompositionProps {
  id: string;
  component: ComponentType<any>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps?: Record<string, unknown>;
  children?: React.ReactNode;
}

export const MyComposition: React.FC<CompositionProps> = ({
  id,
  component: Component,
  durationInFrames,
  fps,
  width,
  height,
}) => {
  return (
    <div>
      <p>
        Composition <strong>{id}</strong> <br />
        {durationInFrames} frames @ {fps} fps
      </p>
      <Component />
    </div>
  );
};
