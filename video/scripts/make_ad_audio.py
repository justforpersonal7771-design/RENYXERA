"""Synthesises the sound for the RENYXERA ad (docs/growth/marketing/AD-CREATIVE-BRIEF.md). No samples, no copyright, same result every run.
Dynamics on purpose: a boom at frame 0, a beat from the second scene, a DROP (drums stop, a quiet clock tick) during "11:47 PM. Nobody to ask why.",
then a big hit and the full beat on "Until now". Every scene start gets an accent. Usage: python video/scripts/make_ad_audio.py V|H
Writes video/public/audio/ad-vertical.wav or ad-landscape.wav (mono, 44.1 kHz, 16-bit).
"""
import sys
import wave
from pathlib import Path

import numpy as np

fmt = (sys.argv[1] if len(sys.argv) > 1 else "V").upper()
# scene start times in seconds: must match SCENES in video/src/Ad.tsx
if fmt == "V":
    S = dict(hook=0.0, loop=2.0, night=6.0, until=8.0, reveal=10.0, papers=17.0, forge=19.0, stack=21.0, cta=25.0)
else:
    S = dict(hook=0.0, loop=2.0, night=6.0, until=8.0, reveal=10.0, papers=17.0, forge=19.0, battle=21.0, stack=23.5, cta=26.5)
DUR, name = 30.0, ("ad-vertical.wav" if fmt == "V" else "ad-landscape.wav")
SR, BPM = 44100, 120
BEAT = 60.0 / BPM
n = int(SR * DUR)
out = np.zeros(n)
rng = np.random.default_rng(11)


def add(t0: float, sig: np.ndarray, g: float = 1.0) -> None:
    i = int(t0 * SR)
    j = min(n, i + len(sig))
    if 0 <= i < n:
        out[i:j] += g * sig[: j - i]


def kick() -> np.ndarray:
    k = np.arange(int(SR * 0.26)) / SR
    return np.sin(2 * np.pi * np.cumsum(115 * np.exp(-k * 24) + 44) / SR) * np.exp(-k * 12)


def hat() -> np.ndarray:
    k = np.arange(int(SR * 0.05)) / SR
    x = rng.standard_normal(len(k))
    return (x - np.convolve(x, np.ones(8) / 8, mode="same")) * np.exp(-k * 80)


def tick() -> np.ndarray:  # a quiet wooden clock tick
    k = np.arange(int(SR * 0.05)) / SR
    return np.sin(2 * np.pi * 1800 * k) * np.exp(-k * 90) * 0.5


def bass(freq: float, length: float) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    return (np.sin(2 * np.pi * freq * k) + 0.25 * np.sin(4 * np.pi * freq * k)) * np.exp(-k * 2.4)


def hit(length: float = 1.2) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    return np.sin(2 * np.pi * (80 * np.exp(-k * 3) + 34) * k) * np.exp(-k * 2.4) + 0.2 * rng.standard_normal(len(k)) * np.exp(-k * 6)


def swell(length: float) -> np.ndarray:  # rising noise into a hit
    k = np.arange(int(SR * length)) / SR
    return rng.standard_normal(len(k)) * (k / length) ** 2 * 0.2


def pad(freq: float, length: float, g: float) -> np.ndarray:  # quiet sustained chord tone for the drop
    k = np.arange(int(SR * length)) / SR
    env = np.minimum(1, k / 0.6) * np.minimum(1, (length - k) / 0.6)
    return (np.sin(2 * np.pi * freq * k) + np.sin(2 * np.pi * freq * 1.5 * k) * 0.6) * env * g


roots = [55.0, 55.0, 65.41, 49.0]
beats = int(DUR / BEAT)
for b in range(beats):
    t = b * BEAT
    in_drop = S["night"] <= t < S["until"]
    if in_drop or t < S["loop"]:
        continue  # no drums in the hook or in the drop
    add(t, kick(), 0.8)
    add(t + BEAT / 2, hat(), 0.16)
    if (b % 4) == 0:
        add(t, bass(roots[(b // 4) % 4], BEAT * 4), 0.33)

# hook: boom at frame 0 with a short swell into the first beat
add(0.0, hit(1.4), 0.9)
add(S["loop"] - 0.5, swell(0.5), 0.8)
# the drop: pad plus a clock tick every half second
add(S["night"], pad(110.0, S["until"] - S["night"], 0.09), 1.0)
t = S["night"] + 0.25
while t < S["until"] - 0.25:
    add(t, tick(), 0.5)
    t += 0.5
# the return: a swell then the biggest hit
add(S["until"] - 0.6, swell(0.6), 1.0)
add(S["until"], hit(1.6), 1.0)
# an accent on every other scene start
for key, t0 in S.items():
    if key in ("hook", "night", "until"):
        continue
    add(t0, hit(0.7), 0.5)
# the slam-replacement ("Wrong." becomes "Understand.") gets its own heavy hit, as the reference ad does for "Done." / "Earn."
add(S["stack"] + (1.67 if fmt == "H" else 2.07), hit(1.0), 1.0)
add(S["cta"], pad(220.0, DUR - S["cta"], 0.12), 1.0)  # a warm tail under the end card

out *= np.minimum(1.0, (DUR - np.arange(n) / SR) / 0.5)  # 0.5 s fade at the very end
out = out / (np.max(np.abs(out)) or 1.0) * 0.89  # about -1 dBFS peak
dest = Path(__file__).resolve().parent.parent / "public" / "audio" / name
dest.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dest), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("wrote", dest, f"{DUR:.0f}s")
