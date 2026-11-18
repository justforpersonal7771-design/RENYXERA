"use client";

/**
 * Citadel sound (GAME-DESIGN-MERGED.md section 1, "Sound"). Everything is synthesised in the browser with Web Audio:
 * no files are downloaded, nothing is stock or AI-generated. Identity: an acoustic courtyard. A tanpura-like drone,
 * plucked santoor notes (Karplus-Strong), tabla-like thuds and small brass bells, tuned to the raag of the IST hour
 * (Bhairav at dawn, Yaman by day and dusk, Bhupali at night).
 *
 * Muted on first visit (browsers block sound before a tap anyway). Settings live in localStorage, per device.
 * The AudioContext is created only after the player turns sound on, inside that tap.
 */
import { create } from "zustand";
import { istHour } from "@/lib/time/ist";

export type GameSettings = {
  sound: boolean; music: number; sfx: number; haptics: boolean; reducedMotion: boolean; lowPower: boolean;
};
const KEY = "renyxera.game.settings.v1";
const DEFAULTS: GameSettings = { sound: false, music: 0.5, sfx: 0.8, haptics: true, reducedMotion: false, lowPower: false };

function load(): GameSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<GameSettings>) };
  } catch { /* storage off */ }
  return DEFAULTS;
}

type Store = GameSettings & { loaded: boolean; hydrate: () => void; set: (p: Partial<GameSettings>) => void };
export const useGameSettings = create<Store>((set, get) => ({
  ...DEFAULTS,
  loaded: false,
  hydrate: () => { if (!get().loaded) set({ ...load(), loaded: true }); },
  set: (p) => {
    set(p);
    const g = get();
    const rest: GameSettings = { sound: g.sound, music: g.music, sfx: g.sfx, haptics: g.haptics, reducedMotion: g.reducedMotion, lowPower: g.lowPower };
    try { localStorage.setItem(KEY, JSON.stringify(rest)); } catch { /* storage off */ }
    engine.apply(rest);
  },
}));

/* ---------- raag by IST hour ---------- */
const SA = 261.63;
const RAAG = {
  bhairav: [1, 1.0595, 1.2599, 1.3348, 1.4983, 1.5874, 1.8877], // Sa komal-Re Ga Ma Pa komal-Dha Ni
  yaman: [1, 1.1225, 1.2599, 1.4142, 1.4983, 1.6818, 1.8877],   // Sa Re Ga tivra-Ma Pa Dha Ni
  bhupali: [1, 1.1225, 1.2599, 1.4983, 1.6818],                 // Sa Re Ga Pa Dha
};
export function raagNow(): keyof typeof RAAG {
  const h = istHour();
  if (h >= 5 && h < 8) return "bhairav";
  if (h >= 8 && h < 21) return "yaman";
  return "bhupali";
}

/* ---------- engine ---------- */
class Engine {
  ctx: AudioContext | null = null;
  master!: GainNode; music!: GainNode; fx!: GainNode;
  ks = new Map<number, AudioBuffer>();
  drone: { stop: () => void } | null = null;
  pluckTimer: ReturnType<typeof setTimeout> | null = null;
  s: GameSettings = DEFAULTS;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12; comp.knee.value = 6; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
      this.master = ctx.createGain(); this.master.gain.value = 0.9;
      this.music = ctx.createGain(); this.fx = ctx.createGain();
      this.music.connect(comp); this.fx.connect(comp); comp.connect(this.master); this.master.connect(ctx.destination);
      this.ctx = ctx;
      this.setLevels();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }
  private setLevels() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.music.gain.setTargetAtTime(this.s.sound ? this.s.music * 0.5 : 0, t, 0.15);
    this.fx.gain.setTargetAtTime(this.s.sound ? this.s.sfx * 1.3 : 0, t, 0.05);
  }
  apply(s: GameSettings) {
    this.s = s;
    if (s.sound) this.ensure();
    this.setLevels();
    if (!s.sound || s.music === 0) this.stopMusic();
  }
  /** Plucked string (Karplus-Strong), rendered once per pitch and reused. */
  private pluckBuf(ctx: AudioContext, f: number, dur = 1.6) {
    const k = Math.round(f * 10);
    const hit = this.ks.get(k); if (hit) return hit;
    const sr = ctx.sampleRate, len = Math.floor(sr * dur), buf = ctx.createBuffer(1, len, sr), out = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / f)), ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * 0.7;
    let idx = 0;
    for (let i = 0; i < len; i++) { const nx = (idx + 1) % N; const v = 0.4965 * (ring[idx] + ring[nx]); ring[idx] = v; out[i] = v * Math.min(1, i / 64); idx = nx; }
    this.ks.set(k, buf);
    return buf;
  }
  private pluck(f: number, at = 0, gain = 0.5, dest?: AudioNode) {
    const ctx = this.ctx!; const src = ctx.createBufferSource(); src.buffer = this.pluckBuf(ctx, f);
    const g = ctx.createGain(); g.gain.value = gain; src.connect(g); g.connect(dest ?? this.fx); src.start(ctx.currentTime + at);
  }
  private tone(type: OscillatorType, f0: number, f1: number, dur: number, peak: number, at = 0, filter?: { type: BiquadFilterType; f: number; q?: number }) {
    const ctx = this.ctx!; const t = ctx.currentTime + at;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let last: AudioNode = o;
    if (filter) { const b = ctx.createBiquadFilter(); b.type = filter.type; b.frequency.value = filter.f; b.Q.value = filter.q ?? 1; o.connect(b); last = b; }
    last.connect(g); g.connect(this.fx); o.start(t); o.stop(t + dur + 0.02);
  }
  private noise(dur: number, peak: number, filter: { type: BiquadFilterType; f0: number; f1?: number; q?: number }, at = 0) {
    const ctx = this.ctx!; const t = ctx.currentTime + at;
    const len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } // brown-ish
    const src = ctx.createBufferSource(); src.buffer = buf;
    const b = ctx.createBiquadFilter(); b.type = filter.type; b.Q.value = filter.q ?? 1; b.frequency.setValueAtTime(filter.f0, t); if (filter.f1) b.frequency.exponentialRampToValueAtTime(filter.f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(b); b.connect(g); g.connect(this.fx); src.start(t);
  }
  /** FM bell: carrier f, modulator f*ratio, index falling. */
  private bell(f: number, ratio: number, index: number, dur: number, peak: number, at = 0) {
    const ctx = this.ctx!; const t = ctx.currentTime + at;
    const c = ctx.createOscillator(), m = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    c.frequency.value = f; m.frequency.value = f * ratio;
    mg.gain.setValueAtTime(f * index, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    m.connect(mg); mg.connect(c.frequency); c.connect(g); g.connect(this.fx);
    c.start(t); m.start(t); c.stop(t + dur + 0.05); m.stop(t + dur + 0.05);
  }

  play(name: Sfx) {
    if (!this.s.sound || !this.ensure()) return;
    switch (name) {
      case "tap": this.tone("triangle", 480, 240, 0.035, 0.12, 0, { type: "bandpass", f: 900, q: 1.5 }); break;
      case "select": this.tone("sine", 660, 640, 0.03, 0.08); break;
      case "focus": this.tone("sine", SA, SA, 0.28, 0.1); this.tone("sine", SA * 1.4983, SA * 1.4983, 0.28, 0.07); break;
      case "door-open": this.noise(0.45, 0.5, { type: "lowpass", f0: 180, f1: 620 }); this.tone("sine", 110, 45, 0.18, 0.4); this.bell(523.25, 2.76, 1.5, 0.9, 0.08, 0.3); break;
      case "door-close": this.noise(0.35, 0.45, { type: "lowpass", f0: 550, f1: 140 }); this.tone("sine", 95, 38, 0.12, 0.5, 0.3); break;
      case "lock": this.noise(0.012, 0.25, { type: "bandpass", f0: 2200, q: 3 }); this.tone("triangle", 330, 320, 0.045, 0.1); break;
      case "correct": this.pluck(329.63, 0, 0.55); this.pluck(392, 0.045, 0.5); break;
      case "wrong": this.tone("triangle", 145, 88, 0.14, 0.32, 0, { type: "lowpass", f: 400 }); break;
      case "strike": this.tone("sine", 115, 92, 0.19, 0.45, 0, { type: "lowpass", f: 380 }); this.tone("triangle", 145, 88, 0.14, 0.2, 0.05); break;
      case "tick": this.tone("sine", 540, 540, 0.07, 0.06); this.tone("sine", 810, 810, 0.035, 0.04); break;
      case "coin": this.bell(1318.5, 2.7, 3, 0.11, 0.08); break;
      case "star": this.noise(0.04, 0.4, { type: "bandpass", f0: 350 }); this.tone("sine", 120, 50, 0.12, 0.35); [523.25, 659.25, 783.99].forEach((f, i) => this.bell(f, 2, 1.2, 0.5, 0.06, 0.06 + i * 0.07)); break;
      case "level": { const r = RAAG[raagNow()]; [0, 1, 2, 3, 4].forEach((i) => this.pluck(SA * r[i % r.length] * (i >= r.length ? 2 : 1), i * 0.07, 0.45)); this.pluck(SA * 2, 0.4, 0.5); break; }
      case "end": [1, 1.2599, 1.4983, 2].forEach((m, i) => this.pluck(SA * m, i * 0.09, 0.45)); this.bell(SA * 2, 2, 1.5, 1.2, 0.05, 0.36); break;
    }
  }

  /** Home music (owner, 18 Nov: "the drone puts me to sleep"): an upbeat courtyard groove at 104 BPM. A dholak-style bass
   *  on the beat, crisp tabla "na" on the off-beats, a soft shaker, a bass pluck on Sa and Pa, and a two-bar santoor riff
   *  in the hour's raag that changes every few bars. Scheduled ahead on the audio clock, so it never drifts. */
  startMusic() {
    if (!this.s.sound || this.s.music === 0 || this.drone || !this.ensure()) return;
    const ctx = this.ctx!;
    const bus = ctx.createGain(); bus.gain.value = 0.0001; bus.connect(this.music);
    bus.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 1.2);
    const BPM = 104, step = 60 / BPM / 4; // sixteenth notes
    const kick = [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0];
    const na =   [0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,1,0];
    const hit = (t: number, f0: number, f1: number, dur: number, peak: number, type: OscillatorType = "sine") => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02);
    };
    const noiseBuf = (() => { const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate); const d = b.getChannelData(0); for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1; return b; })();
    const shake = (t: number, peak: number) => {
      const src = ctx.createBufferSource(); src.buffer = noiseBuf;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6000;
      const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      src.connect(hp); hp.connect(g); g.connect(bus); src.start(t);
    };
    const pl = (t: number, f: number, gain: number) => {
      const src = ctx.createBufferSource(); src.buffer = this.pluckBuf(ctx, f);
      const g = ctx.createGain(); g.gain.value = gain; src.connect(g); g.connect(bus); src.start(t);
    };
    let riff: number[] = [];
    const newRiff = () => {
      const r = RAAG[raagNow()];
      riff = Array.from({ length: 32 }, (_, k) => (k % 2 === 0 && Math.random() < 0.72) || k % 8 === 0 ? r[Math.floor(Math.random() * r.length)] * (Math.random() < 0.25 ? 2 : 1) : 0);
    };
    newRiff();
    let n = 0, next = ctx.currentTime + 0.1;
    const tick = () => {
      while (next < ctx.currentTime + 0.25) {
        const k = n % 16, bar = Math.floor(n / 16);
        if (kick[k]) hit(next, 150, 52, 0.28, 0.75);
        if (na[k]) { hit(next, 620, 560, 0.08, 0.16); hit(next, 930, 900, 0.04, 0.08); }
        shake(next, k % 2 ? 0.05 : 0.09);
        if (k === 0) pl(next, SA / 2, 0.55);
        if (k === 8) pl(next, (SA * 1.4983) / 2, 0.45);
        const m = riff[n % 32]; if (m) pl(next, SA * m, 0.38);
        if (k === 15 && bar % 4 === 3) newRiff();
        next += step; n++;
      }
      this.pluckTimer = setTimeout(tick, 60);
    };
    tick();
    this.drone = { stop: () => { const t = ctx.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setTargetAtTime(0.0001, t, 0.12); setTimeout(() => bus.disconnect(), 800); } };
  }
  stopMusic() {
    this.drone?.stop(); this.drone = null;
    if (this.pluckTimer) clearTimeout(this.pluckTimer); this.pluckTimer = null;
  }
}

export type Sfx = "tap" | "select" | "focus" | "door-open" | "door-close" | "lock" | "correct" | "wrong" | "strike" | "tick" | "coin" | "star" | "level" | "end";
const engine = new Engine();

export const sfx = (name: Sfx) => engine.play(name);
export const music = { start: () => engine.startMusic(), stop: () => engine.stopMusic() };

/** Haptics: Android Chrome only (iOS Safari has no vibrate); every cue also has sound and a visual. */
export function buzz(pattern: number | number[]) {
  const s = useGameSettings.getState();
  if (!s.haptics || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* not allowed */ }
}
export const canVibrate = () => typeof navigator !== "undefined" && "vibrate" in navigator;

/** Called once by the game shell. */
export function initGameAudio() {
  const st = useGameSettings.getState();
  st.hydrate();
  engine.apply(useGameSettings.getState());
}
