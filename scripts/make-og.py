"""Generate the 1200x630 social-card images (public/og/*.png) used for link previews (Telegram, WhatsApp, X, Instagram DMs).
    python scripts/make-og.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os
W, H = 1200, 630
F = "C:/Windows/Fonts/"
bold = lambda s: ImageFont.truetype(F + "segoeuib.ttf", s)
reg = lambda s: ImageFont.truetype(F + "segoeui.ttf", s)
CARDS = {
    "default": ("GATE 2027", "PYQs, mocks and an AI mentor", "#6366f1", "#a855f7"),
    "gate-cse": ("GATE CS 2027", "Computer Science & IT", "#4f46e5", "#a855f7"),
    "gate-ece": ("GATE ECE 2027", "Electronics & Communication", "#0891b2", "#6366f1"),
    "gate-ee": ("GATE EE 2027", "Electrical Engineering", "#d97706", "#db2777"),
    "gate-me": ("GATE ME 2027", "Mechanical Engineering", "#dc2626", "#7c3aed"),
    "gate-ce": ("GATE Civil 2027", "Civil Engineering", "#059669", "#0891b2"),
    "gate-da": ("GATE DA 2027", "Data Science & AI", "#7c3aed", "#db2777"),
}
mark = Image.open("public/brand/mark-dark.png").convert("RGBA")
def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
os.makedirs("public/og", exist_ok=True)
for slug, (title, sub, c1, c2) in CARDS.items():
    a, b = hexrgb(c1), hexrgb(c2)
    im = Image.new("RGB", (W, H), (8, 6, 24))
    px = im.load()
    for y in range(H):
        for x in range(W):
            t = (x / W * 0.6 + y / H * 0.4)
            px[x, y] = tuple(int(8 + (a[i] * (1 - t) + b[i] * t - 8) * 0.55 * (0.35 + 0.65 * (1 - y / H))) for i in range(3))
    glow = Image.new("RGB", (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
    gd.ellipse((W - 520, -200, W + 160, 480), fill=tuple(int(v * 0.5) for v in b))
    im = Image.blend(im, Image.eval(Image.composite(glow, im, Image.new("L", (W, H), 255)), lambda v: v), 0.0)
    im = Image.fromarray(__import__("numpy").clip(__import__("numpy").asarray(im).astype(int) + __import__("numpy").asarray(glow.filter(ImageFilter.GaussianBlur(120))).astype(int), 0, 255).astype("uint8"))
    d = ImageDraw.Draw(im)
    m = mark.resize((120, 120)); im.paste(m, (72, 64), m)
    d.text((216, 84), "RENYXERA", font=bold(44), fill="white")
    d.text((216, 136), "A NEW ERA OF INTELLIGENT LEARNING", font=reg(18), fill=(200, 196, 240))
    d.text((72, 270), title, font=bold(112), fill="white")
    d.text((76, 410), sub, font=reg(44), fill=(226, 222, 255))
    d.rounded_rectangle((72, 500, 600, 566), radius=33, outline=(255, 255, 255), width=3)
    d.text((104, 513), "Previous-year questions + AI mentor", font=reg(28), fill="white")
    d.text((W - 72, H - 64), "gate.renyxera.workers.dev", font=reg(26), fill=(210, 205, 245), anchor="rs")
    im.save(f"public/og/{slug}.png", optimize=True)
print("done")
