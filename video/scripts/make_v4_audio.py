"""Voice, word timings, music and effects for the RENYXERA film v4.

    pip install kokoro-onnx soundfile numpy faster-whisper
    python video/scripts/make_v4_audio.py voice     # Kokoro lines + per-word timings -> src/v4-vo.json
    python video/scripts/make_v4_audio.py music     # needs src/v4-timeline.json (written by the film from the timings)

The script text is the single source of truth for on-screen words: each line is spoken by Kokoro, then aligned word by
word with faster-whisper so the film can reveal every word on the frame it is spoken.
"""
import json
import math
import os
import re
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "v4")
SRC = os.path.join(HERE, "..", "src")
MODELS = os.path.join(HERE, "..", "models")
os.makedirs(OUT, exist_ok=True)
SR = 44100
VOICE = "af_heart"

# id: (text shown on screen, text spoken). They differ only where pronunciation needs help.
LINES = {
    "p1": ("It's past midnight. You're still solving.", None),
    "p2": ("Every day starts with the same question. What do I study today?", None),
    "p3": ("You get one wrong. And there's no one to ask why.", None),
    "p4": ("So it happens again. In the next mock test.", None),
    "p5": ("Over two lakh students wrote GATE CS this year.", "Over two lakh students wrote GATE C S this year."),
    "p6": ("Fewer than one in five qualified.", None),
    "p7": ("Effort was never the problem. Direction was.", None),
    "b1": ("What if you had a mentor who never sleeps?", None),
    "b2": ("What if your preparation could think with you?", None),
    "r1": ("Meet RENYXERA.", "Meet Renixera."),
    "r2": ("Your AI mentor for GATE. Practise. Understand. Improve.", "Your AI mentor for GATE. Practise. Understand. Improve."),
    "a1": ("It knows where you are, every single day.", None),
    "a2": ("Remember that question? Now you can ask why.", None),
    "a3": ("It explains your exact mistake, step by step. Eight expert coaches, awake at 1 AM.", "It explains your exact mistake, step by step. Eight expert coaches, awake at one A M."),
    "a4": ("It reads every attempt, finds your weak spots, and tells you exactly what to do next.", None),
    "a5": ("Every mistake is saved, and comes back right before you'd forget it.", None),
    "a6": ("2,400 official GATE questions, in a real exam screen.", "Two thousand four hundred official GATE questions, in a real exam screen."),
    "a7": ("See exactly where your marks are leaking.", None),
    "a8": ("Every week, one challenge for everyone. See where you rank.", None),
    "a9": ("A plan that fits your day. And a nudge on Telegram when you slip.", None),
    "a10": ("Watch yourself level up.", None),
    "m1": ("Go further with Plus. Go all in with Pro.", None),
    "m2": ("Your AI mentor, from less than a cup of chai a week.", "Your AI mentor, from less than a cup of chai a week."),
    "c1": ("Over five lakh students sit these five GATE papers every year.", None),
    "c2": ("RENYXERA practises with them, explains, remembers, and plans.", "Renixera practises with them, explains, remembers, and plans."),
    "c3": ("Effort, now with direction.", None),
    "c4": ("Start using RENYXERA now, and turn every hour into real progress.", "Start using Renixera now, and turn every hour into real progress."),
}


def write(name, x, stereo=False):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(((x.T.reshape(-1) if stereo else x) * 32767).astype("<i2").tobytes())


def n(sec):
    return int(round(sec * SR))


def voice():
    from kokoro_onnx import Kokoro
    from faster_whisper import WhisperModel
    k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    asr = WhisperModel("small.en", device="cpu", compute_type="int8")
    out = {}
    for key, (shown, spoken) in LINES.items():
        s, sr = k.create(spoken or shown, voice=VOICE, speed=1.07, lang="en-us")
        s = np.asarray(s, dtype=np.float64)
        if sr != SR:
            s = np.interp(np.linspace(0, len(s) - 1, int(len(s) * SR / sr)), np.arange(len(s)), s)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, idx[0] - 300): idx[-1] + 1500]
        s = s / (np.max(np.abs(s)) + 1e-9)
        s = np.tanh(s * 2.0) / np.tanh(2.0) * 0.9
        write(f"vo_{key}.wav", s)
        dur = len(s) / SR
        # align: whisper word timestamps on the 16 kHz signal, mapped onto the words as written on screen
        a16 = np.interp(np.linspace(0, len(s) - 1, int(len(s) * 16000 / SR)), np.arange(len(s)), s).astype(np.float32)
        segs, _ = asr.transcribe(a16, word_timestamps=True, language="en", beam_size=5)
        raw = [w for sg in segs for w in sg.words]
        # merge fragments whisper splits off ("2" ",400", "a" ".m.") back into one token
        heard = []
        for w in raw:
            if heard and re.match(r"^\s*[,.\-]", w.word):
                heard[-1] = type("W", (), {"word": heard[-1].word + w.word.strip(), "start": heard[-1].start, "end": w.end})
            else:
                heard.append(w)
        words = shown.split()
        times = []
        if len(heard) == len(words):
            times = [round(w.start, 3) for w in heard]
        else:  # different word counts (e.g. "C S" vs "CS", "1 AM"): spread by syllable-ish length between heard start/end
            t0 = heard[0].start if heard else 0.0
            t1 = heard[-1].end if heard else dur
            weights = [max(1, len(re.sub(r"[^A-Za-z0-9]", "", w))) + 2 for w in words]
            acc = t0
            for wgt in weights:
                times.append(round(acc, 3))
                acc += (t1 - t0) * wgt / sum(weights)
        out[key] = {"text": shown, "dur": round(dur, 3), "words": words, "t": times, "heard": " ".join(w.word.strip() for w in heard)}
        print(f"{key:4} {dur:5.2f}s  heard: {out[key]['heard']}")
    with open(os.path.join(SRC, "v4-vo.json"), "w", encoding="utf8") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)


# ---------------- music: piano-led, builds at the reveal ----------------
def lowpass(x, cutoff):
    a = math.exp(-2 * math.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def piano(f, dur, vel=1.0):
    t = np.arange(n(dur)) / SR
    tone = np.zeros_like(t)
    for h, amp in ((1, 1.0), (2, 0.45), (3, 0.22), (4, 0.12), (5, 0.06)):
        tone += amp * np.sin(2 * math.pi * f * h * t * (1 + 0.0004 * h)) * np.exp(-t * (1.3 + 0.9 * h))
    attack = np.minimum(1, t / 0.004)
    return tone * attack * vel * 0.22


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def music():
    tl = json.load(open(os.path.join(SRC, "v4-timeline.json")))
    fps = tl["fps"]
    total = tl["total"] / fps + 2
    reveal = tl["reveal"] / fps
    bridge = tl["bridge"] / fps
    close = tl["close"] / fps
    BPM = 120
    beat = 60 / BPM
    L = np.zeros(n(total))
    R = np.zeros(n(total))
    rng = np.random.default_rng(21)

    def put(clip, at, pan=0.0, gain=1.0):
        i = n(at)
        if i >= len(L):
            return
        j = min(len(L), i + len(clip))
        L[i:j] += clip[: j - i] * gain * (1 - max(0, pan))
        R[i:j] += clip[: j - i] * gain * (1 + min(0, pan))

    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    # Act 1 + bridge: sparse piano, one chord per bar, a soft melody note on beats 1 and 3
    t = 0.0
    bar = 0
    while t < reveal:
        ch = prog[bar % 4]
        for m in ch:
            put(piano(hz(m - 12), 3.5, 0.55), t, pan=-0.2)
        mel = [ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]
        for k in range(4):
            if k in (0, 2) or t > bridge:
                put(piano(hz(mel[k]), 1.6, 0.4), t + k * beat, pan=0.25)
        t += 4 * beat
        bar += 1
    # riser into the reveal
    rl = 2.0
    r = lowpass(rng.normal(0, 1, n(rl)), 3500) * np.linspace(0, 1, n(rl)) ** 2.5 * 0.18
    put(r, reveal - rl)
    # Act 3: warm pad, sub, soft kick, claps, hats, piano arpeggio
    kt = np.arange(n(0.35)) / SR
    kick = np.sin(2 * math.pi * (46 + 100 * np.exp(-kt * 28)) * kt) * np.exp(-kt * 10) * 0.55
    clap = lowpass(rng.normal(0, 1, n(0.16)), 4500) * np.exp(-np.arange(n(0.16)) / SR * 30) * 0.18
    hat = rng.normal(0, 1, n(0.04)) * np.exp(-np.arange(n(0.04)) / SR * 110)
    hat = (hat - lowpass(hat, 7000)) * 0.08
    t = reveal
    bar = 0
    while t < total - 3:
        ch = prog[bar % 4]
        pad = np.zeros(n(4 * beat))
        for m in ch:
            tt = np.arange(len(pad)) / SR
            pad += (np.sin(2 * math.pi * hz(m) * tt) + 0.5 * np.sin(2 * math.pi * hz(m) * 2.003 * tt)) * 0.03
        env = np.minimum(1, np.arange(len(pad)) / n(0.3)) * np.minimum(1, (len(pad) - np.arange(len(pad))) / n(0.3))
        put(pad * env, t)
        put(np.sin(2 * math.pi * hz(ch[0] - 24) * np.arange(n(4 * beat)) / SR) * 0.16 * env, t)
        quiet = close - 0.5 <= t < close + 4 * beat  # a breath before the closing line
        for k in range(4):
            if not quiet:
                put(kick, t + k * beat)
                if k in (1, 3):
                    put(clap, t + k * beat)
            for e in (0, 0.5):
                put(hat, t + (k + e) * beat, pan=0.3 if e else -0.3)
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
        for e in range(8):
            put(piano(hz(arp[e % 4]), 0.8, 0.28), t + e * beat / 2, pan=0.35 if e % 2 else -0.35)
        t += 4 * beat
        bar += 1
    # impact on the reveal and on the final logo
    it = np.arange(n(1.8)) / SR
    impact = np.sin(2 * math.pi * (36 + 50 * np.exp(-it * 7)) * it) * np.exp(-it * 2.4) * 0.7 + lowpass(rng.normal(0, 1, n(1.8)), 1500) * np.exp(-it * 4) * 0.25
    put(impact, reveal)
    put(impact, tl["logo"] / fps)
    mix = np.stack([L, R])
    mix /= np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix * 1.3) / np.tanh(1.3) * 0.85
    f = n(2.5)
    mix[:, -f:] *= np.linspace(1, 0, f)
    write("music.wav", mix, stereo=True)
    # glass transition: two bright partials with shimmer, plus a soft air swell
    gt = np.arange(n(0.9)) / SR
    glass = (np.sin(2 * math.pi * 2093 * gt) * 0.5 + np.sin(2 * math.pi * 3136 * gt) * 0.3 + np.sin(2 * math.pi * 4186 * gt) * 0.15) * np.exp(-gt * 5.5)
    glass *= 1 + 0.25 * np.sin(2 * math.pi * 9 * gt)
    air = lowpass(rng.normal(0, 1, len(gt)), 6000) * np.sin(np.pi * np.linspace(0, 1, len(gt))) ** 3 * 0.12
    write("glass.wav", (glass * 0.35 + air))
    ct = np.arange(n(0.05)) / SR
    write("tap.wav", np.sin(2 * math.pi * 1500 * ct) * np.exp(-ct * 120) * 0.35)
    tt = np.arange(n(0.12)) / SR
    write("tick.wav", np.sin(2 * math.pi * 3200 * tt) * np.exp(-tt * 60) * 0.2)
    print("music", round(total, 1), "s")


if __name__ == "__main__":
    what = sys.argv[1:] or ["voice", "music"]
    if "voice" in what:
        voice()
    if "music" in what:
        music()
