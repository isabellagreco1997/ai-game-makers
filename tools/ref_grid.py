"""Measures the pixel grid of the mascots in the founder's reference thumbnail and
prints each as a letter grid, so they can be redrawn in code against the real thing.

python tools/ref_grid.py  -> qa/ref_ninja_grid.png, qa/ref_cat_grid.png + letter grids
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = r"C:\Users\imber\Zero\ai-game-makers-package\original_visual_reference.png"
im = Image.open(REF).convert("RGB")


def period(sig):
    """Dominant spacing of edges in a 1-D edge-strength signal."""
    sig = sig - sig.mean()
    best = None
    for p in np.arange(4.0, 7.01, 0.02):
        for off in np.arange(0, p, 0.25):
            idx = np.round(np.arange(off, len(sig) - 1, p)).astype(int)
            score = sig[idx].mean()
            if best is None or score > best[0]:
                best = (score, p, off)
    return best[1], best[2]


def analyse(name, box):
    crop = im.crop(box)
    a = np.array(crop).astype(np.int16)
    gx = np.abs(np.diff(a, axis=1)).sum(axis=2).sum(axis=0).astype(float)
    gy = np.abs(np.diff(a, axis=0)).sum(axis=2).sum(axis=1).astype(float)
    px, ox = period(gx)
    py, oy = period(gy)
    print(name, "cell", round(px, 2), round(py, 2), "offset", round(ox, 2), round(oy, 2))
    xs = np.arange(ox + 1, crop.width, px)
    ys = np.arange(oy + 1, crop.height, py)
    cells = []
    for j in range(len(ys) - 1):
        row = []
        for i in range(len(xs) - 1):
            x0, x1 = int(round(xs[i] + 1)), int(round(xs[i + 1] - 1))
            y0, y1 = int(round(ys[j] + 1)), int(round(ys[j + 1] - 1))
            c = np.median(a[y0:y1, x0:x1].reshape(-1, 3), axis=0)
            row.append(tuple(int(v) for v in c))
        cells.append(row)
    s = 24
    view = Image.new("RGB", (crop.width * 4 + len(cells[0]) * s + 20, max(crop.height * 4, len(cells) * s)), "white")
    big = crop.resize((crop.width * 4, crop.height * 4), Image.NEAREST)
    d = ImageDraw.Draw(big)
    for x in xs:
        d.line([(x * 4, 0), (x * 4, big.height)], fill=(0, 255, 255))
    for y in ys:
        d.line([(0, y * 4), (big.width, y * 4)], fill=(0, 255, 255))
    view.paste(big, (0, 0))
    d = ImageDraw.Draw(view)
    for j, row in enumerate(cells):
        for i, c in enumerate(row):
            x0 = crop.width * 4 + 20 + i * s
            d.rectangle([x0, j * s, x0 + s - 1, j * s + s - 1], fill=c)
            if i % 5 == 0 and j == 0:
                d.text((x0 + 2, 2), str(i), fill=(255, 255, 255))
        d.text((crop.width * 4 + 2, j * s + 6), str(j), fill=(0, 0, 0))
    view.save(os.path.join(ROOT, "qa", f"ref_{name}_grid.png"))
    return cells




def letters(cells):
    out = []
    for row in cells:
        s = ""
        for r, g, b in row:
            mx, mn = max(r, g, b), min(r, g, b)
            if mx < 75:
                s += "k"
            elif mn > 185:
                s += "W"
            elif mn > 120 and mx - mn < 70:
                s += "g"
            elif r > 200 and g > 170 and b < 140:
                s += "y"
            elif r > 215 and g > 110 and b < 110 and g - b > 40:
                s += "o"
            elif r < 150:
                s += "d"
            elif r < 205:
                s += "m"
            else:
                s += "."
        out.append(s)
    return out


for nm, box in (("ninja", (88, 104, 208, 216)), ("cat", (12, 168, 104, 250))):
    print(nm)
    for i, line in enumerate(letters(analyse(nm, box))):
        print(f"{i:2d} {line}")
