import { loadFont as loadBrand } from "@remotion/google-fonts/BrunoAceSC";
import { loadFont as loadUi } from "@remotion/google-fonts/Manrope";

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
