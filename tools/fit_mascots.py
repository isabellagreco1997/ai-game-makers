"""Cuts the two ChatGPT mascots off the green background and rebuilds each on its real
pixel grid with Pixelise's grid finder (pixel-fix/gridfind.mjs, @xprite/pixelate).

Input: qa/mascots_gpt.png (two characters on #00FF00).
Output: public/art/mascot-runner.png, public/art/mascot-cat.png (1x), qa/mascots_fit_view.png.
"""
import json
import os
import subprocess

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = os.path.join(os.path.expanduser("~"), "Projects", "pixelate", "node_modules", "@xprite", "pixelate")
GRIDFIND = r"C:\Users\imber\Zero\pixel-fix\gridfind.mjs"
WORK = os.path.join(ROOT, "qa", "gridwork")
os.makedirs(WORK, exist_ok=True)

src = Image.open(os.path.join(ROOT, "qa", "mascots_gpt.png")).convert("RGB")
a = np.array(src).astype(np.int16)
green = (a[:, :, 1] > 150) & (a[:, :, 1] - np.maximum(a[:, :, 0], a[:, :, 2]) > 60)
mask = ~green
cols = mask.sum(axis=0)
xs = np.where(cols > 0)[0]
gaps = np.where(np.diff(xs) > 20)[0]
split = (xs[gaps[0]] + xs[gaps[0] + 1]) // 2

items = []
for name, x0, x1 in [("mascot-runner", 0, split), ("mascot-cat", split, src.width)]:
    sub = mask[:, x0:x1]
    ys, xx = np.where(sub)
    t, b, l, r = ys.min(), ys.max() + 1, xx.min() + x0, xx.max() + 1 + x0
    rgba = np.zeros((b - t, r - l, 4), np.uint8)
    rgba[:, :, :3] = a[t:b, l:r].astype(np.uint8)
    rgba[:, :, 3] = mask[t:b, l:r] * 255
    rgba[mask[t:b, l:r] == 0] = 0
    open(os.path.join(WORK, name + ".rgba"), "wb").write(rgba.tobytes())
    items.append({"in": name + ".rgba", "w": int(r - l), "h": int(b - t), "out": name + "_out.rgba", "name": name})

json.dump({"items": items}, open(os.path.join(WORK, "manifest.json"), "w"))
res = subprocess.run(["node", GRIDFIND, PKG, os.path.join(WORK, "manifest.json")], capture_output=True, text=True)
lines = [json.loads(x) for x in res.stdout.strip().splitlines() if x.startswith("{")]
outs = []
for item, info in zip(items, lines):
    print(item["name"], info)
    if not info.get("ok"):
        continue
    raw = open(os.path.join(WORK, item["out"]), "rb").read()
    im = Image.frombytes("RGBA", (info["w"], info["h"]), raw)
    im = im.crop(im.getbbox())
    im.save(os.path.join(ROOT, "public", "art", item["name"] + ".png"))
    outs.append(im)
if res.stderr.strip():
    print(res.stderr[-600:])

if outs:
    s = 8
    W = sum(o.width for o in outs) * s + 40 * (len(outs) - 1)
    H = max(o.height for o in outs) * s
    view = Image.new("RGBA", (W, H), (255, 170, 110, 255))
    x = 0
    for o in outs:
        view.alpha_composite(o.resize((o.width * s, o.height * s), Image.NEAREST), (x, H - o.height * s))
        x += o.width * s + 40
    view.convert("RGB").save(os.path.join(ROOT, "qa", "mascots_fit_view.png"))


# The finder can misread a small, flat character. Both come from one drawing, so the cat
# is rebuilt at the runner's cell size (one median colour per cell, alpha by coverage).
def rebuild_at(name, cell_w, cell_h):
    item = next(i for i in items if i["name"] == name)
    rgba = np.frombuffer(open(os.path.join(WORK, item["in"]), "rb").read(), np.uint8).reshape(item["h"], item["w"], 4)
    H, W = rgba.shape[:2]
    w, h = round(W / cell_w), round(H / cell_h)
    out = Image.new("RGBA", (w, h))
    px = out.load()
    for j in range(h):
        for i in range(w):
            y0, y1 = int(j * H / h), int((j + 1) * H / h)
            x0, x1 = int(i * W / w), int((i + 1) * W / w)
            # inner 60% of the cell avoids bleed from neighbours
            my, mx = (y1 - y0) // 5, (x1 - x0) // 5
            cell = rgba[y0 + my : y1 - my, x0 + mx : x1 - mx]
            cov = (cell[:, :, 3] > 0).mean() if cell.size else 0
            if cov < 0.5:
                continue
            c = np.median(cell[cell[:, :, 3] > 0][:, :3], axis=0).astype(int)
            px[i, j] = (int(c[0]), int(c[1]), int(c[2]), 255)
    out = out.crop(out.getbbox())
    out.save(os.path.join(ROOT, "public", "art", name + ".png"))
    print(name, "rebuilt at", round(cell_w, 2), out.size)
    return out


runner_info = lines[0]
cat = rebuild_at("mascot-cat", runner_info["cell_w"], runner_info["cell_h"])
runner = Image.open(os.path.join(ROOT, "public", "art", "mascot-runner.png"))
s = 8
W = (runner.width + cat.width) * s + 40
H = max(runner.height, cat.height) * s
view = Image.new("RGBA", (W, H), (255, 170, 110, 255))
view.alpha_composite(runner.resize((runner.width * s, runner.height * s), Image.NEAREST), (0, H - runner.height * s))
view.alpha_composite(cat.resize((cat.width * s, cat.height * s), Image.NEAREST), (runner.width * s + 40, H - cat.height * s))
view.convert("RGB").save(os.path.join(ROOT, "qa", "mascots_fit_view.png"))
