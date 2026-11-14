"""Two original hero characters, drawn from scratch in code (14 Nov 2026).

  Bit    a small hover-bot: cream shell, dark face screen, two yellow eyes, coral body
  Clawd  the Claude Code mascot: a squat terracotta block with tall eyes, arms and four legs

Method (her pixel rules): shapes for the bodies, hand-placed face blocks, every feature a
cluster of 2+ pixels, soft coloured outlines (never pure black), checked at 10x.
Writes public/art/bit.png, public/art/clawd.png (2 frames each) and qa/creatures_view.png.
"""
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def hx(s, a=255):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), a)


CREAM, CREAM_SH, CREAM_DK, WHITE = hx("FFF3E3"), hx("E6D0C4"), hx("BFA3A6"), hx("FFFFFF")
CORAL, CORAL_SH, CORAL_LT = hx("FF5A57"), hx("C93E4A"), hx("FF8A7A")
SCREEN, SCREEN_LT = hx("2A1724"), hx("4A2B3F")
YELLOW, YELLOW_LT, ORANGE = hx("FFD43B"), hx("FFF0A8"), hx("FF8B3D")
LINE = hx("3D1028")  # plum outline
MINT, MINT_LT, MINT_SH, MINT_DK, MINT_LINE = hx("5FE0C0"), hx("C4FBEA"), hx("2FB79C"), hx("1F8F7F"), hx("14524C")
EYE = hx("14323A")


def outline(im, colour):
    """One-pixel outline around every opaque pixel (4-neighbour), in a soft colour."""
    src = im.load()
    out = im.copy()
    o = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            if src[x, y][3]:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and src[nx, ny][3]:
                    o[x, y] = colour
                    break
    return out


def bit(flame=0, glow=0):
    """Hover-bot on a 30x40 canvas (1 px margin for the outline)."""
    im = Image.new("RGBA", (30, 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    ox, oy = 1, 1

    def R(x0, y0, x1, y1, c, r=0):
        box = [ox + x0, oy + y0, ox + x1, oy + y1]
        d.rounded_rectangle(box, r, fill=c) if r else d.rectangle(box, fill=c)

    # antenna: stalk and ball
    R(13, 4, 14, 7, CREAM_DK)
    d.ellipse([ox + 11, oy + 0, ox + 16, oy + 5], fill=CORAL if not glow else CORAL_LT)
    R(12, 1, 13, 2, CORAL_LT if not glow else YELLOW_LT)
    # head shell with light from the top left
    R(2, 7, 25, 24, CREAM, 5)
    R(21, 10, 25, 22, CREAM_SH, 2)
    R(4, 22, 23, 24, CREAM_SH, 2)
    R(5, 8, 16, 8, WHITE)
    # side bolts
    R(0, 13, 1, 18, CORAL)
    R(26, 13, 27, 18, CORAL_SH)
    # face screen
    R(5, 10, 22, 21, SCREEN, 3)
    R(7, 11, 20, 11, SCREEN_LT)
    # eyes: 3x5 blocks with a lighter top
    for ex in (8, 17):
        R(ex, 13, ex + 2, 17, YELLOW)
        R(ex, 13, ex + 2, 14, YELLOW_LT)
    # neck
    R(11, 25, 16, 26, LINE)
    # body
    R(7, 26, 20, 33, CORAL, 3)
    R(18, 27, 20, 32, CORAL_SH, 1)
    R(9, 32, 19, 33, CORAL_SH, 1)
    R(9, 27, 14, 27, CORAL_LT)
    R(12, 28, 15, 30, YELLOW if not glow else YELLOW_LT)
    # arms
    R(3, 27, 5, 31, CREAM, 1)
    R(22, 27, 24, 31, CREAM_SH, 1)
    im = outline(im, LINE)
    # thruster flame under the body (drawn after the outline so it glows without a border)
    d = ImageDraw.Draw(im)
    if flame == 0:
        d.rectangle([ox + 11, oy + 35, ox + 16, oy + 36], fill=YELLOW)
        d.rectangle([ox + 12, oy + 37, ox + 15, oy + 38], fill=ORANGE)
    else:
        d.rectangle([ox + 10, oy + 35, ox + 17, oy + 36], fill=YELLOW_LT)
        d.rectangle([ox + 11, oy + 37, ox + 16, oy + 37], fill=YELLOW)
        d.rectangle([ox + 12, oy + 38, ox + 15, oy + 38], fill=ORANGE)
    return im


def blip(squash=0):
    """Mint slime on a 30x22 canvas, bottom aligned."""
    W, H = 30, 22
    w, h = (24, 17) if not squash else (26, 15)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0 = (W - w) // 2
    y1 = H - 2
    y0 = y1 - h + 1
    # dome: an ellipse twice the height, clipped by the canvas floor
    d.ellipse([x0, y0, x0 + w - 1, y0 + h * 2 - 2], fill=MINT)
    d.rectangle([0, y1 + 1, W, H], fill=(0, 0, 0, 0))
    px = im.load()
    for y in range(H):
        for x in range(W):
            if y > y1 and px[x, y][3]:
                px[x, y] = (0, 0, 0, 0)
    # belly shade along the bottom and right
    for y in range(y1 - 2, y1 + 1):
        for x in range(W):
            if px[x, y][3]:
                px[x, y] = MINT_SH
    for y in range(y0, y1 + 1):
        for x in range(x0 + w - 4, x0 + w):
            if px[x, y][3]:
                px[x, y] = MINT_SH if y < y1 - 2 else MINT_DK
    # glossy highlight, top left
    d.rectangle([x0 + 5, y0 + 3, x0 + 9, y0 + 4], fill=MINT_LT)
    d.rectangle([x0 + 4, y0 + 5, x0 + 5, y0 + 6], fill=MINT_LT)
    # face: two tall eyes and a small smile, centred
    cx = W // 2
    ey = y0 + (7 if not squash else 5)
    for ex in (cx - 5, cx + 3):
        d.rectangle([ex, ey, ex + 1, ey + 3], fill=EYE)
    d.rectangle([cx - 2, ey + 5, cx + 1, ey + 5], fill=EYE)
    d.rectangle([cx - 3, ey + 4, cx - 3, ey + 4], fill=EYE)
    d.rectangle([cx + 2, ey + 4, cx + 2, ey + 4], fill=EYE)
    # cheeks
    d.rectangle([cx - 8, ey + 4, cx - 7, ey + 5], fill=hx("FF9FB0"))
    d.rectangle([cx + 6, ey + 4, cx + 7, ey + 5], fill=hx("FF9FB0"))
    return outline(im, MINT_LINE)


CLAY, CLAY_LT, CLAY_SH, CLAY_DK, CLAY_LINE = hx("D97757"), hx("F0A07E"), hx("B85C42"), hx("96462F"), hx("4A2018")


def clawd(dip=0):
    """The Claude Code mascot: a squat terracotta block with two tall eyes, stubby arms
    and four little legs. 28x22 canvas, bottom aligned; `dip` lowers the body one cell."""
    W, H = 28, 22
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bx0, bx1 = 4, 23  # body 20 wide
    by0 = 1 + dip
    by1 = by0 + 13  # body 14 tall
    floor = H - 2
    # legs first (two pairs), so the body sits on them
    for lx in (5, 10, 16, 21):
        d.rectangle([lx, by1 + 1, lx + 1, floor], fill=CLAY if lx < 14 else CLAY_SH)
    # arms: one block each side, low on the body
    d.rectangle([1, by0 + 7, 3, by0 + 10], fill=CLAY)
    d.rectangle([1, by0 + 7, 3, by0 + 7], fill=CLAY_LT)
    d.rectangle([24, by0 + 7, 26, by0 + 10], fill=CLAY_SH)
    # body with light from the top left
    d.rectangle([bx0, by0, bx1, by1], fill=CLAY)
    d.rectangle([bx0, by0, bx1 - 3, by0], fill=CLAY_LT)
    d.rectangle([bx0, by0 + 1, bx0, by0 + 5], fill=CLAY_LT)
    d.rectangle([bx1 - 2, by0 + 1, bx1, by1], fill=CLAY_SH)
    d.rectangle([bx0, by1 - 1, bx1, by1], fill=CLAY_SH)
    d.rectangle([bx1 - 2, by1 - 1, bx1, by1], fill=CLAY_DK)
    # eyes: two tall dark blocks
    for ex in (9, 17):
        d.rectangle([ex, by0 + 3, ex + 1, by0 + 7], fill=SCREEN)
    return outline(im, CLAY_LINE)

def strip(a, b):
    s = Image.new("RGBA", (a.width * 2, a.height))
    s.alpha_composite(a, (0, 0))
    s.alpha_composite(b, (a.width, 0))
    return s


b0, b1 = bit(0, 0), bit(1, 1)
s0, s1 = clawd(0), clawd(1)
strip(b0, b1).save(os.path.join(ROOT, "public", "art", "bit.png"))
strip(s0, s1).save(os.path.join(ROOT, "public", "art", "clawd.png"))

k = 10
view = Image.new("RGBA", (1260, 420), hx("C93E4A"))
x = 10
for spr in (b0, b1, s0, s1):
    big = spr.resize((spr.width * k, spr.height * k), Image.NEAREST)
    view.alpha_composite(big, (x, 410 - big.height))
    x += big.width + 10
view.convert("RGB").save(os.path.join(ROOT, "qa", "creatures_view.png"))
print("bit", b0.size, "clawd", s0.size)
