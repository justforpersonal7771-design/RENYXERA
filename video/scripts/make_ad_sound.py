"""Voice-over, music and effects for the RENYXERA ad, mixed into one track per format.
  python video/scripts/make_ad_sound.py V            # vertical  -> video/public/audio/ad-vertical.wav
  python video/scripts/make_ad_sound.py H            # landscape -> video/public/audio/ad-landscape.wav
  python video/scripts/make_ad_sound.py V --voice    # also re-generate the voice lines (otherwise cached)

Voice: Kokoro (Apache-2.0 weights, runs locally on the CPU, commercial use allowed), one short clip per line, placed on the scene timeline.
Music: composed in code (Am F C G, 120 BPM): pad, bass, plucked arpeggio, kick, snare and hats, with a deliberate DROP during the silent
"11:47 PM" beat and a hard return on "Until now". No samples, no copyright. The music ducks under the voice (side-chain).
Scene times must match video/src/Ad.tsx (SCENES_V / SCENES_H).
"""
import json
import math
import os
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "..", "public", "audio")
VODIR = os.path.join(PUB, "vo")
MODELS = os.path.join(HERE, "..", "models")
os.makedirs(VODIR, exist_ok=True)
SR, BPM = 44100, 120
BEAT = 60.0 / BPM
VOICE = "af_heart"
fmt = (sys.argv[1] if len(sys.argv) > 1 else "V").upper()
REGEN = "--voice" in sys.argv
DUR = 75.0
rng = np.random.default_rng(23)

# ---- scene starts (seconds), same as the film (SCENES_V / SCENES_H in video/src/Ad.tsx) ----
if fmt == "V":
    S = dict(hook=0.0, loop=3.5, night=9.5, until=14.0, mentor=18.0, papers=28.0, forge=36.0, plans=45.0, stack=58.0, cta=68.0)
    OUT = "ad-vertical.wav"
else:
    S = dict(hook=0.0, loop=4.0, night=10.0, until=14.0, mentor=18.0, papers=28.0, forge=36.0, plans=45.0, stack=58.0, cta=68.0)
    OUT = "ad-landscape.wav"
SLAM = 64.0  # "Understand." slams over "Wrong."

# ---- voice lines: id -> spoken text ----
LINES = {
    "hook_v": "One wrong answer costs you marks.",
    "hook_h": "One guess. Marks gone.",
    "w1": "Solve.", "w2": "Check the key.", "w3": "Wrong.", "w4": "Again.",
    "n1": "Eleven forty-seven.", "n2": "You know the answer is C.", "n3": "But nobody tells you why.",
    "until": "Until now.",
    "m1": "Meet your AI Mentor.",
    "m2": "It explains your mistake, step by step.",
    "m3": "It explains exactly why.",
    "p1": "Ten years of official GATE papers.",
    "p2": "Inside an exam-identical simulator.",
    "f1": "Run out of past papers?",
    "f2": "Over three hundred original questions.",
    "f3": "Inside the Forge.",
    "pl0": "Want more power?",
    "pl1": "Unlock Plus and Pro.",
    "pl2": "A hundred and fifty AI requests a day. Unlimited Forge. Offline downloads.",
    "pl3": "Plus from twenty-nine rupees a month.",
    "s1a": "Solve.", "s1b": "Check.", "s1c": "Wrong.",
    "s2": "Understand.",
    "s3": "With your AI Mentor.",
    "c1": "Official papers, free forever.",
    "c2_v": "Start free. Upgrade when ready. Link in bio.",
    "c2_h": "Start free. Upgrade when ready.",
}
if fmt == "V":
    PLACE = {"hook_v": 0.2, "w1": 3.55, "w2": 5.05, "w3": 6.55, "w4": 8.05, "n1": 9.65, "n2": 11.05, "n3": 12.5, "until": 14.35}
else:
    PLACE = {"hook_h": 0.2, "w1": 4.05, "w2": 5.55, "w3": 7.05, "w4": 8.55, "n1": 10.15, "n2": 11.55, "n3": 12.95, "until": 14.5}
PLACE.update({"m1": 18.2, "m2": 24.1, "m3": 26.7, "p1": 28.35, "p2": 32.2, "f1": 36.2, "f2": 40.2, "f3": 42.4,
              "pl0": 45.3, "pl1": 48.3, "pl2": 50.9, "pl3": 55.95,
              "s1a": 58.1, "s1b": 60.1, "s1c": 62.1, "s2": SLAM, "s3": 66.1, "c1": 68.25})
PLACE.update({"c2_v": 71.3} if fmt == "V" else {"c2_h": 71.3})
ORDER = sorted(PLACE, key=lambda k: PLACE[k])
LINES = {k: v for k, v in LINES.items() if k in PLACE}


def load_wav(path):
    with wave.open(path, "rb") as w:
        raw = w.readframes(w.getnframes())
        return np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768.0


def save_wav(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def synth_voice(k, key, text, speed):
    s, sr = k.create(text, voice=VOICE, speed=speed, lang="en-us")
    s = np.asarray(s, dtype=np.float64)
    if sr != SR:
        s = np.interp(np.linspace(0, len(s) - 1, int(len(s) * SR / sr)), np.arange(len(s)), s)
    idx = np.where(np.abs(s) > 0.01)[0]
    s = s[max(0, idx[0] - 300): idx[-1] + 1500] if len(idx) else s
    s = s / (np.max(np.abs(s)) + 1e-9)
    return np.tanh(s * 2.0) / np.tanh(2.0) * 0.92


def voices():
    path = lambda key: os.path.join(VODIR, f"ad_{key}.wav")
    need = [k for k in LINES if REGEN or not os.path.exists(path(k))]
    clips = {}
    if need:
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
        for key in need:
            sp = 1.0 if len(LINES[key].split()) <= 2 else 1.06  # one-word punches stay unhurried
            save_wav(path(key), synth_voice(k, key, LINES[key], sp))
            print("voice", key, f"{len(load_wav(path(key))) / SR:.2f}s")
    for key in LINES:
        clips[key] = load_wav(path(key))
    # a line must finish before the next one starts: if not, say so (the line text should be shortened)
    for a, b in zip(ORDER, ORDER[1:]):
        end = PLACE[a] + len(clips[a]) / SR
        if end > PLACE[b] - 0.04:
            print(f"WARNING: voice line '{a}' ends at {end:.2f}s, after '{b}' starts at {PLACE[b]:.2f}s: shorten the line")
    return clips


# ---------------- instruments ----------------
n = int(SR * DUR)
t_all = np.arange(n) / SR


def place(buf, t0, sig, g=1.0):
    i = int(t0 * SR)
    j = min(len(buf), i + len(sig))
    if 0 <= i < len(buf):
        buf[i:j] += g * sig[: j - i]


def env_adsr(length, a, r):
    k = np.arange(int(SR * length)) / SR
    return np.minimum(1, k / max(a, 1e-3)) * np.minimum(1, np.maximum(0, (length - k)) / max(r, 1e-3))


def kick():
    k = np.arange(int(SR * 0.28)) / SR
    return np.sin(2 * np.pi * np.cumsum(120 * np.exp(-k * 22) + 46) / SR) * np.exp(-k * 11)


def snare():
    k = np.arange(int(SR * 0.22)) / SR
    return (rng.standard_normal(len(k)) * 0.5 + np.sin(2 * np.pi * 190 * k) * 0.6) * np.exp(-k * 20)


def hat(length=0.05):
    k = np.arange(int(SR * length)) / SR
    x = rng.standard_normal(len(k))
    return (x - np.convolve(x, np.ones(8) / 8, mode="same")) * np.exp(-k * 90)


def pluck(freq, length=0.22):
    k = np.arange(int(SR * length)) / SR
    return (np.sin(2 * np.pi * freq * k) + 0.35 * np.sin(4 * np.pi * freq * k) + 0.15 * np.sin(6 * np.pi * freq * k)) * np.exp(-k * 16)


def bass(freq, length):
    k = np.arange(int(SR * length)) / SR
    return (np.sin(2 * np.pi * freq * k) + 0.3 * np.sin(4 * np.pi * freq * k)) * np.exp(-k * 3.2) * np.minimum(1, k / 0.01)


def pad(freqs, length, g):
    k = np.arange(int(SR * length)) / SR
    out = np.zeros(len(k))
    for f in freqs:
        for det in (0.996, 1.0, 1.004):
            out += np.sin(2 * np.pi * f * det * k) + 0.4 * np.sin(2 * np.pi * f * 2 * det * k)
    return out * env_adsr(length, 0.35, 0.5) * g / (len(freqs) * 3)


def hit(length=1.2):
    k = np.arange(int(SR * length)) / SR
    return np.sin(2 * np.pi * (80 * np.exp(-k * 3) + 34) * k) * np.exp(-k * 2.4) + 0.2 * rng.standard_normal(len(k)) * np.exp(-k * 6)


def swell(length, g=1.0):
    k = np.arange(int(SR * length)) / SR
    x = rng.standard_normal(len(k))
    x = np.convolve(x, np.ones(6) / 6, mode="same")
    return x * (k / length) ** 2 * 0.3 * g


def whoosh(length=0.35):
    k = np.arange(int(SR * length)) / SR
    x = np.convolve(rng.standard_normal(len(k)), np.ones(14) / 14, mode="same")
    return x * np.sin(np.pi * k / length) ** 2 * 0.5


def click():
    k = np.arange(int(SR * 0.04)) / SR
    return np.sin(2 * np.pi * 1500 * k) * np.exp(-k * 120) * 0.5


def tick():
    k = np.arange(int(SR * 0.05)) / SR
    return np.sin(2 * np.pi * 1800 * k) * np.exp(-k * 90) * 0.5


def chime(freq=1318.5):
    k = np.arange(int(SR * 1.1)) / SR
    return (np.sin(2 * np.pi * freq * k) + 0.5 * np.sin(2 * np.pi * freq * 1.5 * k)) * np.exp(-k * 3.5) * 0.4


# Am F C G, one bar (2 s) each
CH = [
    dict(root=55.0, tones=[110.0, 130.81, 164.81]),
    dict(root=43.65, tones=[87.31, 110.0, 130.81]),
    dict(root=65.41, tones=[130.81, 164.81, 196.0]),
    dict(root=49.0, tones=[98.0, 123.47, 146.83]),
]


def music():
    drums = np.zeros(n)
    harm = np.zeros(n)
    bar = 2.0
    nbars = int(DUR / bar) + 1
    # tonal layers: pad, bass, arp per bar, switched by section
    for b in range(nbars):
        t0 = b * bar
        ch = CH[b % 4]
        in_drop = S["night"] <= t0 < S["until"]
        pre = t0 < S["loop"]
        # pad: always, quieter in the hook, thinner in the drop
        place(harm, t0, pad([f * 2 for f in ch["tones"]], bar + 0.4, 0.5 if not in_drop else 0.8), 0.55 if pre else 1.0)
        if in_drop:
            continue
        if t0 >= S["loop"]:
            # bass on beat 1 and the "and" of beat 2
            place(harm, t0, bass(ch["root"] * 1.0, 0.9), 0.55)
            place(harm, t0 + 1.5 * BEAT, bass(ch["root"] * 1.0, 0.6), 0.4)
            # plucked arpeggio on eighth notes
            for e in range(8):
                f = ch["tones"][[0, 1, 2, 1, 0, 2, 1, 2][e]] * 4
                place(harm, t0 + e * BEAT / 2, pluck(f), 0.16 if t0 < S["until"] else 0.2)
    # drums: from the loop, not in the drop, not under the end card
    for i in range(int(DUR / BEAT)):
        t = i * BEAT
        if t < S["loop"] or S["night"] <= t < S["until"] or t >= S["cta"]:
            continue
        place(drums, t, kick(), 0.8)
        place(drums, t + BEAT / 2, hat(), 0.14)
        if i % 4 in (1, 3) and t >= S["until"]:
            place(drums, t, snare(), 0.45)
    # accents
    acc = np.zeros(n)
    place(acc, 0.0, hit(1.4), 0.95)                                  # boom on frame 0
    place(acc, S["loop"] - 0.45, swell(0.45, 1.0))
    place(acc, S["night"], pad([110.0, 164.81], S["until"] - S["night"] + 0.2, 0.7), 0.7)   # the drop: a quiet low pad
    t = S["night"] + 0.25
    while t < S["until"] - 0.2:
        place(acc, t, tick(), 0.55)
        t += 0.5
    place(acc, S["until"] - 0.6, swell(0.6, 1.2))
    place(acc, S["until"], hit(1.6), 1.0)                            # the return
    for key, t0 in S.items():
        if key in ("hook", "night", "until"):
            continue
        place(acc, t0, hit(0.6), 0.4)
        place(acc, t0 - 0.12, whoosh(0.3), 0.5)
    for k, fr in enumerate((784.0, 987.8, 1174.7)):                  # "level-up" chimes as each Pro feature pops in
        place(acc, 51.0 + 1.4 * k, chime(fr), 0.8)
    place(acc, 56.0, chime(2093.0), 0.9)                              # coin chime on the price line
    place(acc, SLAM - 0.7, swell(0.7, 1.3))                           # riser into the slam, then the heavy hit
    place(acc, SLAM, hit(1.1), 1.0)
    place(acc, S["cta"], hit(0.9), 0.6)
    place(acc, S["cta"] + 3.0, hit(1.8), 0.9)
    place(acc, S["cta"] + 3.4, chime(), 0.8)
    # interface sounds in the Mentor scene: the wrong tap (21.2 s), the stamp, typing as the answer appears, then the success chime when B turns green (27.0 s)
    r = S["mentor"]
    place(acc, r + 96 / 30, click(), 1.0)
    place(acc, r + 101 / 30, hit(0.35), 0.5)
    for dt in (178 / 30, 196 / 30, 216 / 30, 227 / 30):
        place(acc, r + dt, click(), 0.5)
    place(acc, r + 270 / 30, chime(1568.0), 0.9)
    return drums, harm, acc


def sidechain(vo, depth=0.6):
    env = np.abs(vo)
    env = np.convolve(env, np.ones(int(SR * 0.012)) / int(SR * 0.012), mode="same")
    env = np.clip(env / 0.12, 0, 1)
    env = np.convolve(env, np.ones(int(SR * 0.22)) / int(SR * 0.22), mode="same")  # soft attack and release
    return 1.0 - depth * np.clip(env * 1.4, 0, 1)


def main():
    clips = voices()
    vo = np.zeros(n)
    for key, t0 in PLACE.items():
        place(vo, t0, clips[key], 1.0)
    drums, harm, acc = music()
    duck = sidechain(vo)
    bed = (drums * 0.9 + harm * 0.8) * duck + acc * (0.55 + 0.45 * duck)
    mix = bed * 0.6 + vo * 1.0
    mix *= np.minimum(1.0, (DUR - t_all) / 0.6)          # fade out the last 0.6 s
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)               # gentle soft limiter
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.89         # about -1 dBFS peak
    rms = 20 * math.log10(np.sqrt(np.mean(mix ** 2)) + 1e-9)
    save_wav(os.path.join(PUB, OUT), mix)
    json.dump({"format": fmt, "voice": VOICE, "lines": {k: {"at": round(PLACE[k], 2), "text": LINES[k], "dur": round(len(clips[k]) / SR, 2)} for k in ORDER}},
              open(os.path.join(HERE, "..", "src", f"ad-vo-{fmt}.json"), "w"), indent=1)
    print(f"wrote {OUT}  rms {rms:.1f} dBFS  (voice lines: {len(PLACE)})")


if __name__ == "__main__":
    main()
