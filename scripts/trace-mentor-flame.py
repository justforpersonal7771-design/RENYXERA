"""Traces the owner's final Mentor logo (the ribbon flame with a spark) into a clean vector.
Input: the dark-background panel of the owner's PNG. Output: scripts/_flame_path.json with the path and its viewBox.
Run: python scripts/trace-mentor-flame.py "C:/Users/Admin/Downloads/Neon Gradient Flame Logo Triptych.png"
Needs: pillow, numpy, potracer (pip install potracer)."""
import json
import sys

import numpy as np
import potrace
from PIL import Image, ImageFilter

src = sys.argv[1]
im = Image.open(src).convert("RGB")
W, H = im.size
panel = im.crop((W // 3, 0, 2 * W // 3, H))        # the middle panel: logo on near-black
a = np.asarray(panel).astype(np.int16)
bg = np.median(np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3)]), axis=0)  # background colour from the edges
dist = np.abs(a - bg).max(axis=2)
mask_img = Image.fromarray(((dist > 38) * 255).astype(np.uint8))
mask_img = mask_img.resize((int(mask_img.width * 1.5), int(mask_img.height * 1.5)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.6))
m = np.asarray(mask_img) > 128                      # smooth the edges, then threshold again

ys, xs = np.where(m)
pad = 24
x0, x1, y0, y1 = max(xs.min() - pad, 0), xs.max() + pad, max(ys.min() - pad, 0), ys.max() + pad
m = m[y0:y1, x0:x1]
bmp = potrace.Bitmap(~m)  # potracer traces the False pixels, so invert to trace the logo itself
plist = bmp.trace(turdsize=30, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.2, opticurve=True, opttolerance=1.4)

h, w = m.shape
K = 100.0 / w
parts = []
for curve in plist:
    s = curve.start_point
    d = [f"M{s.x*K:.1f} {s.y*K:.1f}"]
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f"L{seg.c.x*K:.1f} {seg.c.y*K:.1f}L{seg.end_point.x*K:.1f} {seg.end_point.y*K:.1f}")
        else:
            d.append(f"C{seg.c1.x*K:.1f} {seg.c1.y*K:.1f} {seg.c2.x*K:.1f} {seg.c2.y*K:.1f} {seg.end_point.x*K:.1f} {seg.end_point.y*K:.1f}")
    d.append("z")
    parts.append("".join(d))
json.dump({"d": " ".join(parts), "w": 100, "h": round(h * K, 1)}, open("scripts/_flame_path.json", "w"))
print("paths:", len(parts), "box:", w, "x", h, "bytes:", sum(len(p) for p in parts))
