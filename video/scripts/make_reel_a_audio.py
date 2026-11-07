"""Synthesises the backing track for film A ("5 topics = 14 of 100 marks"): 120 BPM, 18 s, no samples and no copyright.
Kick on every beat, hats on the off-beats, a bass note per bar, a riser into the first hit and a long tail on the last one.
Writes video/public/audio/reel-a-beat.wav (mono, 44.1 kHz, 16-bit). Run: python video/scripts/make_reel_a_audio.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
BPM = 120
DUR = 18.0
BEAT = 60.0 / BPM
n = int(SR * DUR)
t = np.arange(n) / SR
out = np.zeros(n)
rng = np.random.default_rng(7)  # seeded: the track is the same every run


def add(start: float, sig: np.ndarray, gain: float = 1.0) -> None:
    i = int(start * SR)
    j = min(n, i + len(sig))
    if i < n:
        out[i:j] += gain * sig[: j - i]


def kick(length: float = 0.28) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    f = 120 * np.exp(-k * 22) + 42  # pitch drops from ~160 Hz to 42 Hz
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-k * 11)


def hat(length: float = 0.06) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    noise = rng.standard_normal(len(k))
    hp = noise - np.convolve(noise, np.ones(8) / 8, mode="same")  # crude high-pass
    return hp * np.exp(-k * 70)


def bass(freq: float, length: float) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    return (np.sin(2 * np.pi * freq * k) + 0.3 * np.sin(4 * np.pi * freq * k)) * np.exp(-k * 3.0)


def hit(length: float = 1.6) -> np.ndarray:
    k = np.arange(int(SR * length)) / SR
    boom = np.sin(2 * np.pi * (70 * np.exp(-k * 3) + 35) * k) * np.exp(-k * 2.2)
    return boom + 0.25 * rng.standard_normal(len(k)) * np.exp(-k * 5)


beats = int(DUR / BEAT)
roots = [55.0, 55.0, 65.41, 49.0]  # A1 A1 C2 G1: one root per bar
for b in range(beats):
    s = b * BEAT
    if b >= 4:  # the first two seconds are a riser only, so the hook has room
        add(s, kick(), 0.8)
        add(s + BEAT / 2, hat(), 0.18)
        if b % 4 == 0:
            add(s, bass(roots[(b // 4) % 4], BEAT * 4), 0.35)
# riser into beat 4: filtered noise rising in level and pitch
r = int(SR * 2.0)
rk = np.arange(r) / SR
noise = rng.standard_normal(r)
rise = noise * (rk / 2.0) ** 2 * 0.22
rise += np.sin(2 * np.pi * (200 + 900 * (rk / 2.0) ** 2) * rk) * (rk / 2.0) ** 2 * 0.12
out[:r] += rise
add(2.0 - 0.0, hit(0.9), 0.55)  # beat 4 = 2.0 s: the first topic slams in
add(10.0, hit(1.2), 0.7)        # rank 1 at 10.0 s
add(13.0, hit(1.0), 0.6)        # the total at 13.0 s
add(16.0, hit(2.0), 0.9)        # end card at 16.0 s, rings out to 18 s

out *= np.minimum(1.0, (DUR - t) / 0.4)  # 0.4 s fade at the very end
peak = np.max(np.abs(out)) or 1.0
out = out / peak * 0.89  # about -1 dBFS peak
pcm = (out * 32767).astype(np.int16)
dest = Path(__file__).resolve().parent.parent / "public" / "audio" / "reel-a-beat.wav"
dest.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dest), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", dest, f"{DUR:.1f}s", f"peak {20 * np.log10(np.max(np.abs(out))):.1f} dBFS")
