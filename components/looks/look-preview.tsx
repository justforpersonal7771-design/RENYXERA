"use client";

/**
 * A live preview of a Look, drawn inside its own small document (an iframe built from the app's real stylesheets) so that the Look
 * currently on in the app cannot bleed into the preview of another Look. It is the real CSS and the real class names, not a picture.
 */
import { useEffect, useRef, useState } from "react";
import { lookById } from "@/lib/looks/looks";

const BODY = `
<div class="ambient-gradient" style="min-height:100vh;padding:12px;box-sizing:border-box">
  <div class="topbar-island" style="display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:10px;font-weight:700;border-radius:12px;position:static;height:auto">
    <span style="width:12px;height:12px;border-radius:99px;background:var(--tint-peri-ink)"></span><span>Dashboard</span><span style="opacity:.6">Test Centre</span><span style="opacity:.6">Study</span><span style="flex:1"></span><span style="width:12px;height:12px;border-radius:99px;background:var(--tint-rose-ink)"></span>
  </div>
  <div style="display:grid;grid-template-columns:3fr 2fr;gap:8px;margin-top:10px">
    <div class="card-pastel" data-tint="mint" style="padding:10px"><div style="font-size:12px;font-weight:800">Build a test</div><div style="font-size:9px;opacity:.75;margin:2px 0 8px">Pick the questions, the length and the rules.</div><span class="pill-ink" style="display:inline-flex;height:20px;align-items:center;padding:0 9px;font-size:9px">Start</span></div>
    <div style="display:flex;flex-direction:column;gap:8px"><div class="card-pastel" data-tint="rose" style="padding:8px;font-size:10px;font-weight:800">Practice</div><div class="card-pastel" data-tint="butter" style="padding:8px;font-size:10px;font-weight:800">Mocks</div></div>
  </div>
  <div style="display:flex;gap:6px;margin-top:8px"><span class="pill-soft" style="display:inline-flex;height:20px;align-items:center;padding:0 9px;font-size:9px">History</span><span class="pill-soft" style="display:inline-flex;height:20px;align-items:center;padding:0 9px;font-size:9px">Flashcards</span></div>
</div>`;

export function LookPreview({ id, className = "" }: { id: string; className?: string }) {
  const [doc, setDoc] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => `<link rel="stylesheet" href="${(l as HTMLLinkElement).href}">`).join("");
    const look = lookById(id);
    const page = document.documentElement.classList.contains("dark");
    const dark = look.modes === "dark" ? true : look.modes === "light" ? false : page;
    const attr = id === "classic" ? "" : ` data-look="${id}"`;
    setDoc(`<!doctype html><html class="${document.documentElement.className.replace(/\bdark\b|\blight\b/g, "")} ${dark ? "dark" : "light"}"${attr}><head><meta charset="utf-8">${links}<style>html,body{margin:0;height:100%;overflow:hidden;background:var(--background)}</style></head><body>${BODY}</body></html>`);
  }, [id]);
  return (
    <div ref={wrap} aria-hidden className={`pointer-events-none relative overflow-hidden rounded-2xl ${className}`}>
      {doc && <iframe title="" tabIndex={-1} srcDoc={doc} className="absolute left-0 top-0 h-full w-full border-0" />}
    </div>
  );
}
