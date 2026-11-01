"""Cuts the owner's final Mentor logo out of the dark panel of the generated image, keeping the ORIGINAL colours and shading
(no recolouring), and writes transparent PNGs: the whole logo, the flame body, and the spark on its own (same canvas, so the
spark can be animated separately on top of the body).
Run: python scripts/extract-mentor-logo.py "C:/Users/Admin/Downloads/Neon Gradient Flame Logo Triptych.png"
Needs: pillow, numpy."""
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

OUT = "public/brand/mentor"
src = Image.open(sys.argv[1]).convert("RGB")
W, H = src.size
panel = np.asarray(src.crop((W // 3, 0, 2 * W // 3, H))).astype(np.float32)
bg = np.median(np.concatenate([panel[:6].reshape(-1, 3), panel[-6:].reshape(-1, 3)]), axis=0)

# Alpha from how far a pixel is from the near-black background, then un-mix the colour so edges do not carry a dark halo.
dist = np.abs(panel - bg).max(axis=2)
alpha = np.clip((dist - 10) / 46.0, 0, 1)
safe = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((panel - (1 - alpha[..., None]) * bg) / safe, 0, 255)
# Pull the edge in by one pixel and soften it, so the dark background never shows as a fringe on light surfaces.
edge = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
alpha = np.asarray(edge).astype(np.float32) / 255.0
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)

# Find the spark: the smallest connected blob (the flame is the big one).
solid = alpha > 0.5
h, w = solid.shape
label = np.zeros((h, w), np.int32)
sizes = {}
cur = 0
for y in range(0, h, 1):
    for x in range(0, w, 1):
        if solid[y, x] and not label[y, x]:
            cur += 1
            q = deque([(y, x)]); label[y, x] = cur; n = 0
            while q:
                cy, cx = q.popleft(); n += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not label[ny, nx]:
                        label[ny, nx] = cur; q.append((ny, nx))
            sizes[cur] = n
big = [k for k, v in sizes.items() if v > 400]
star_id = min(big, key=lambda k: sizes[k])
print("blobs:", {k: sizes[k] for k in big}, "star:", star_id)

# the star's soft edge: everything within 3px of the star blob
near = np.zeros_like(solid)
ys, xs = np.where(label == star_id)
sy0, sy1, sx0, sx1 = ys.min() - 4, ys.max() + 4, xs.min() - 4, xs.max() + 4
near[max(sy0, 0):sy1, max(sx0, 0):sx1] = True
star_mask = near & ~(label > 0) | (label == star_id)
star_mask = near  # the star lives alone inside its own box
body_alpha = rgba[..., 3].copy(); body_alpha[star_mask] = 0
star_alpha = rgba[..., 3].copy(); star_alpha[~star_mask] = 0

allx, ally = np.where(rgba[..., 3] > 8)[1], np.where(rgba[..., 3] > 8)[0]
pad = 12
x0, x1, y0, y1 = allx.min() - pad, allx.max() + pad, ally.min() - pad, ally.max() + pad
def save(name, a):
    im = rgba.copy(); im[..., 3] = a
    Image.fromarray(im[y0:y1, x0:x1], "RGBA").save(f"{OUT}/{name}.png", optimize=True)
save("mentor-ai", rgba[..., 3])
save("mentor-ai-body", body_alpha)
save("mentor-ai-star", star_alpha)
cx0, cy0 = (sx0 - x0), (sy0 - y0)
print("canvas", x1 - x0, "x", y1 - y0, "| star box (fraction of canvas): left %.3f top %.3f w %.3f h %.3f" % (max(cx0, 0) / (x1 - x0), max(cy0, 0) / (y1 - y0), (sx1 - sx0) / (x1 - x0), (sy1 - sy0) / (y1 - y0)))
