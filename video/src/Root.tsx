import React from "react";
import { Composition } from "remotion";
import { Film4k, FPS, TOTAL } from "./Film4k";

// v3 launch film: 4K 16:9. Earlier versions are in git history.
export const Root: React.FC = () => <Composition id="Film4k" component={Film4k} durationInFrames={TOTAL} fps={FPS} width={3840} height={2160} />;
