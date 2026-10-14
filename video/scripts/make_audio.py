"""Builds every sound for the RENYXERA film: voiceover (edge-tts), music and effects (generated here, so no licence to track).

    pip install edge-tts mutagen numpy
    python video/scripts/make_audio.py

Writes video/public/audio/*.mp3|wav and video/src/vo.json (the length of every voice line, which sets the scene timing).
"""
import asyncio
import json
import math
import os
import struct
import subprocess
import wave

import numpy as np
import edge_tts
from mutagen.mp3 import MP3

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "audio")
SRC = os.path.join(HERE, "..", "src")
os.makedirs(OUT, exist_ok=True)
VOICE = "en-IN-NeerjaNeural"
SR = 44100

# Spoken text. "Renixera" is the draft pronunciation of RENYXERA: confirm it with the owner.
LINES = {
    "p1": "Too many tabs. Too many P D Fs. And still, you are not sure what to study next.",
    "r1": "Renixera brings your GATE preparation into one calm place.",
    "s1": "Pick a section, a subject and a topic, and your practice set is ready in seconds.",
    "q1": "Solve real GATE questions in an exam style screen, with a timer and a virtual calculator.",
    "a1": "Then see exactly how you did, so the next session starts with a clear target.",
    "c1": "A study planner built around your free hours. Reminders on Telegram. An A I mentor when you are stuck. And analytics that point at weak topics.",
    "t1": "Free tools too. Official GATE twenty twenty six cut offs for six papers, a score calculator, and General Aptitude lessons.",
    "m1": "Start free. Plus is twenty nine rupees a month. One payment, no auto renewal.",
    "e1": "Renixera. A new era of intelligent learning. Start your next practice session today.",
    "h1": "Too many tabs for one exam?",
    "h2": "Practise real GATE questions, and see exactly where you stand.",
    "h3": "Start free with Renixera.",
}


async def voice():
    durations = {}
    for key, text in LINES.items():
        path = os.path.join(OUT, f"vo_{key}.mp3")
        await edge_tts.Communicate(text, VOICE, rate="-4%").save(path)
        durations[key] = round(MP3(path).info.length, 3)
        print("voice", key, durations[key])
    with open(os.path.join(SRC, "vo.json"), "w") as f:
        json.dump(durations, f, indent=1)


FFMPEG = os.path.join(HERE, "..", "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe")


def normalize_voices():
    """Remotion cannot amplify above 1.0, so each voice line is decoded and peak-normalised to about -2 dBFS here."""
    for key in LINES:
        src = os.path.join(OUT, f"vo_{key}.mp3")
        tmp = os.path.join(OUT, f"_{key}.wav")
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SR), tmp], check=True)
        with wave.open(tmp) as w:
            d = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768
        os.remove(tmp)
        d = d / (np.max(np.abs(d)) + 1e-9)
        d = np.tanh(d * 2.4) / np.tanh(2.4) * 0.9  # gentle compression: raises the average level without clipping
        write_wav(f"vo_{key}.wav", d)
        print("normalised", key)


def write_wav(name, data):
    data = np.clip(data, -1, 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype("<i2").tobytes())


def env(n, a=0.005, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] = np.linspace(1, 0, nr)
    return e


def tone(freq, dur, kind="sine", vol=1.0):
    t = np.arange(int(round(dur * SR))) / SR
    if kind == "tri":
        w = 2 / math.pi * np.arcsin(np.sin(2 * math.pi * freq * t))
    else:
        w = np.sin(2 * math.pi * freq * t)
    return w * vol


def sfx():
    rng = np.random.default_rng(7)
    # click: a short, soft tick
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    click = (np.sin(2 * math.pi * 1800 * t) * 0.5 + rng.normal(0, 0.15, n)) * np.exp(-t * 90)
    write_wav("sfx_click.wav", click * 0.6)
    # pop: low blip for chips and cards
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    write_wav("sfx_pop.wav", np.sin(2 * math.pi * (420 + 380 * np.exp(-t * 28)) * t) * np.exp(-t * 22) * 0.7)
    # whoosh: filtered noise swept upwards
    n = int(0.7 * SR)
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    y = 0.0
    for i in range(n):
        k = 0.02 + 0.55 * (i / n) ** 2
        y += k * (noise[i] - y)
        out[i] = y
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    write_wav("sfx_whoosh.wav", out * shape * 1.6)
    # chime: two soft bell notes
    a = tone(784, 0.9, "sine", 0.5); a = a * np.exp(-np.arange(len(a)) / SR * 3.2)
    b = tone(1175, 0.9, "sine", 0.35); b = b * np.exp(-np.arange(len(b)) / SR * 3.6)
    ch = np.zeros(int(1.2 * SR))
    ch[: len(a)] += a
    off = int(0.12 * SR)
    ch[off : off + len(b)] += b
    write_wav("sfx_chime.wav", ch * 0.6)


def music(seconds=100, bpm=100):
    n = int(seconds * SR)
    out = np.zeros(n)
    beat = 60 / bpm
    chords = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]  # Am F C G
    bar = beat * 4
    for i in range(int(seconds / bar) + 1):
        ch = chords[i % 4]
        start = int(i * bar * SR)
        length = int(round((bar + 0.4) * SR))
        seg = np.zeros(length)
        for f in ch:
            for d in (-0.6, 0.6):  # slight detune for width
                seg += tone(f * 0.5 + d, length / SR, "tri", 0.07)[:length]
            seg += tone(f, length / SR, "sine", 0.05)[:length]
        seg *= env(length, 0.35, 0.5)
        end = min(n, start + length)
        out[start:end] += seg[: end - start]
    # pulse (soft kick) from 5 s, hat ticks from 14 s, plucks from 24 s
    rng = np.random.default_rng(3)
    t_kick = np.arange(int(0.28 * SR)) / SR
    kick = np.sin(2 * math.pi * (52 + 70 * np.exp(-t_kick * 26)) * t_kick) * np.exp(-t_kick * 11) * 0.45
    hat = rng.normal(0, 1, int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR * 130) * 0.05
    scale = [440.0, 523.25, 659.25, 783.99, 659.25, 523.25]
    for b in range(int(seconds / beat)):
        s = b * beat
        i0 = int(s * SR)
        if s >= 5 and b % 2 == 0 and i0 + len(kick) < n:
            out[i0 : i0 + len(kick)] += kick
        if s >= 14:
            for half in (0, 0.5):
                j = int((s + half * beat) * SR)
                if j + len(hat) < n:
                    out[j : j + len(hat)] += hat
        if s >= 24:
            f = scale[b % len(scale)]
            pl = tone(f, 0.5, "sine", 0.06); pl = pl * np.exp(-np.arange(len(pl)) / SR * 7)
            j = int((s + 0.5 * beat) * SR)
            if j + len(pl) < n:
                out[j : j + len(pl)] += pl
    out[: int(1.5 * SR)] *= np.linspace(0.0, 1.0, int(1.5 * SR))
    out[-int(3 * SR) :] *= np.linspace(1.0, 0.0, int(3 * SR))
    out = out / (np.sqrt(np.mean(out**2)) + 1e-9) * 0.13  # about -18 dBFS RMS: the pad is quiet next to the kick, so level by RMS
    out = np.tanh(out * 1.6) / 1.6
    write_wav("music.wav", out)


if __name__ == "__main__":
    sfx()
    music()
    if not os.environ.get("SKIP_TTS"):
        asyncio.run(voice())
    normalize_voices()
    print("done")
