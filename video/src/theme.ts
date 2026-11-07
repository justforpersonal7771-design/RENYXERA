import { loadFont as loadBrand } from "@remotion/google-fonts/BrunoAceSC";
import { loadFont as loadUi } from "@remotion/google-fonts/Manrope";
import { continueRender, delayRender, staticFile } from "remotion";

export const brandFont = loadBrand().fontFamily;
export const uiFont = loadUi("normal", { weights: ["500", "700", "800"] }).fontFamily;

// The site's ribbon: cyan to blue to violet to magenta.
export const C = {
  cyan: "#06c2fb",
  blue: "#0a5ff2",
  violet: "#5b21e0",
  magenta: "#dd42fb",
  ink: "#17143a",
  muted: "#5d5a82",
  soft: "#f5f2ff",
  white: "#ffffff",
};
export const ribbon = `linear-gradient(100deg, ${C.cyan}, ${C.violet} 55%, ${C.magenta})`;

// Display face for headlines (build brief, 7 Nov 2026): Bricolage Grotesque, an open-licence variable font loaded from video/public/fonts.
// The installed google-fonts package predates it, so the file is loaded directly; rendering waits until it is ready.
const fontHandle = delayRender("Bricolage Grotesque");
new FontFace("Bricolage Grotesque", `url(${staticFile("fonts/BricolageGrotesque.ttf")})`, { weight: "200 800" })
  .load()
  .then((f) => { document.fonts.add(f); continueRender(fontHandle); })
  .catch(() => continueRender(fontHandle)); // falls back to Manrope if the file cannot load
export const displayFont = `"Bricolage Grotesque", ${uiFont}, sans-serif`;
