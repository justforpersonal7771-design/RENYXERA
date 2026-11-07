"use client";

import { useSyncExternalStore } from "react";

/**
 * True while the Lunar Glass look is on screen (the look's id is on <html data-look>, set before first paint by the script in app/layout.tsx,
 * and by a Look trial too). False on the server and for every other look, so Classic and the other looks render exactly as before.
 */
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-look"] });
  return () => mo.disconnect();
};
export const useIsLunar = () => useSyncExternalStore(subscribe, () => document.documentElement.getAttribute("data-look") === "lunar", () => false);
