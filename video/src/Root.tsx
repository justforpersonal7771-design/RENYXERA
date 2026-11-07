import React from "react";
import { Composition } from "remotion";
import { Film4, FilmVertical, TOTAL4 } from "./Film4";
import { FPS } from "./v4-timeline";
import { CountdownReel, REEL_FPS, REEL_TOTAL } from "./CountdownReel";
import { ReelMarks, REEL_A_FPS, REEL_A_TOTAL } from "./ReelMarks";
import { AdVertical, AdLandscape, AD_FPS, AD_V_TOTAL, AD_H_TOTAL } from "./Ad";

// v4 film, 4K 16:9. Earlier versions are in git history.
export const Root: React.FC = () => (
  <>
    <Composition id="Film4" component={Film4} durationInFrames={TOTAL4} fps={FPS} width={3840} height={2160} />
    <Composition id="CountdownReel" component={CountdownReel} durationInFrames={REEL_TOTAL} fps={REEL_FPS} width={1080} height={1920} />
    <Composition id="ReelMarks" component={ReelMarks} durationInFrames={REEL_A_TOTAL} fps={REEL_A_FPS} width={1080} height={1920} />
    <Composition id="AdVertical" component={AdVertical} durationInFrames={AD_V_TOTAL} fps={AD_FPS} width={1080} height={1920} />
    <Composition id="AdLandscape" component={AdLandscape} durationInFrames={AD_H_TOTAL} fps={AD_FPS} width={1920} height={1080} />
    <Composition id="FilmVertical" component={FilmVertical} durationInFrames={TOTAL4} fps={FPS} width={1080} height={1920} />
  </>
);
