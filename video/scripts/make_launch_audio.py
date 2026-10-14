"""Sound for the RENYXERA launch film: a 120 BPM track built on the edit's beat grid, impacts and UI sounds, and a natural
voice (Kokoro, Apache-2.0 weights, runs on the CPU, commercial use allowed).

    pip install kokoro-onnx soundfile numpy
    # model files (not in git): video/models/kokoro-v1.0.onnx and video/models/voices-v1.0.bin from
    # https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python video/scripts/make_launch_audio.py

Writes video/public/launch/*.wav and video/src/launch-vo.json (length of every line, which the edit checks against its slot).
"""
import json
import math
import os
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "launch")
SRC = os.path.join(HERE, "..", "src")
MODELS = os.path.join(HERE, "..", "models")
os.makedirs(OUT, exist_ok=True)
SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = int(os.environ.get("BARS", 32))
DROP = int(os.environ.get("DROP", 6))  # bar of the logo hit
END = int(os.environ.get("END", 29))  # bar of the end-card hit
VOICE = os.environ.get("VOICE", "af_heart")

# One short line per slot. Kept sparse on purpose: the pictures and the type carry the story, the voice only frames it.
LINES = {
    "a1": "Over two lakh students sat GATE C S in twenty twenty six.",
    "a2": "Fewer than one in five qualified.",
    "a3": "Effort was never the problem. Direction was.",
    "a4": "Meet Renyxera.",
    "a5": "Pick a section, a subject, a topic. Your test is ready in seconds.",
    "a6": "Real previous year questions, in a real exam screen.",
    "a7": "Then see exactly where you stand.",
    "a8": "Your weak topics, found for you.",
    "a9": "And a plan that fits your hours.",
    "a10": "Official cut-offs and a score calculator. Free.",
    "a11": "Go further with Plus. Or go all in with Pro.",
    "a12": "New papers and practice. And more on the way.",
    "a13": "Renyxera. A new era of intelligent learning.",
}


def write(name, x, stereo=False):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        data = x.T.reshape(-1) if stereo else x
        w.writeframes((data * 32767).astype("<i2").tobytes())


def n(sec):
    return int(round(sec * SR))


def sine(f, dur, phase=0.0):
    t = np.arange(n(dur)) / SR
    return np.sin(2 * math.pi * f * t + phase)


def saw(f, dur):
    t = np.arange(n(dur)) / SR
    return 2 * ((t * f) % 1.0) - 1


def lowpass(x, cutoff):
    a = math.exp(-2 * math.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def adsr(length, a=0.01, r=0.1):
    e = np.ones(length)
    na, nr = min(length, n(a)), min(length, n(r))
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def place(track, clip, at):
    i = n(at)
    if i >= len(track):
        return
    j = min(len(track), i + len(clip))
    track[i:j] += clip[: j - i]


def music():
    total = BARS * BAR + 3
    L = np.zeros(n(total))
    R = np.zeros(n(total))
    rng = np.random.default_rng(11)
    # Chords: Am F C G, two bars each; voiced warm and wide.
    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)

    kick_t = np.arange(n(0.35)) / SR
    kick = np.sin(2 * math.pi * (45 + 110 * np.exp(-kick_t * 30)) * kick_t) * np.exp(-kick_t * 9)
    clap = rng.normal(0, 1, n(0.18)) * np.exp(-np.arange(n(0.18)) / SR * 28)
    clap = lowpass(clap, 5000) - lowpass(clap, 900)
    hat = rng.normal(0, 1, n(0.05)) * np.exp(-np.arange(n(0.05)) / SR * 90)
    hat = hat - lowpass(hat, 6000)

    # Sections (bars): 0-1 hook (sparse), 2 drop (logo), 3-18 groove, 19 break, 20-23 resolve.
    for b in range(BARS):
        t0 = b * BAR
        chord = prog[(b // 2) % 4]
        # pad with sidechain pump
        pad = np.zeros(n(BAR))
        for m_ in chord:
            for det in (-0.12, 0.12):
                pad += saw(hz(m_) * (1 + det / 100), BAR) * 0.05
        pad = lowpass(pad, 1400 if b < DROP else 2400)
        pump = np.ones(n(BAR))
        if DROP <= b < END - 1:
            for k in range(4):
                s = n(k * BEAT)
                seg = min(n(BEAT), len(pump) - s)
                pump[s : s + seg] = 0.35 + 0.65 * (1 - np.exp(-np.arange(seg) / SR * 9))
        pad *= pump * (0.6 if b < DROP else 1.0) * adsr(n(BAR), 0.02, 0.05)
        place(L, pad, t0)
        place(R, np.roll(pad, 90), t0)
        # bass on the root, eighth notes from the drop
        if DROP <= b < END - 1 or b >= END:
            root = hz(chord[0] - 24)
            for e in range(8):
                note = sine(root, BEAT / 2 * 0.9) * 0.55 + saw(root, BEAT / 2 * 0.9) * 0.08
                note *= adsr(len(note), 0.005, 0.04)
                place(L, note, t0 + e * BEAT / 2)
                place(R, note, t0 + e * BEAT / 2)
        # drums (a light pulse under the hook, full kit from the drop)
        if 2 <= b < DROP:
            for k in (0, 2):
                place(L, kick * 0.45, t0 + k * BEAT)
                place(R, kick * 0.45, t0 + k * BEAT)
        if DROP <= b < END - 1:
            for k in range(4):
                place(L, kick * 0.9, t0 + k * BEAT)
                place(R, kick * 0.9, t0 + k * BEAT)
                if k in (1, 3):
                    place(L, clap * 0.35, t0 + k * BEAT)
                    place(R, clap * 0.35, t0 + k * BEAT)
            for e in range(8):
                g = 0.18 if e % 2 else 0.1
                place(L, hat * g, t0 + e * BEAT / 2)
                place(R, hat * g * 0.8, t0 + e * BEAT / 2 + 0.004)
        # arp from bar 5 to 18
        if DROP + 3 <= b < END - 1:
            notes = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24]
            for e in range(8):
                f = hz(notes[e % 4])
                pl = (sine(f, 0.22) + 0.3 * sine(f * 2, 0.22)) * np.exp(-np.arange(n(0.22)) / SR * 14) * 0.07
                (place(L, pl, t0 + e * BEAT / 2) if e % 2 else place(R, pl, t0 + e * BEAT / 2))
    # risers before the drop (bar 2) and before the end (bar 20)
    for start in ((DROP - 1) * BAR, (END - 1) * BAR):
        r = rng.normal(0, 1, n(BAR))
        r = lowpass(r, 3000) * np.linspace(0, 1, n(BAR)) ** 2 * 0.25
        place(L, r, start)
        place(R, r, start)
    # impacts on the drop and on the logo at the end
    imp_t = np.arange(n(1.6)) / SR
    impact = (np.sin(2 * math.pi * (38 + 60 * np.exp(-imp_t * 8)) * imp_t) * np.exp(-imp_t * 2.6) * 0.9
              + lowpass(rng.normal(0, 1, n(1.6)), 1800) * np.exp(-imp_t * 4) * 0.4)
    for at in (DROP * BAR, END * BAR):
        place(L, impact, at)
        place(R, impact, at)
    mix = np.stack([L, R])
    mix /= np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix * 1.4) / np.tanh(1.4) * 0.9
    fade = n(2.5)
    mix[:, -fade:] *= np.linspace(1, 0, fade)
    write("music.wav", mix, stereo=True)
    print("music", total, "s")


def sfx():
    rng = np.random.default_rng(5)
    t = np.arange(n(0.06)) / SR
    write("click.wav", (np.sin(2 * math.pi * 2200 * t) * 0.6 + rng.normal(0, 0.2, len(t))) * np.exp(-t * 110) * 0.7)
    t = np.arange(n(0.5)) / SR
    noise = lowpass(rng.normal(0, 1, len(t)), 2500)
    write("swoosh.wav", noise * np.sin(np.pi * np.linspace(0, 1, len(t))) ** 2 * 1.4)
    t = np.arange(n(0.25)) / SR
    write("tick.wav", np.sin(2 * math.pi * (900 + 600 * np.exp(-t * 30)) * t) * np.exp(-t * 26) * 0.6)


def voice():
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    lengths = {}
    for key, text in LINES.items():
        s, sr = k.create(text, voice=VOICE, speed=1.02, lang="en-us")
        s = np.asarray(s, dtype=np.float64)
        if sr != SR:  # resample with linear interpolation to the project rate
            x = np.linspace(0, len(s) - 1, int(len(s) * SR / sr))
            s = np.interp(x, np.arange(len(s)), s)
        # trim silence, then level
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, idx[0] - 400) : idx[-1] + 2000] if len(idx) else s
        s = s / (np.max(np.abs(s)) + 1e-9)
        s = np.tanh(s * 2.0) / np.tanh(2.0) * 0.92
        write(f"vo_{key}.wav", s)
        lengths[key] = round(len(s) / SR, 3)
        print("voice", key, lengths[key])
    with open(os.path.join(SRC, "launch-vo.json"), "w") as f:
        json.dump(lengths, f, indent=1)
    # older lines are kept on disk; the edit reads only the ids it uses


if __name__ == "__main__":
    sfx()
    music()
    voice()
