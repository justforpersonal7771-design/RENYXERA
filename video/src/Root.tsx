import React from "react";
import { Composition } from "remotion";
import { Film4, FilmVertical, TOTAL4 } from "./Film4";
import { FPS } from "./v4-timeline";

// v4 film, 4K 16:9. Earlier versions are in git history.
export const Root: React.FC = () => (
  <>
    <Composition id="Film4" component={Film4} durationInFrames={TOTAL4} fps={FPS} width={3840} height={2160} />
    <Composition id="FilmVertical" component={FilmVertical} durationInFrames={TOTAL4} fps={FPS} width={1080} height={1920} />
  </>
);
