"""Composes the single hero illustration: a 160x120 pixel sunset level, at about the
same pixel density as the founder's thumbnail so the mascots sit in it at their true size.

Shown at whole-number scale only (x2, x3, x4) so every art pixel stays square.
Animated actors (runner, coins, flag) are layered on top in CSS, so this
image holds only the still world. Writes public/art/hero-world.png.
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "public", "art")
W, H = 160, 120
GROUND = 104  # top row of the brick ground

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
SKY = ["#4a1632", "#5a1b3b", "#7a2240", "#a12f45", "#c93e4a", "#e84d50", "#ff5a57", "#ff7048", "#ff8b3d", "#ffa94d"]


def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i : i + 2], 16) for i in (0, 2, 4)) + (255,)


def art(name, frame_w=None):
    im = Image.open(os.path.join(ART, name + ".png")).convert("RGBA")
    return im.crop((0, 0, frame_w, im.height)) if frame_w else im


def main():
    c = Image.new("RGBA", (W, H))
    px = c.load()
    # dithered sky: each band blends into the next with an ordered 4x4 pattern
    sky_h = GROUND
    n = len(SKY) - 1
    for y in range(sky_h):
        t = y / (sky_h - 1) * n
        i = min(int(t), n - 1)
        f = t - i
        for x in range(W):
            px[x, y] = hx(SKY[i + 1]) if f * 16 > BAYER[y % 4][x % 4] + 0.5 else hx(SKY[i])

    # stars in the top bands only
    for x, y in [(10, 5), (31, 12), (50, 4), (78, 9), (101, 6), (140, 11), (152, 4), (60, 18), (124, 16)]:
        px[x, y] = hx("#ffe7c2")
    for x, y in [(22, 8), (132, 7)]:
        for dx, dy in [(0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)]:
            px[x + dx, y + dy] = hx("#fff3e3")

    # big low sun, half behind the far hills
    sun = Image.new("RGBA", (W, H))
    sp = sun.load()
    cx, cy, r = 112, 70, 25
    for y in range(cy - r, cy + r + 1):
        for x in range(cx - r, cx + r + 1):
            if 0 <= x < W and 0 <= y < H and (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                band = (y - (cy - r)) // 6
                # classic striped synth-sun: gaps open up towards the bottom
                if band >= 5 and (y - (cy - r)) % 6 < (band - 4):
                    continue
                sp[x, y] = hx("#ffd43b") if y < cy - 12 else hx("#ffb347") if y < cy + 4 else hx("#ff8b3d")
    c.alpha_composite(sun)

    for name, x, y in [("cloud-a", 8, 26), ("cloud-b", 122, 18), ("cloud-b", 50, 44)]:
        c.alpha_composite(art(name), (x, y))

    def strip(name, y_bottom, offset):
        im = art(name)
        y = y_bottom - im.height
        for x in range(-offset, W, im.width):
            c.alpha_composite(im, (x, y))

    strip("pines-far", GROUND - 14, 30)
    strip("pines-mid", GROUND - 2, 70)
    strip("pines-near", GROUND + 6, 10)

    bricks = art("bricks")
    plain = art("bricks-plain")
    for x in range(0, W, bricks.width):
        c.alpha_composite(bricks, (x, GROUND))
        c.alpha_composite(plain, (x, GROUND + 16))

    def platform(x, rows, tiles=1):
        for t in range(tiles):
            for r in range(rows):
                c.alpha_composite(bricks if r == 0 else plain, (x + t * 32, GROUND - (rows - r) * 16))

    platform(56, 2)  # Bit hovers over this one
    platform(128, 3)  # goal flag

    # a few floating stepping blocks
    for bx, by in [(14, 40)]:
        c.alpha_composite(bricks.crop((0, 0, 16, 16)), (bx, by))
        c.alpha_composite(bricks.crop((16, 0, 32, 16)), (bx + 16, by))

    c.save(os.path.join(ART, "hero-world.png"))
    print("hero-world.png", c.size)


if __name__ == "__main__":
    main()
