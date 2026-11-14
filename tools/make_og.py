"""Builds public/og.png (1200x630), the social share card, from the site's own art."""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "public", "art")
W, H, PX = 1200, 630, 4

BANDS = ["#5a1b3b", "#7a2240", "#a12f45", "#c93e4a", "#e84d50", "#ff5a57", "#ff7048", "#ff8b3d"]
STOPS = [0, 0.09, 0.18, 0.28, 0.39, 0.51, 0.64, 0.78, 1.0]


def art(name):
    return Image.open(os.path.join(ART, name + ".png")).convert("RGBA")


def up(im, k=PX):
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


def tile_x(canvas, im, y):
    for x in range(0, W, im.width):
        canvas.alpha_composite(im, (x, y))


def frame(strip, w):
    return strip.crop((0, 0, w, strip.height))


def font(size):
    for f in ["C:/Windows/Fonts/ariblk.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def outlined(d, xy, text, f, fill, stroke=7, drop=10):
    x, y = xy
    d.text((x, y + drop), text, font=f, fill="#1a0d16", stroke_width=stroke, stroke_fill="#1a0d16")
    d.text((x, y), text, font=f, fill=fill, stroke_width=stroke, stroke_fill="#1a0d16")


def main():
    c = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(c)
    for i, col in enumerate(BANDS):
        d.rectangle([0, int(STOPS[i] * H), W, int(STOPS[i + 1] * H)], fill=col)
    c.alpha_composite(up(art("moon")), (40, 24))
    c.alpha_composite(up(art("cloud-a")), (520, 120))
    ground = H - 16 * PX
    tile_x(c, up(art("pines-far")), ground - 20 * PX - 44 * PX)
    tile_x(c, up(art("pines-mid")), ground - 2 * PX - 52 * PX)
    tile_x(c, up(art("pines-near")), ground + 4 * PX - 40 * PX)
    tile_x(c, up(art("bricks")), ground)

    # founder photo, right
    p = Image.open(os.path.join(ROOT, "qa", "isabella_cut_strict.png")).convert("RGBA")
    ph = 520
    p = p.resize((int(p.width * ph / p.height), ph), Image.LANCZOS)
    c.alpha_composite(p, (W - p.width + 30, H - ph))

    # platform + mascots, left
    plat = up(art("bricks"))
    plain = up(art("bricks-plain"))
    c.alpha_composite(plain, (40, ground - 16 * PX))
    c.alpha_composite(plat, (40, ground - 32 * PX))
    cat = up(frame(art("clawd"), 28))
    c.alpha_composite(cat, (40 + 20, ground - 32 * PX - cat.height))
    run = up(frame(art("bit"), 30))
    c.alpha_composite(run, (600, ground - run.height - 8))

    d = ImageDraw.Draw(c)
    f1 = font(84)
    outlined(d, (210, 70), "MAKE YOUR", f1, "#fff3e3")
    outlined(d, (210, 170), "GAME HAPPEN.", f1, "#ffd43b")
    # plate
    f2 = font(30)
    text = "Learn AI by building real games"
    tw = d.textlength(text, font=f2)
    x0, y0 = 214, 300
    d.rounded_rectangle([x0, y0 + 6, x0 + tw + 40, y0 + 62], 12, fill="#1a0d16")
    d.rounded_rectangle([x0, y0, x0 + tw + 40, y0 + 56], 12, fill="#fff3e3", outline="#1a0d16", width=4)
    d.text((x0 + 20, y0 + 10), text, font=f2, fill="#1a0d16")
    # logo icon chip
    icon = Image.open(os.path.join(ART, "logo-icon.png")).convert("RGBA").resize((72, 72), Image.NEAREST)
    c.alpha_composite(icon, (214, 400))
    f3 = font(34)
    d.text((300, 418), "AI GAME MAKERS", font=f3, fill="#fff3e3", stroke_width=5, stroke_fill="#1a0d16")

    c.convert("RGB").save(os.path.join(ROOT, "public", "og.png"), optimize=True)
    print("og.png written")


if __name__ == "__main__":
    main()
