"""Draws every pixel-art asset of the site at true 1x pixel size.

Run: python tools/make_art.py   (writes public/art/*.png and qa/art_sheet.png)

The site scales these with image-rendering: pixelated at whole multiples,
so every art pixel stays square. Mascots follow the founder's reference
(hooded runner with red scarf, orange block cat); everything else is drawn
here from the brief's palette.
"""
from __future__ import annotations

import math
import os
import random

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "art")
QA = os.path.join(ROOT, "qa")
os.makedirs(OUT, exist_ok=True)
os.makedirs(QA, exist_ok=True)


def hx(s: str, a: int = 255):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), a)


# Brand palette plus the art ramps built from it
CORAL = hx("FF5A57")
ORANGE = hx("FF8B3D")
PLUM = hx("5A1B3B")
CHAR = hx("2A1724")
CREAM = hx("FFF3E3")
YELLOW = hx("FFD43B")
INK = hx("1A0D16")

PAL = {
    ".": (0, 0, 0, 0),
    "k": INK,
    "K": CHAR,
    "w": CREAM,
    "g": hx("D8C2B8"),
    "G": hx("9C8590"),
    "f": hx("140A12"),
    "y": YELLOW,
    "Y": hx("F4A72A"),
    "r": hx("E8423F"),
    "R": CORAL,
    "d": hx("A92B35"),
    "D": hx("6E1A2A"),
    "o": ORANGE,
    "O": hx("FFB067"),
    "u": hx("C8612A"),
    "b": hx("3A1A28"),
    "p": PLUM,
    "P": hx("7E2C55"),
    "v": hx("9B4C8E"),
    "V": hx("C77DB8"),
    "l": hx("6FA8FF"),
    "L": hx("BFE0FF"),
    "B": hx("2F5FD0"),
    "n": hx("4CB050"),
    "N": hx("8EDB5A"),
    "e": hx("2E7A3A"),
    "t": hx("8A5A3C"),
    "T": hx("B98258"),
    "s": hx("4A2B3F"),
    "S": hx("6B4560"),
    "q": hx("8E6A84"),
    "m": hx("FF9AA8"),
    "M": hx("FFC9CF"),
    "x": hx("FFFFFF"),
    "z": hx("3B2350"),
    "Z": hx("5B3A7A"),
    "a": hx("2A1F3D"),
}


def grid(rows: list[str], name: str) -> Image.Image:
    w = max(len(r) for r in rows)
    im = Image.new("RGBA", (w, len(rows)), (0, 0, 0, 0))
    for y, row in enumerate(rows):
        for x, ch in enumerate(row.ljust(w, ".")):
            if ch not in PAL:
                raise ValueError(f"{name}: unknown colour '{ch}' at {x},{y}")
            im.putpixel((x, y), PAL[ch])
    return im


def save(im: Image.Image, name: str) -> Image.Image:
    im.save(os.path.join(OUT, name + ".png"), optimize=True)
    return im


def strip(frames: list[Image.Image]) -> Image.Image:
    w, h = frames[0].size
    s = Image.new("RGBA", (w * len(frames), h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        s.alpha_composite(f, (i * w, 0))
    return s


# ---------------------------------------------------------------- mascots
NINJA_A = [
    "...........kk.........",
    "..........kwwk........",
    ".........kwwwwk.......",
    "........kwwwwwwk......",
    ".......kwwwwwwwgk.....",
    "......kwwwwwwwwwgk....",
    "......kwwkkkkkkwgk....",
    "......kwkffffffkwk....",
    "......kwkfyffyfkwk....",
    "......kwkfyffyfkwk....",
    "......kwkffffffkgk....",
    "..kk..kwwkkkkkkwgk....",
    ".krrk.krrrrrrrrrrk....",
    "kdrrrkkrrrrrrrrrrrk...",
    ".kkdrrrrrrrrrrrrrrk...",
    "...kkkbbbbbwbbbbbk....",
    "......krrrrrrrrrrk....",
    "......krddrrrrddrk....",
    "......kkkk.kk.kkkk....",
    "......kbbk....kbbk....",
    "......kkkk....kkkk....",
]
NINJA_B = [
    "......................",
    "...........kk.........",
    "..........kwwk........",
    ".........kwwwwk.......",
    "........kwwwwwwk......",
    ".......kwwwwwwwgk.....",
    "......kwwwwwwwwwgk....",
    "......kwwkkkkkkwgk....",
    "......kwkffffffkwk....",
    "......kwkfyffyfkwk....",
    "......kwkfyffyfkwk....",
    "......kwkffffffkgk....",
    ".kk...kwwkkkkkkwgk....",
    "kdrkk.krrrrrrrrrrk....",
    ".kdrrkkrrrrrrrrrrrk...",
    "..kkrrrrrrrrrrrrrrk...",
    "....kkbbbbbwbbbbbk....",
    "......krrrrrrrrrrk....",
    "......krddrrrrddrk....",
    "......kbbk.kk.kbbk....",
    "......kkkk....kkkk....",
]

CAT_A = [
    ".kk.................",
    "kOOk................",
    "kOok................",
    "kook..kkkkkkkkkkkkk.",
    "kuook.kOOOOOOOOOOOk.",
    ".kuookoooooooooooook",
    "..kuokoookkoookkook.",
    "...kkkoookxoookxook.",
    "......kookkoookkook.",
    "......koooooooooook.",
    "......kooookkkooook.",
    "......koooooooooook.",
    "......kuuuuuuuuuuuk.",
    "......kukkukkukkukk.",
    "......kk.kk.kk.kk.k.",
]


def _cat_b() -> list[str]:
    """Second idle frame: the raised arm dips one pixel."""
    rows = [list(r) for r in CAT_A]
    arm = [r[:6] for r in rows]
    for y in range(len(rows) - 1, 0, -1):
        if y <= 5:
            rows[y][:6] = arm[y - 1]
    rows[0][:6] = list("......")
    return ["".join(r) for r in rows]


CAT_B = _cat_b()
GHOST_A = [
    "....kkkkkk....",
    "..kkwwwwwwkk..",
    ".kwwwwwwwwwwk.",
    ".kwwwwwwwwwwk.",
    "kwwwkkwwkkwwwk",
    "kwwwkkwwkkwwwk",
    "kwwwwwwwwwwwwk",
    "kwwmmwwwwmmwwk",
    "kwwwwwkkwwwwwk",
    "kwwwwwwwwwwggk",
    "kwwwwwwwwwwggk",
    "kgwwwwwwwwgggk",
    "kgkwwkgwwkgkgk",
    ".k.kk.kkk.k.k.",
]
GHOST_B = [
    "..............",
    "....kkkkkk....",
    "..kkwwwwwwkk..",
    ".kwwwwwwwwwwk.",
    ".kwwwwwwwwwwk.",
    "kwwwkkwwkkwwwk",
    "kwwwkkwwkkwwwk",
    "kwwmmwwwwmmwwk",
    "kwwwwwkkwwwwwk",
    "kwwwwwwwwwwggk",
    "kwwwwwwwwwwggk",
    "kgwwwwwwwwgggk",
    "kgkwwgkwwkgkgk",
    "k.kk.kk.kk.k.k",
]

COIN = [
    [
        "..kkkk..",
        ".kyyyyk.",
        "kyYyyyyk",
        "kyYyxyyk",
        "kyYyxyyk",
        "kyYyyyyk",
        ".kyyyYk.",
        "..kkkk..",
    ],
    [
        "...kk...",
        "..kyyk..",
        "..kYyk..",
        "..kYxk..",
        "..kYxk..",
        "..kYyk..",
        "..kyyk..",
        "...kk...",
    ],
    [
        "...kk...",
        "...ky...",
        "...kY...",
        "...kY...",
        "...kY...",
        "...kY...",
        "...ky...",
        "...kk...",
    ],
    [
        "...kk...",
        "..kyyk..",
        "..kyYk..",
        "..kxYk..",
        "..kxYk..",
        "..kyYk..",
        "..kyyk..",
        "...kk...",
    ],
]

SPARK = [
    "...k...",
    "..kyk..",
    "kkyxykk",
    "kyxxxyk",
    "kkyxykk",
    "..kyk..",
    "...k...",
]

FLAG_A = [
    "kkkkkkkkk..",
    "kwkRRRRRRk.",
    "kwkRRyRRRRk",
    "kwkRyyyRRk.",
    "kwkRRyRRk..",
    "kwkRRRRRk..",
    "kwkkkkkk...",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kgk........",
    "kkkkk......",
]
FLAG_B = [
    "kkkkkkkk...",
    "kwkRRRRRkk.",
    "kwkRRyRRRRk",
    "kwkRyyyRRRk",
    "kwkRRyRRRk.",
    "kwkRRRRRk..",
    "kwkkkkkk...",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kwk........",
    "kgk........",
    "kkkkk......",
]

# ---------------------------------------------------------------- icons (16x16)
ICONS = {
    "gamepad": [
        "................",
        "................",
        "................",
        "...kkkkkkkkkk...",
        "..kwwwwwwwwwwk..",
        ".kwwkwwwwwwrwwk.",
        ".kwkkkwwwwrwrwk.",
        ".kwwkwwwwwwrwwk.",
        ".kwwwwwkkwwwwwk.",
        ".kwwwwkggkwwwwk.",
        ".kwwwkk..kkwwwk.",
        ".kgggk....kgggk.",
        "..kkk......kkk..",
        "................",
        "................",
        "................",
    ],
    "laptop": [
        "................",
        "..kkkkkkkkkkkk..",
        "..kppppppppppk..",
        "..kpwwwwwwwwpk..",
        "..kpwkwwwwrwpk..",
        "..kpkkkwwrwrpk..",
        "..kpwkwwwwrwpk..",
        "..kpwwwwwwwwpk..",
        "..kppppppppppk..",
        "..kkkkkkkkkkkk..",
        ".kggggggggggggk.",
        "kgGGGGGGGGGGGGgk",
        "kkkkkkkkkkkkkkkk",
        "................",
        "................",
        "................",
    ],
    "books": [
        "................",
        "...kkkkkkkkkk...",
        "..kvvvvvvvvvvk..",
        "..kVVVVVVVVVwk..",
        "..kkkkkkkkkkkk..",
        "..koooooooooOk..",
        "..koyyyyyyyywk..",
        "..kkkkkkkkkkkk..",
        "..kllllllllllk..",
        "..kLLLLLLLLLwk..",
        "..kkkkkkkkkkkk..",
        "..krrrrrrrrrrk..",
        "..kRRRRRRRRRwk..",
        "..kkkkkkkkkkkk..",
        "................",
        "................",
    ],
    "rocket": [
        "..........kkk...",
        ".........kwwwk..",
        "........kwwRRk..",
        ".......kwwRRRk..",
        "......kwwwwRk...",
        ".....kwwlLwwk...",
        "..kk.kwwllwwk...",
        ".krrkkwwwwwk....",
        ".kRrkwwwwwk.....",
        "..kkwwwwwk......",
        "...kwwwwk.......",
        "..kyrkwk.kRk....",
        ".kyyrkk..krk....",
        ".kyrk.....kk....",
        "..kk............",
        "................",
    ],
    "crown": [
        "................",
        "................",
        "................",
        ".k.....kk.....k.",
        "kyk...kyyk...kyk",
        "kyyk..kyyk..kyyk",
        "kyyyk.kyyk.kyyyk",
        "kyyyykyyyykyyyyk",
        "kyyyyyyyyyyyyyyk",
        "kyyRyyyllyyyRyyk",
        "kYyyyyyyyyyyyyYk",
        "kYYYYYYYYYYYYYYk",
        "kkkkkkkkkkkkkkkk",
        "................",
        "................",
        "................",
    ],
    "joystick": [
        "......kkkk......",
        ".....kRRRrk.....",
        ".....kRxRrk.....",
        ".....kRRrrk.....",
        "......kkkk......",
        ".......kk.......",
        ".......kk.......",
        ".......kk.......",
        "...kkkkkkkkkk...",
        "..kGGGGkkGGGGk..",
        ".kggggggggggggk.",
        ".kgrkgggggglkgk.",
        ".kGGGGGGGGGGGGk.",
        ".kkkkkkkkkkkkkk.",
        "................",
        "................",
    ],
    "map": [
        "................",
        "..........kkk...",
        ".........kRRRk..",
        "..kkkk..kRRwRRk.",
        ".knnNkkkkRRRRRk.",
        ".kNNNwwwkkRRRk..",
        ".knnwwwlllkRk...",
        ".kNwwllllllkk...",
        ".knwllllnNNNNk..",
        ".kNwlllnnNNNNk..",
        ".knnwllnNNnnnk..",
        ".kNNnwwwnnnNNk..",
        ".kkkkkkkkkkkkk..",
        "................",
        "................",
        "................",
    ],
    "chat": [
        "................",
        "..kkkkkkkkkkkk..",
        ".kwwwwwwwwwwwwk.",
        ".kwwwwwwwwwwwwk.",
        ".kwwkkwwkkwwkkk.",
        ".kwwkkwwkkwwkkk.",
        ".kwwwwwwwwwwwwk.",
        ".kgwwwwwwwwwwgk.",
        "..kkkkwwkkkkkk..",
        ".....kwk........",
        "....kwk.........",
        "....kk..........",
        "................",
        "................",
        "................",
        "................",
    ],
    "calendar": [
        "................",
        "...k..k..k..k...",
        ".kkRkkRkkRkkRkk.",
        ".kRrRRrRRrRRrRk.",
        ".kRRRRRRRRRRRRk.",
        ".kkkkkkkkkkkkkk.",
        ".kwwwwwwwwwwwwk.",
        ".kwggwggwggwggk.",
        ".kwwwwwwwwwwwwk.",
        ".kwggwggwrrwggk.",
        ".kwwwwwwwrrwwwk.",
        ".kwggwggwggwggk.",
        ".kwwwwwwwwwwwwk.",
        ".kkkkkkkkkkkkkk.",
        "................",
        "................",
    ],
    "puzzle": [
        "................",
        "......kkkk......",
        ".....kVVvvk.....",
        "..kkkkVvvvkkkk..",
        "..kVVVVvvvvvvk..",
        "..kVvvvvvvvvvkk.",
        "..kvvvvvvvvvvvVk",
        "..kvvvvvvvvvvvvk",
        "..kvvvvvvvvvvkk.",
        "..kvvvvvvvvvvk..",
        "..kvvvvvvvvvvk..",
        "..kPPPPPPPPPPk..",
        "..kkkkkkkkkkkk..",
        "................",
        "................",
        "................",
    ],
    "ghost": [
        "................",
        "......kkkk......",
        "....kkwwwwkk....",
        "...kwwwwwwwwk...",
        "..kwwwwwwwwwwk..",
        "..kwwkkwwkkwwk..",
        "..kwwkkwwkkwwk..",
        "..kwwwwwwwwwwk..",
        "..kwwwwkkwwwwk..",
        "..kwwwwwwwwwgk..",
        "..kwwwwwwwwggk..",
        "..kgwwwwwwgggk..",
        "..kgkwwkgwkgkk..",
        "..k.kk.kk.k.k...",
        "................",
        "................",
    ],
    "house": [
        "................",
        ".......kk.......",
        "......kRRk.kk...",
        ".....kRRRRkkk...",
        "....kRRRRRRkk...",
        "...kRRRRRRRRk...",
        "..kRRRRRRRRRRk..",
        ".kkkkkkkkkkkkkk.",
        "..kwwwwwwwwwwk..",
        "..kwkkwwwwkkwk..",
        "..kwkykwwwkykk..",
        "..kwkkwkkwkkwk..",
        "..kwwwwktkwwwk..",
        "..kwwwwktkwwwk..",
        "..kkkkkkkkkkkk..",
        "................",
    ],
    "chip": [
        "................",
        "....k.k.k.k.....",
        "....k.k.k.k.....",
        "..kkkkkkkkkkkk..",
        "kkkwwwwwwwwwwkkk",
        "..kwkkkwwkkwwk..",
        "kkkwkwkwwwkwwkkk",
        "..kwkkkwwwkwwk..",
        "kkkwkwkwwwkwwkkk",
        "..kwkwkwwkkkwk..",
        "kkkwwwwwwwwwwkkk",
        "..kkkkkkkkkkkk..",
        "....k.k.k.k.....",
        "....k.k.k.k.....",
        "................",
        "................",
    ],
    "envelope": [
        "................",
        "................",
        "................",
        ".kkkkkkkkkkkkkk.",
        ".kwkwwwwwwwwkwk.",
        ".kwwkwwwwwwkwwk.",
        ".kwwwkwwwwkwwwk.",
        ".kwwwwkkkkwwwwk.",
        ".kwwwkwwwwkwwwk.",
        ".kwwkwwwwwwkwwk.",
        ".kwkwwwwwwwwkwk.",
        ".kgggggggggggggk",
        ".kkkkkkkkkkkkkk.",
        "................",
        "................",
        "................",
    ],
    "trophy": [
        "................",
        "..kkkkkkkkkkkk..",
        ".kkyyyyyyyyyykk.",
        "kykyyxyyyyyyykyk",
        "kykyyxyyyyyyykyk",
        ".kkyyyyyyyyyykk.",
        "...kyyyyyyyyk...",
        "....kyyyyyYk....",
        ".....kkYYkk.....",
        "......kYYk......",
        "......kYYk......",
        ".....kkkkkk.....",
        "....kttttttk....",
        "....kTTTTTTk....",
        "....kkkkkkkk....",
        "................",
    ],
    "pin": [
        "................",
        ".....kkkkkk.....",
        "....kRRRRRRk....",
        "...kRRRkkRRRk...",
        "...kRRkwwkRRk...",
        "...kRRkwwkRRk...",
        "...kRRRkkRRRk...",
        "....kRRRRRRk....",
        "....kRRRRRRk....",
        ".....kRRRRk.....",
        "......kRRk......",
        "......kRRk......",
        ".......kk.......",
        "................",
        "................",
        "................",
    ],
    "people": [
        "................",
        "......kkkk......",
        "..kk.kTTTTk.kk..",
        ".kTTkkTTTTkkTTk.",
        ".kTTkkTTTTkkTTk.",
        "..kk..kkkk..kk..",
        ".kllkkrrrrkkvvk.",
        "kllllkrrrrkvvvvk",
        "kllllkrrrrkvvvvk",
        "kllllkrrrrkvvvvk",
        "kkkkkkkkkkkkkkkk",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    "bulb": [
        "................",
        ".....kkkkkk.....",
        "....kyyyyyyk....",
        "...kyyxxyyyyk...",
        "...kyxyyyyyyk...",
        "...kyyyyyyyyk...",
        "...kyyyyyyyYk...",
        "....kyyyyyYk....",
        ".....kyyyYk.....",
        ".....kkkkkk.....",
        ".....kggggk.....",
        ".....kGGGGk.....",
        ".....kggggk.....",
        "......kkkk......",
        "................",
        "................",
    ],
    "play": [
        "................",
        "................",
        "....kk..........",
        "....kwk.........",
        "....kwwk........",
        "....kwwwk.......",
        "....kwwwwk......",
        "....kwwwwwk.....",
        "....kwwwwwk.....",
        "....kwwwwk......",
        "....kwwwk.......",
        "....kwwk........",
        "....kwk.........",
        "....kk..........",
        "................",
        "................",
    ],
    "star": [
        "................",
        ".......kk.......",
        "......kyyk......",
        "......kyyk......",
        ".....kyyyyk.....",
        "kkkkkkyyyykkkkkk",
        "kyyyyyyyyyyyyyyk",
        ".kyyyyyxyyyyyyk.",
        "..kyyyyxyyyyyk..",
        "...kyyyyyyyyk...",
        "...kyyyyyyyyk...",
        "..kyyyykkyyyyk..",
        "..kyyk....kyyk..",
        ".kyk........kyk.",
        ".kk..........kk.",
        "................",
    ],
    "check": [
        "................",
        ".kkkkkkkkkkkkkk.",
        ".kyyyyyyyyyyyyk.",
        ".kyyyyyyyyykkyk.",
        ".kyyyyyyyykkkyk.",
        ".kyyyyyyykkkyyk.",
        ".kykkyyykkkyyyk.",
        ".kykkkykkkyyyyk.",
        ".kyykkkkkyyyyyk.",
        ".kyyykkkyyyyyyk.",
        ".kyyyykyyyyyyyk.",
        ".kYYYYYYYYYYYYk.",
        ".kkkkkkkkkkkkkk.",
        "................",
        "................",
        "................",
    ],
    "arrow": [
        "................",
        "................",
        "................",
        "........kk......",
        "........kyk.....",
        "........kyyk....",
        ".kkkkkkkkyyyk...",
        ".kyyyyyyyyyyyk..",
        ".kyyyyyyyyyyyk..",
        ".kkkkkkkkyyyk...",
        "........kyyk....",
        "........kyk.....",
        "........kk......",
        "................",
        "................",
        "................",
    ],
}


# ---------------------------------------------------------------- scenery
def pines(w: int, h: int, body, edge, seed: int, min_h: int, max_h: int, step: int) -> Image.Image:
    """A tileable strip of pine silhouettes, stepped like pixel trees."""
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = im.load()
    x = 0
    trees = []
    while x < w:
        th = rnd.randint(min_h, max_h)
        trees.append((x, th))
        x += rnd.randint(step - 3, step + 3)
    for cx, th in trees:
        for dx in range(-14, 15):
            for y in range(h):
                depth = y - (h - th)
                if depth < 0:
                    continue
                half = 1 + depth // 2 - (2 if (depth % 6) < 2 and depth > 4 else 0)
                half = max(0, min(half, 10))
                if abs(dx) <= half:
                    xx = (cx + dx) % w
                    px[xx, y] = body
    # base fill so the strip has no gaps at the bottom
    for y in range(h - 12, h):
        for xx in range(w):
            px[xx, y] = body
    # one-pixel lighter rim on the left of each tier
    out = im.copy()
    o = out.load()
    for y in range(h):
        for xx in range(w):
            if px[xx, y][3] and not px[(xx - 1) % w, y][3]:
                o[xx, y] = edge
    return out


def bricks(w: int = 32, h: int = 16) -> Image.Image:
    """Platform tile: coral-lit top lip, then dark plum masonry."""
    im = Image.new("RGBA", (w, h), PAL["s"])
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w - 1, 1], fill=ORANGE)
    d.rectangle([0, 2, w - 1, 2], fill=CORAL)
    d.rectangle([0, 3, w - 1, 3], fill=INK)
    rows = [(4, 9, 0), (10, 15, 8)]
    for y0, y1, off in rows:
        d.rectangle([0, y1, w - 1, y1], fill=INK)
        for bx in range(-16 + off, w, 16):
            d.rectangle([bx, y0, bx, y1], fill=INK)
            d.line([bx + 1, y0, bx + 14, y0], fill=PAL["S"])
            d.point((bx + 2, y0 + 1), fill=PAL["q"])
            d.line([bx + 1, y1 - 1, bx + 15, y1 - 1], fill=CHAR)
    return im


def bricks_plain(w: int = 32, h: int = 16) -> Image.Image:
    """Masonry without the lit lip, for platform bodies."""
    im = Image.new("RGBA", (w, h), PAL["s"])
    d = ImageDraw.Draw(im)
    for y0, y1, off in [(0, 7, 0), (8, 15, 8)]:
        d.rectangle([0, y1, w - 1, y1], fill=INK)
        for bx in range(-16 + off, w, 16):
            d.rectangle([bx, y0, bx, y1], fill=INK)
            d.line([bx + 1, y0, bx + 14, y0], fill=PAL["S"])
            d.point((bx + 2, y0 + 1), fill=PAL["q"])
            d.line([bx + 1, y1 - 1, bx + 15, y1 - 1], fill=CHAR)
    return im


def moon(r: int = 22) -> Image.Image:
    s = r * 2 + 2
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    px = im.load()
    c = r + 0.5
    base, shade, light = hx("D8343E"), hx("A82535"), hx("F0544F")
    for y in range(s):
        for x in range(s):
            dx, dy = x - c, y - c
            dist = math.hypot(dx, dy)
            if dist <= r:
                col = base
                if dx + dy > r * 0.55:
                    col = shade if (x + y) % 2 == 0 or dx + dy > r * 0.85 else base
                if dx + dy < -r * 0.75:
                    col = light if (x + y) % 2 == 0 or dx + dy < -r * 1.0 else base
                px[x, y] = col
    for cx, cy, cr in [(14, 15, 4), (28, 26, 5), (19, 32, 3), (32, 13, 2)]:
        for y in range(cy - cr, cy + cr + 1):
            for x in range(cx - cr, cx + cr + 1):
                if 0 <= x < s and 0 <= y < s and math.hypot(x - cx, y - cy) <= cr and px[x, y][3]:
                    px[x, y] = shade
    return im


def cloud(w: int, h: int, seed: int) -> Image.Image:
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    top, low = hx("FF9A8E"), hx("F06A6E")
    d.rectangle([2, h - 3, w - 3, h - 1], fill=low)
    x = 3
    while x < w - 6:
        bw = rnd.randint(6, 10)
        bh = rnd.randint(3, h - 1)
        d.rectangle([x, h - bh, min(w - 3, x + bw), h - 3], fill=top)
        x += bw - 2
    return im


def stars_tile(n: int = 64, seed: int = 4) -> Image.Image:
    rnd = random.Random(seed)
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    for _ in range(9):
        x, y = rnd.randrange(n), rnd.randrange(n)
        im.putpixel((x, y), hx("FFE7C2", 220))
    for _ in range(2):
        x, y = rnd.randrange(2, n - 2), rnd.randrange(2, n - 2)
        for dx, dy in [(0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)]:
            im.putpixel((x + dx, y + dy), hx("FFF3E3", 230))
    return im


# ---------------------------------------------------------------- genre scenes (96x54)
def scene_platformer() -> Image.Image:
    im = Image.new("RGBA", (96, 54), PAL["l"])
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 95, 14], fill=hx("5B97F0"))
    d.rectangle([0, 15, 95, 26], fill=PAL["l"])
    d.rectangle([0, 27, 95, 53], fill=hx("8CC4FF"))
    for cx, cy in [(14, 10), (60, 6), (82, 14)]:
        d.rectangle([cx, cy, cx + 12, cy + 3], fill=PAL["x"])
        d.rectangle([cx + 3, cy - 2, cx + 8, cy], fill=PAL["x"])
    for hx0 in range(0, 96, 24):
        d.polygon([(hx0, 40), (hx0 + 12, 30), (hx0 + 24, 40)], fill=hx("6CC070"))
    d.rectangle([0, 40, 95, 53], fill=hx("6CC070"))

    def block(x0, y0, x1, y1):
        d.rectangle([x0, y0, x1, y1], fill=PAL["t"])
        d.rectangle([x0, y0, x1, y0 + 3], fill=PAL["n"])
        d.rectangle([x0, y0, x1, y0], fill=PAL["N"])
        for yy in range(y0 + 6, y1, 4):
            for xx in range(x0 + (yy // 4 % 2) * 3, x1, 6):
                d.point((xx, yy), fill=PAL["T"])
        d.rectangle([x0, y0, x1, y1], outline=INK)

    block(-1, 44, 40, 54)
    block(52, 36, 97, 54)
    block(30, 26, 50, 31)
    for cx in (34, 40, 46):
        im.alpha_composite(grid(COIN[0], "coin"), (cx - 3, 16))
    nin = grid(NINJA_A, "ninja")
    im.alpha_composite(nin, (8, 44 - nin.height))
    return im


def scene_puzzle() -> Image.Image:
    im = Image.new("RGBA", (96, 54), PAL["a"])
    d = ImageDraw.Draw(im)
    for y in range(0, 54, 8):
        off = 0 if (y // 8) % 2 == 0 else 8
        for x in range(-16 + off, 96, 16):
            d.rectangle([x, y, x + 15, y + 7], fill=PAL["z"], outline=hx("1E1530"))
            d.line([x + 1, y + 1, x + 14, y + 1], fill=PAL["Z"])
    d.rectangle([0, 46, 95, 53], fill=hx("1E1530"))
    d.line([0, 46, 95, 46], fill=PAL["Z"])

    def crate(x, y, glow=False):
        d.rectangle([x, y, x + 13, y + 13], fill=ORANGE if glow else hx("C8612A"), outline=INK)
        d.rectangle([x + 2, y + 2, x + 11, y + 11], outline=YELLOW if glow else hx("FFB067"))
        d.line([x + 2, y + 2, x + 11, y + 11], fill=YELLOW if glow else hx("FFB067"))
        d.line([x + 11, y + 2, x + 2, y + 11], fill=YELLOW if glow else hx("FFB067"))

    crate(14, 32, True)
    crate(30, 18, True)
    d.rectangle([44, 32, 57, 45], fill=hx("6A5A8E"), outline=INK)
    d.rectangle([46, 34, 55, 43], outline=hx("A99AD0"))
    d.line([46, 34, 55, 43], fill=hx("A99AD0"))
    d.line([55, 34, 46, 43], fill=hx("A99AD0"))
    # key
    d.ellipse([70, 14, 78, 22], outline=YELLOW, width=2)
    d.rectangle([73, 22, 75, 36], fill=YELLOW)
    d.rectangle([75, 30, 79, 31], fill=YELLOW)
    d.rectangle([75, 34, 78, 35], fill=YELLOW)
    for x, y in [(68, 12), (82, 20), (66, 30)]:
        d.point((x, y), fill=hx("FFF3E3"))
    return im


def scene_horror() -> Image.Image:
    im = Image.new("RGBA", (96, 54), hx("2A1F3D"))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 95, 12], fill=hx("1D1530"))
    d.rectangle([0, 30, 95, 53], fill=hx("3B2A55"))
    d.ellipse([70, 4, 86, 20], fill=hx("E6DDF2"))
    d.ellipse([74, 8, 78, 12], fill=hx("C9BCE0"))
    d.point((82, 14), fill=hx("C9BCE0"))
    # house
    d.rectangle([30, 22, 62, 46], fill=hx("1A1226"))
    d.polygon([(26, 23), (46, 8), (66, 23)], fill=hx("1A1226"))
    d.rectangle([52, 10, 55, 18], fill=hx("1A1226"))
    for wx, wy in [(35, 27), (52, 27), (44, 15)]:
        d.rectangle([wx, wy, wx + 4, wy + 4], fill=YELLOW)
        d.point((wx + 2, wy + 2), fill=hx("F4A72A"))
    d.rectangle([43, 37, 49, 46], fill=hx("F4A72A"))
    # dead trees
    for tx, flip in [(10, 1), (84, -1)]:
        d.line([tx, 46, tx, 24], fill=hx("120C1C"), width=2)
        d.line([tx, 32, tx + 6 * flip, 26], fill=hx("120C1C"))
        d.line([tx, 28, tx - 5 * flip, 22], fill=hx("120C1C"))
        d.line([tx + 6 * flip, 26, tx + 8 * flip, 27], fill=hx("120C1C"))
    d.rectangle([0, 46, 95, 53], fill=hx("120C1C"))
    for gx in (18, 70):
        d.rectangle([gx, 40, gx + 4, 46], fill=hx("4A3D62"))
        d.rectangle([gx + 1, 38, gx + 3, 39], fill=hx("4A3D62"))
    return im


def scene_cozy() -> Image.Image:
    im = Image.new("RGBA", (96, 54), PAL["L"])
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 95, 18], fill=hx("8CC4FF"))
    d.rectangle([0, 34, 95, 53], fill=hx("6CC070"))
    d.rectangle([0, 34, 95, 35], fill=PAL["N"])
    # path
    d.polygon([(44, 53), (52, 53), (50, 40), (46, 40)], fill=hx("E7C08A"))
    # house
    d.rectangle([30, 22, 62, 40], fill=hx("F4E2C6"), outline=INK)
    d.polygon([(26, 23), (46, 10), (66, 23)], fill=hx("D8343E"), outline=INK)
    d.rectangle([43, 30, 49, 40], fill=hx("8A5A3C"), outline=INK)
    for wx in (34, 54):
        d.rectangle([wx, 27, wx + 5, 32], fill=PAL["l"], outline=INK)
    # trees
    d.rectangle([12, 28, 14, 38], fill=PAL["t"])
    d.ellipse([4, 14, 22, 32], fill=hx("3E9A48"), outline=INK)
    d.ellipse([8, 17, 14, 22], fill=PAL["N"])
    d.rectangle([80, 28, 82, 38], fill=PAL["t"])
    d.ellipse([72, 12, 92, 32], fill=hx("FF9AC0"), outline=INK)
    d.ellipse([76, 15, 82, 20], fill=hx("FFD0E2"))
    # fence
    for fx in range(0, 30, 5):
        d.rectangle([fx, 38, fx + 2, 45], fill=PAL["w"], outline=INK)
    d.line([0, 41, 30, 41], fill=INK)
    for fx in range(66, 96, 5):
        d.rectangle([fx, 38, fx + 2, 45], fill=PAL["w"], outline=INK)
    d.line([66, 41, 96, 41], fill=INK)
    # crops
    for cx in range(8, 30, 6):
        d.rectangle([cx, 48, cx + 2, 50], fill=hx("2E7A3A"))
        d.point((cx + 1, 47), fill=ORANGE)
    return im


def main() -> None:
    made: dict[str, Image.Image] = {}
    made["ninja"] = save(strip([grid(NINJA_A, "ninja a"), grid(NINJA_B, "ninja b")]), "ninja")
    made["cat"] = save(strip([grid(CAT_A, "cat a"), grid(CAT_B, "cat b")]), "cat")
    made["ghost"] = save(strip([grid(GHOST_A, "ghost a"), grid(GHOST_B, "ghost b")]), "ghost")
    made["coin"] = save(strip([grid(f, "coin") for f in COIN]), "coin")
    made["spark"] = save(grid(SPARK, "spark"), "spark")
    made["flag"] = save(strip([grid(FLAG_A, "flag a"), grid(FLAG_B, "flag b")]), "flag")
    for name, rows in ICONS.items():
        made["icon-" + name] = save(grid(rows, name), "icon-" + name)
    made["pines-far"] = save(pines(160, 44, hx("A12F45"), hx("B8404F"), 3, 18, 34, 13), "pines-far")
    made["pines-mid"] = save(pines(144, 52, PLUM, hx("6E2448"), 7, 22, 42, 15), "pines-mid")
    made["pines-near"] = save(pines(128, 40, CHAR, hx("3A1F31"), 11, 18, 36, 17), "pines-near")
    made["bricks"] = save(bricks(), "bricks")
    made["bricks-plain"] = save(bricks_plain(), "bricks-plain")
    made["moon"] = save(moon(), "moon")
    made["cloud-a"] = save(cloud(34, 9, 2), "cloud-a")
    made["cloud-b"] = save(cloud(24, 7, 9), "cloud-b")
    made["stars"] = save(stars_tile(), "stars")
    made["scene-platformer"] = save(scene_platformer(), "scene-platformer")
    made["scene-puzzle"] = save(scene_puzzle(), "scene-puzzle")
    made["scene-horror"] = save(scene_horror(), "scene-horror")
    made["scene-cozy"] = save(scene_cozy(), "scene-cozy")

    # QA sheet: everything at 4x on a mid sunset tone so dark outlines read
    scale = 4
    pad = 8
    cols_w = 1400
    x = y = pad
    row_h = 0
    placed = []
    for name, im in made.items():
        w, h = im.size[0] * scale, im.size[1] * scale
        if x + w > cols_w:
            x = pad
            y += row_h + pad
            row_h = 0
        placed.append((name, im, x, y))
        x += w + pad
        row_h = max(row_h, h)
    sheet = Image.new("RGBA", (cols_w, y + row_h + pad), hx("C93E4A"))
    for name, im, x0, y0 in placed:
        sheet.alpha_composite(im.resize((im.size[0] * scale, im.size[1] * scale), Image.NEAREST), (x0, y0))
    sheet.save(os.path.join(QA, "art_sheet.png"))
    print(f"{len(made)} assets -> {OUT}")


if __name__ == "__main__":
    main()
