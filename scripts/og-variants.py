"""Contact sheet of card style options for one branch (EE): python scripts/og-variants.py -> D:/tmp/og_variants.png"""
src = open("scripts/make-og.py", encoding="utf-8").read()
exec(src[:src.index("for slug, (t, s, lg, ac) in BR.items():")])
def vf(file, axes, sz):
    f = ImageFont.truetype(FD + file, sz)
    try: f.set_variation_by_axes(axes)
    except Exception: pass
    return f
def chips(im, items, x, y, accent, font, fill_dark=False):
    d = ImageDraw.Draw(im); a = hexrgb(accent)
    for text, solid in items:
        w = int(d.textlength(text, font=font)) + 44
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((x, y + 6, x + w, y + 58), 26, fill=a + (60,))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        if solid: od.rounded_rectangle((x, y, x + w, y + 52), 26, fill=a + (255,))
        else: od.rounded_rectangle((x, y, x + w, y + 52), 26, fill=(255, 255, 255, 235), outline=a + (255,), width=2)
        im.alpha_composite(ov); d = ImageDraw.Draw(im)
        d.text((x + w // 2, y + 27), text, font=font, fill="white" if solid else (22, 18, 58), anchor="mm"); x += w + 12
STY = [
 ("A  Outfit / Fraunces", lambda: vf("Outfit.ttf", [700], 84), lambda: vf("Fraunces-Italic.ttf", [0, 0, 72, 500], 58), lambda: vf("Outfit.ttf", [600], 24), lambda: vf("JetBrainsMono.ttf", [500], 21)),
 ("B  Sora / DM Serif", lambda: vf("Sora.ttf", [700], 78), lambda: ImageFont.truetype(FD + "DMSerif.ttf", 60), lambda: vf("Sora.ttf", [600], 22), lambda: vf("SpaceGrotesk.ttf", [500], 22)),
 ("C  Unbounded / Instrument", lambda: vf("Unbounded.ttf", [700], 60), lambda: serif_i(66), lambda: vf("SpaceGrotesk.ttf", [700], 24), lambda: vf("JetBrainsMono.ttf", [500], 21)),
 ("D  Bricolage / Fraunces", lambda: vf("Bricolage.ttf", [48, 800, 100], 90), lambda: vf("Fraunces-Italic.ttf", [0, 0, 72, 400], 58), lambda: vf("Manrope.ttf", [700], 24), lambda: vf("Manrope.ttf", [600], 22)),
 ("E  Syne / DM Serif", lambda: vf("Syne.ttf", [700], 70), lambda: ImageFont.truetype(FD + "DMSerif.ttf", 60), lambda: vf("Outfit.ttf", [600], 24), lambda: vf("JetBrainsMono.ttf", [500], 21)),
 ("F  Sora / Instrument", lambda: vf("Sora.ttf", [800], 76), lambda: serif_i(66), lambda: vf("Sora.ttf", [600], 22), lambda: vf("Outfit.ttf", [500], 24)),
]
t, s, lg, ac = BR["gate-ee"]
sheet = Image.new("RGB", (W * 2, (H + 40) * 3), "white")
for k, (name, ft, fs, fc, fu) in enumerate(STY):
    im = background(ac).convert("RGBA"); im.alpha_composite(lock, (64, 56)); d = ImageDraw.Draw(im)
    d.text((60, 232), t, font=ft(), fill=(22, 18, 58)); d.text((66, 366), s, font=fs(), fill=hexrgb(ac))
    chips(im, [("2,400+ official PYQs", False), ("AI mentor", True)], 64, 480, ac, fc())
    d = ImageDraw.Draw(im); d.text((66, 570), "gate.renyxera.workers.dev", font=fu(), fill=(88, 80, 140))
    c = circle(f"logo/{lg}.jpeg", 380); sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((770, 120, 1150, 500), fill=hexrgb(ac) + (90,))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28))); im.alpha_composite(c, (770, 125))
    d = ImageDraw.Draw(im); d.rounded_rectangle((12, 12, 330, 52), 12, fill=(22, 18, 58)); d.text((24, 16), name, font=manrope(22, 700), fill="white")
    sheet.paste(im.convert("RGB"), ((k % 2) * W, (k // 2) * (H + 40)))
sheet.resize((W, (H + 40) * 3 // 2 * 1)).save("D:/tmp/og_variants.png"); print("ok")
