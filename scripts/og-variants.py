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
def TT(file, ax, sz): return lambda: vf(file, ax, sz)
def ST(file, sz): return lambda: ImageFont.truetype(FD + file, sz)
STY = [  # (label, title (bold), branch name (cursive/serif), chip font, url font, chip shape)
 ("1 Archivo Black / Pacifico / Space Grotesk", ST("ArchivoBlack.ttf", 80), ST("Pacifico.ttf", 54), TT("SpaceGrotesk.ttf", [700], 23), TT("SpaceMono.ttf", [], 20), "pill"),
 ("2 Syne ExtraBold / Playball / Hanken", TT("Syne.ttf", [800], 54), ST("Playball.ttf", 66), TT("Hanken.ttf", [700], 23), TT("IBMMono.ttf", [], 21), "pill"),
 ("3 Dela Gothic / Great Vibes / DM Sans", ST("DelaGothic.ttf", 66), ST("GreatVibes.ttf", 84), TT("DMSans.ttf", [14, 700], 23), TT("SpaceMono.ttf", [], 20), "sq"),
 ("4 Fraunces Black / Kaushan / Epilogue", TT("Fraunces.ttf", [96, 900, 0, 0], 90), ST("Kaushan.ttf", 58), TT("Epilogue.ttf", [700], 22), TT("IBMMono.ttf", [], 21), "pill"),
 ("5 Anton / Sacramento / Space Grotesk", ST("Anton.ttf", 96), ST("Sacramento.ttf", 80), TT("SpaceGrotesk.ttf", [700], 23), TT("SpaceGrotesk.ttf", [500], 22), "sq"),
 ("6 Space Grotesk Bold / Dancing / Jakarta", TT("SpaceGrotesk.ttf", [700], 86), TT("Dancing.ttf", [700], 70), TT("Jakarta.ttf", [700], 22), TT("JetBrainsMono.ttf", [500], 21), "pill"),
 ("7 Unbounded Black / Pacifico / Sora", TT("Unbounded.ttf", [800], 58), ST("Pacifico.ttf", 54), TT("Sora.ttf", [700], 21), TT("SpaceMono.ttf", [], 20), "sq"),
 ("8 Bricolage XBold / Great Vibes / Manrope", TT("Bricolage.ttf", [46, 800, 100], 92), ST("GreatVibes.ttf", 84), TT("Manrope.ttf", [800], 22), TT("IBMMono.ttf", [], 21), "pill"),
 ("9 Archivo Black / Fraunces italic / Hanken", ST("ArchivoBlack.ttf", 80), TT("Fraunces-Italic.ttf", [0, 0, 72, 600], 62), TT("Hanken.ttf", [800], 23), TT("SpaceMono.ttf", [], 20), "sq"),
 ("10 Syne ExtraBold / Caveat / Outfit", TT("Syne.ttf", [800], 54), TT("Caveat.ttf", [700], 78), TT("Outfit.ttf", [700], 23), TT("JetBrainsMono.ttf", [500], 21), "pill"),
]
t, s, lg, ac = BR["gate-ee"]
def base(fs, name, ft=None):
    im = background(ac).convert("RGBA"); im.alpha_composite(lock, (64, 56)); d = ImageDraw.Draw(im)
    d.text((60, 236), t, font=(ft() if ft else BRI(92)), fill=(22, 18, 58)); d.text((66, 366), s, font=fs(), fill=hexrgb(ac))
    c = circle(f"logo/{lg}.jpeg", 380); sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((770, 120, 1150, 500), fill=hexrgb(ac) + (90,))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(28))); im.alpha_composite(c, (770, 125))
    d = ImageDraw.Draw(im); d.rounded_rectangle((12, 12, 360, 52), 12, fill=(22, 18, 58)); d.text((24, 16), name, font=manrope(22, 700), fill="white")
    return im
sheet = Image.new("RGB", (W * 2, (H + 30) * 5), "white")
for k, (name, ft, fs, fc, fu, style) in enumerate(STY):
    im = base(fs, name, ft)
    chips(im, [("2,400+ official PYQs", False), ("AI mentor", True)], 64, 480, ac, fc(), style)
    d = ImageDraw.Draw(im); d.text((66, 570), "gate.renyxera.workers.dev", font=fu(), fill=(88, 80, 140))
    sheet.paste(im.convert("RGB"), ((k % 2) * W, (k // 2) * (H + 30)))
sheet.resize((W * 3 // 2, (H + 30) * 5 * 3 // 4)).save("D:/tmp/og_variants10c.png")
# personalised ("custom") card: sender block replaces the chips; sample data
av = Image.new("RGB", (400, 400), (99, 102, 241)); ImageDraw.Draw(av).ellipse((120, 70, 280, 230), fill=(255, 255, 255)); ImageDraw.Draw(av).ellipse((60, 250, 340, 520), fill=(255, 255, 255))
def custom(k, layout):
    name, ft, fs, fc, fu, style = STY[k]; im = base(fs, name.split(" / ")[0] + " · custom", ft)
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
for i, k in enumerate((0, 1, 3, 8)):
    cs.paste(custom(k, 0).convert("RGB"), ((i % 2) * W, (i // 2) * (H + 30)))
cs.resize((W * 3 // 2, (H + 30) * 3 // 2)).save("D:/tmp/og_custom_c.png"); print("ok")
