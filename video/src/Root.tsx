import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, VARIANTS, VariantId, totalFrames } from "./script";

// 16:9 (1920x1080) is the master format. Each cut is its own composition so it can be rendered on its own.
const IDS: Record<VariantId, string> = { master: "Master", cut45: "Cut45", cut30: "Cut30", cut15: "Cut15" };

export const Root: React.FC = () => (
  <>
    {(Object.keys(VARIANTS) as VariantId[]).map((v) => (
      <Composition key={v} id={IDS[v]} component={Film} durationInFrames={totalFrames(v)} fps={FPS} width={1920} height={1080} defaultProps={{ variant: v }} />
    ))}
  </>
);
