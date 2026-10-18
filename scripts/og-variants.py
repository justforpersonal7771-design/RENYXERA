"""Style options for the branch cards: python scripts/og-variants.py -> D:/tmp/og_variants10.png and D:/tmp/og_custom.png"""
src = open("scripts/make-og.py", encoding="utf-8").read()
exec(src[:src.index("for slug, (t, s, lg, ac) in BR.items():")])
def vf(file, axes, sz):
    f = ImageFont.truetype(FD + file, sz)
    try: f.set_variation_by_axes(axes)
    except Exception: pass
    return f
BRI = lambda sz: vf("Bricolage.ttf", [min(96, sz // 2), 800, 100], sz)
SER = lambda file, sz, ax=None: (vf(file, ax, sz) if ax else ImageFont.truetype(FD + file, sz))
def chips(im, items, x, y, accent, font, style):
    d = ImageDraw.Draw(im); a = hexrgb(accent)
    for text, solid in items:
        w = int(d.textlength(text, font=font)) + 44
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((x, y + 6, x + w, y + 58), 26 if style != "sq" else 10, fill=a + (60,))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov); r = 26 if style != "sq" else 10
        if solid: od.rounded_rectangle((x, y, x + w, y + 52), r, fill=a + (255,))
        else: od.rounded_rectangle((x, y, x + w, y + 52), r, fill=(255, 255, 255, 235), outline=a + (255,), width=2)
        im.alpha_composite(ov); d = ImageDraw.Draw(im)
        d.text((x + w // 2, y + 27), text, font=font, fill="white" if solid else (22, 18, 58), anchor="mm"); x += w + 12
# title is always Bricolage Grotesque; branch name serif, chips font, url font vary
STY = [
 ("1 DM Serif / Sora", lambda: ImageFont.truetype(FD + "DMSerif.ttf", 60), lambda: vf("Sora.ttf", [600], 22), lambda: vf("SpaceGrotesk.ttf", [500], 22), "pill"),
 ("2 Playfair / Jakarta", lambda: vf("PlayfairItalic.ttf", [600], 58), lambda: vf("Jakarta.ttf", [700], 22), lambda: vf("JetBrainsMono.ttf", [500], 21), "pill"),
 ("3 Cormorant / Epilogue", lambda: vf("CormorantItalic.ttf", [600], 70), lambda: vf("Epilogue.ttf", [700], 22), lambda: vf("Epilogue.ttf", [500], 21), "sq"),
 ("4 Gloock / Figtree", lambda: ImageFont.truetype(FD + "Gloock.ttf", 56), lambda: vf("Figtree.ttf", [700], 24), lambda: vf("Figtree.ttf", [500], 22), "pill"),
 ("5 Young Serif / Red Hat", lambda: ImageFont.truetype(FD + "YoungSerif.ttf", 54), lambda: vf("RedHat.ttf", [700], 23), lambda: vf("RedHat.ttf", [500], 22), "sq"),
 ("6 Bodoni / Outfit", lambda: vf("BodoniItalic.ttf", [600, 28], 62), lambda: vf("Outfit.ttf", [600], 24), lambda: vf("DMMono.ttf", [], 21), "pill"),
 ("7 Instrument / Space Grotesk", lambda: serif_i(66), lambda: vf("SpaceGrotesk.ttf", [700], 23), lambda: vf("SpaceGrotesk.ttf", [500], 22), "sq"),
 ("8 Fraunces / Manrope", lambda: vf("Fraunces-Italic.ttf", [0, 0, 72, 500], 58), lambda: vf("Manrope.ttf", [800], 22), lambda: vf("Manrope.ttf", [600], 22), "pill"),
 ("9 Italiana / Sora", lambda: ImageFont.truetype(FD + "Italiana.ttf", 64), lambda: vf("Sora.ttf", [700], 21), lambda: vf("JetBrainsMono.ttf", [500], 21), "sq"),
 ("10 DM Serif / Unbounded", lambda: ImageFont.truetype(FD + "DMSerif.ttf", 60), lambda: vf("Unbounded.ttf", [600], 18), lambda: vf("SpaceGrotesk.ttf", [500], 22), "pill"),
]
t, s, lg, ac = BR["gate-ee"]
def base(fs, name):
    im = background(ac).convert("RGBA"); im.alpha_composite(lock, (64, 56)); d = ImageDraw.Draw(im)
    d.text((60, 236), t, font=BRI(92), fill=(22, 18, 58)); d.text((66, 366), s, font=fs(), fill=hexrgb(ac))
    c = circle(f"logo/{lg}.jpeg", 380); sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((770, 120, 1150, 500), fill=hexrgb(ac) + (90,))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28))); im.alpha_composite(c, (770, 125))
    d = ImageDraw.Draw(im); d.rounded_rectangle((12, 12, 360, 52), 12, fill=(22, 18, 58)); d.text((24, 16), name, font=manrope(22, 700), fill="white")
    return im
sheet = Image.new("RGB", (W * 2, (H + 30) * 5), "white")
for k, (name, fs, fc, fu, style) in enumerate(STY):
    im = base(fs, name)
    chips(im, [("2,400+ official PYQs", False), ("AI mentor", True)], 64, 480, ac, fc(), style)
    d = ImageDraw.Draw(im); d.text((66, 570), "gate.renyxera.workers.dev", font=fu(), fill=(88, 80, 140))
    sheet.paste(im.convert("RGB"), ((k % 2) * W, (k // 2) * (H + 30)))
sheet.resize((W * 3 // 2, (H + 30) * 5 * 3 // 4)).save("D:/tmp/og_variants10.png")
# personalised ("custom") card: sender block replaces the chips; sample data
av = Image.new("RGB", (400, 400), (99, 102, 241)); ImageDraw.Draw(av).ellipse((120, 70, 280, 230), fill=(255, 255, 255)); ImageDraw.Draw(av).ellipse((60, 250, 340, 520), fill=(255, 255, 255))
def custom(k, layout):
    name, fs, fc, fu, style = STY[k]; im = base(fs, name + " · custom")
    a = hexrgb(ac); d = ImageDraw.Draw(im)
    avc = circle_img(av, 120)
    if layout == 0:   # glass sender bar
        bar = Image.new("RGBA", im.size, (0, 0, 0, 0)); bd = ImageDraw.Draw(bar); bd.rounded_rectangle((64, 468, 704, 556), 44, fill=(255, 255, 255, 240), outline=a + (255,), width=3)
        im.alpha_composite(bar); im.alpha_composite(avc.resize((72, 72)), (76, 476)); d = ImageDraw.Draw(im)
        d.text((164, 480), "Aarav Sharma", font=fc(), fill=(22, 18, 58)); d.text((164, 512), "@aarav.cse  ·  ID GATE-2027-0142", font=fu(), fill=(88, 80, 140))
    elif layout == 1: # avatar badge overlapping the branch logo
        ring = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(ring).ellipse((1000, 400, 1140, 540), fill=(255, 255, 255, 255)); im.alpha_composite(ring)
        im.alpha_composite(avc.resize((124, 124)), (1008, 408)); d = ImageDraw.Draw(im)
        d.text((66, 480), "Shared by", font=fu(), fill=(88, 80, 140)); d.text((66, 508), "Aarav Sharma  ·  @aarav.cse", font=fc(), fill=(22, 18, 58))
    elif layout == 2: # ticket strip
        d.rounded_rectangle((64, 468, 704, 556), 14, fill=(22, 18, 58)); im.alpha_composite(avc.resize((64, 64)), (80, 480)); d = ImageDraw.Draw(im)
        d.text((160, 482), "AARAV SHARMA", font=fc(), fill="white"); d.text((160, 514), "@aarav.cse  ·  STUDENT ID 0142", font=fu(), fill=(200, 196, 240))
        d.rounded_rectangle((560, 480, 692, 544), 10, fill=a); d.text((626, 512), "GATE 2027", font=fc(), fill="white", anchor="mm")
    else:             # minimal
        im.alpha_composite(avc.resize((64, 64)), (64, 486)); d = ImageDraw.Draw(im)
        d.text((144, 486), "Aarav Sharma", font=fc(), fill=(22, 18, 58)); d.text((144, 518), "@aarav.cse  ·  0142", font=fu(), fill=(88, 80, 140))
    d.text((66, 575), "gate.renyxera.workers.dev", font=fu(), fill=(88, 80, 140)) if layout in (1,) else None
    return im
def circle_img(img, size):
    im = img.convert("RGB").resize((size, size)); m = Image.new("L", (size * 4, size * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    o = im.convert("RGBA"); o.putalpha(m.resize((size, size), Image.LANCZOS)); return o
cs = Image.new("RGB", (W * 2, (H + 30) * 2), "white")
for i, k in enumerate((0, 1, 6, 7)):
    cs.paste(custom(k, i).convert("RGB"), ((i % 2) * W, (i // 2) * (H + 30)))
cs.resize((W * 3 // 2, (H + 30) * 3 // 2)).save("D:/tmp/og_custom.png"); print("ok")
