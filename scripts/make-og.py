"""Generate the 1200x630 social cards (public/og/*.png) and the circular branch logos (public/brand/branch/*.png).
Uses the real brand lockup (public/brand/lockup-*.png) and the branch logos in /logo. Run: python scripts/make-og.py"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, os
W, H = 1200, 630
F = "C:/Windows/Fonts/"
FD = "scripts/fonts/"
def brico(sz, wght=800):
    f = ImageFont.truetype(FD + "Bricolage.ttf", sz); f.set_variation_by_axes([min(96, max(12, sz // 2)), wght, 100]); return f  # opsz, wdth, wght
def manrope(sz, wght=600):
    f = ImageFont.truetype(FD + "Manrope.ttf", sz); f.set_variation_by_axes([wght]); return f
def syne(sz, w=800):
    f = ImageFont.truetype(FD + "Syne.ttf", sz); f.set_variation_by_axes([w]); return f
def grotesk(sz, w=600):
    f = ImageFont.truetype(FD + "SpaceGrotesk.ttf", sz); f.set_variation_by_axes([w]); return f
def sora(sz, w=600):
    f = ImageFont.truetype(FD + "Sora.ttf", sz); f.set_variation_by_axes([w]); return f
def playfair_i(sz, w=600):
    f = ImageFont.truetype(FD + "PlayfairItalic.ttf", sz); f.set_variation_by_axes([w]); return f
def mono(sz, w=500):
    f = ImageFont.truetype(FD + "JetBrainsMono.ttf", sz); f.set_variation_by_axes([w]); return f
serif_i = lambda sz: ImageFont.truetype(FD + "InstrumentSerif-Italic.ttf", sz)
bold = lambda s: brico(s)
reg = lambda s: manrope(s, 500)
BR = {  # slug: (title, subtitle, logo file, accent)
    "gate-cse": ("GATE CS 2027", "Computer Science & IT", "CSIT", "#4f46e5"),
    "gate-ece": ("GATE ECE 2027", "Electronics & Communication", "EC", "#0891b2"),
    "gate-ee": ("GATE EE 2027", "Electrical Engineering", "EE", "#d97706"),
    "gate-me": ("GATE ME 2027", "Mechanical Engineering", "ME", "#dc2626"),
    "gate-ce": ("GATE Civil 2027", "Civil Engineering", "CE", "#059669"),
    "gate-da": ("GATE DA 2027", "Data Science & AI", "DA", "#7c3aed"),
}
def circle(path, size):
    im = Image.open(path).convert("RGB"); w, h = im.size
    r = int(min(w, h) * 0.495); cx, cy = w // 2, h // 2
    im = im.crop((cx - r, cy - r, cx + r, cy + r)).resize((size, size), Image.LANCZOS)
    m = Image.new("L", (size * 4, size * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    m = m.resize((size, size), Image.LANCZOS); out = im.convert("RGBA"); out.putalpha(m); return out
def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
mark = Image.open("public/brand/mark-light.png").convert("RGBA")
BRUNO = "scripts/fonts/BrunoAceSC-Regular.ttf"  # the app's brand face (Bruno Ace SC)
def brand_lockup(height):
    """Mark + 'RENYX' + gradient 'ERA' + tagline, like the app's Wordmark component. Returns an RGBA image."""
    fs = int(height * 0.50)
    f = ImageFont.truetype(BRUNO, fs)
    tf = manrope(int(height * 0.13), 700)
    mk = mark.resize((int(mark.width * height / mark.height), height), Image.LANCZOS)
    gap = int(height * 0.22)
    wr = f.getlength("RENYX"); we = f.getlength("ERA")
    tag = "A NEW ERA OF INTELLIGENT LEARNING"
    W2 = mk.width + gap + int(wr + we) + 20
    out = Image.new("RGBA", (W2, height), (0, 0, 0, 0)); out.alpha_composite(mk, (0, 0))
    d = ImageDraw.Draw(out); x0 = mk.width + gap; y0 = int(height * 0.12)
    d.text((x0, y0), "RENYX", font=f, fill=(22, 18, 58, 255))
    m = Image.new("L", out.size, 0); ImageDraw.Draw(m).text((x0 + wr, y0), "ERA", font=f, fill=255)
    grad = Image.new("RGBA", out.size); gp = grad.load(); c1, c2, c3 = (6, 194, 251), (91, 33, 224), (221, 66, 251)
    for xx in range(int(x0 + wr), int(x0 + wr + we) + 2):
        t = (xx - (x0 + wr)) / max(we, 1); c = tuple(int((c1[i] * (1 - 2 * t) + c2[i] * 2 * t) if t < .5 else (c2[i] * (2 - 2 * t) + c3[i] * (2 * t - 1))) for i in range(3))
        for yy in range(out.height): gp[xx, yy] = c + (255,)
    out.paste(grad, (0, 0), m)
    ImageDraw.Draw(out).text((x0 + 4, int(height * 0.78)), tag, font=tf, fill=(88, 80, 140, 255))
    return out
lock = brand_lockup(110)
os.makedirs("public/og", exist_ok=True); os.makedirs("public/brand/branch", exist_ok=True)
def background(accent):
    y, x = np.mgrid[0:H, 0:W]
    a = np.array(hexrgb(accent), float)
    base = np.array([250, 248, 255], float)
    g = np.exp(-(((x - 930) / 420) ** 2 + ((y - 300) / 360) ** 2))[..., None]
    img = base * (1 - 0.22 * g) + a * 0.22 * g
    img[..., 2] = np.minimum(img[..., 2] + 4 * g[..., 0], 255)
    return Image.fromarray(np.clip(img, 0, 255).astype("uint8"))

def pill(im, accent, a, b):
    """Two chips (outlined + solid) with soft shadows, in Sora."""
    ac = hexrgb(accent); f = sora(22, 600); x = 64; y = 480
    for text, solid in ((a, False), (b, True)):
        d = ImageDraw.Draw(im); w = int(d.textlength(text, font=f)) + 44
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((x, y + 6, x + w, y + 58), 26, fill=ac + (60,))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        if solid: od.rounded_rectangle((x, y, x + w, y + 52), 26, fill=ac + (255,))
        else: od.rounded_rectangle((x, y, x + w, y + 52), 26, fill=(255, 255, 255, 235), outline=ac + (255,), width=2)
        im.alpha_composite(ov); d = ImageDraw.Draw(im)
        d.text((x + w // 2, y + 27), text, font=f, fill="white" if solid else (22, 18, 58), anchor="mm"); x += w + 12

def fit_serif(d, text, size, max_w):
    # shrink the branch name until it ends before the round branch logo
    while size > 30:
        f = ImageFont.truetype(FD + "DMSerif.ttf", size)
        if d.textlength(text, font=f) <= max_w: return f
        size -= 2
    return ImageFont.truetype(FD + "DMSerif.ttf", size)

def card(slug, title, sub, logo, accent, share=False):
    im = background(accent).convert("RGBA")
    d = ImageDraw.Draw(im)
    im.alpha_composite(lock, (64, 56))
    d.text((60, 250), title, font=brico(92, 800), fill=(22, 18, 58))
    d.text((66, 366), sub, font=fit_serif(d, sub, 60, 680), fill=hexrgb(accent))
    if not share:
        # the share variant leaves the bottom free for the sender bar and referral line
        pill(im, accent, "2,400+ official PYQs", "AI mentor")
        d = ImageDraw.Draw(im)
        d.text((66, 572), "gate.renyxera.workers.dev", font=mono(21, 500), fill=(88, 80, 140))
    if logo:
        c = circle(f"logo/{logo}.jpeg", 380)
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((770, 120, 1150, 500), fill=hexrgb(accent) + (90,))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28))); im.alpha_composite(c, (770, 125))
    os.makedirs("public/og/share", exist_ok=True)
    im.convert("RGB").save(f"public/og/share/{slug}.png" if share else f"public/og/{slug}.png", optimize=True)
for slug, (t, s, lg, ac) in BR.items():
    try:
        card(slug, t, s, lg, ac)
        card(slug, t, s, lg, ac, share=True)
    except OSError as e:
        print("skipped (file open elsewhere?):", slug, e)
    circle(f"logo/{lg}.jpeg", 512).save(f"public/brand/branch/{slug}.png", optimize=True)
def default_card(out, custom=False):
    im = background("#6366f1").convert("RGBA"); d = ImageDraw.Draw(im)
    im.alpha_composite(lock, (64, 70))
    d.text((60, 215), "GATE 2027", font=brico(110, 800), fill=(22, 18, 58))
    d.text((66, 362), "PYQs, mocks and an AI mentor", font=(playfair_i(52) if custom else ImageFont.truetype(FD + "DMSerif.ttf", 56)), fill=(99, 102, 241))
    if not custom:
        pill(im, "#6366f1", "Practise free", "Upgrade when ready")
    d = ImageDraw.Draw(im)
    d.text((66, 572), "gate.renyxera.workers.dev", font=mono(21, 500), fill=(88, 80, 140))
    x = 840
    for k, (_, (t, s, lg, ac)) in enumerate(BR.items()):
        c = circle(f"logo/{lg}.jpeg", 150); im.alpha_composite(c, (x + (k % 2) * 170, 120 + (k // 2) * 170))
    im.convert("RGB").save(out, optimize=True)
default_card("public/og/default.png")
default_card("public/og/custom-base.png", custom=True)


def result_base(slug, logo, accent):
    """Portrait 1080x1350 base for the share-result image, in the social-card style: same tinted background,
    lockup, glowing branch logo top right and mono URL. Scores are drawn on top in the app (share-result-button)."""
    RW, RH = 1080, 1350
    y, x = np.mgrid[0:RH, 0:RW]
    a = np.array(hexrgb(accent), float); base = np.array([250, 248, 255], float)
    g = np.exp(-(((x - 860) / 460) ** 2 + ((y - 240) / 420) ** 2))[..., None]
    g2 = np.exp(-(((x - 120) / 520) ** 2 + ((y - 1300) / 380) ** 2))[..., None]
    img = base * (1 - 0.24 * g - 0.12 * g2) + a * (0.24 * g + 0.12 * g2)
    im = Image.fromarray(np.clip(img, 0, 255).astype("uint8")).convert("RGBA")
    lk = brand_lockup(84); im.alpha_composite(lk, (72, 72))
    c = circle(f"logo/{logo}.jpeg", 230)
    sh = Image.new("RGBA", (RW, RH), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((790, 190, 1030, 430), fill=hexrgb(accent) + (95,))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(26))); im.alpha_composite(c, (795, 195))
    ImageDraw.Draw(im).text((72, 1268), "gate.renyxera.workers.dev", font=mono(28, 500), fill=(88, 80, 140))
    os.makedirs("public/og/result", exist_ok=True)
    im.convert("RGB").save(f"public/og/result/{slug}.png", optimize=True)
for slug, (t, s_, lg, ac) in BR.items():
    result_base(slug, lg, ac)
print("done")

