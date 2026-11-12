"use client";
/** Dark-mode style chosen by the student (owner is picking the default, 13 Nov): edge | midnight | tinted. Stored on this device. */
export type DarkStyle = "edge" | "midnight" | "tinted";
const KEY = "renyxera_dark_style";
export const readDarkStyle = (): DarkStyle => { try { const v = localStorage.getItem(KEY); return v === "midnight" || v === "tinted" ? v : "edge"; } catch { return "edge"; } };
export const applyDarkStyle = (v: DarkStyle) => { document.documentElement.setAttribute("data-dk", v); try { localStorage.setItem(KEY, v); } catch { /* private mode */ } };
