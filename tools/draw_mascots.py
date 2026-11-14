"""The two brand mascots, drawn in code cell by cell from the founder's own thumbnail
(original_visual_reference.png). tools/ref_grid.py measured the real grid there:
the hooded runner is 22x18 cells, the block cat 17x14. Nothing here is generated.

Writes public/art/runner.png and public/art/blockcat.png (two idle frames each) and
qa/mascots_vs_reference.png, which shows each sprite beside the reference crop.
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = r"C:\Users\imber\Zero\ai-game-makers-package\original_visual_reference.png"

P = {
    ".": (0, 0, 0, 0),
    "k": (30, 10, 12, 255),  # outline
    "W": (240, 230, 212, 255),  # hood cream
    "g": (190, 174, 164, 255),  # hood shade
    "f": (18, 12, 22, 255),  # face
    "y": (242, 206, 88, 255),  # eyes
    "r": (232, 62, 52, 255),  # body red
    "R": (240, 96, 84, 255),  # scarf light
    "d": (140, 30, 36, 255),  # belt / scarf shade
    "c": (240, 230, 212, 255),  # buckle, cuff
    "n": (30, 28, 44, 255),  # trousers
    "o": (240, 136, 60, 255),  # cat orange
    "O": (252, 172, 104, 255),  # cat light
    "u": (200, 96, 46, 255),  # cat shade
}

RUNNER_A = [
    "..............kk......",
    ".............kWWk.....",
    "............kWWWWk....",
    "...........kWWWWWWgk..",
    "..........kWWWWWWWWgk.",
    ".........kWWWfffffWWgk",
    ".........kWWfffffffWgk",
    ".........kWWfyfffyfWgk",
    ".kk......kWWfyfffyfWgk",
    "kRRk....kkgWfffffffWgk",
    ".kRRkkkkdrrrrrrrrrrrk.",
    "..kkRdRRRrrrrrrrrrrrk.",
    "....kkkRRkkrrrrrrrrrck",
    ".......kk.kddddcddddck",
    "..........krrrrrrrrrk.",
    "...........knnnnnnnk..",
    "............knnnnnk...",
    ".............kk.kk....",
]
# second frame: the scarf tail drops one cell
RUNNER_B = list(RUNNER_A)
RUNNER_B[8] = "........." + RUNNER_A[8][9:]
RUNNER_B[9] = ".kk....." + RUNNER_A[9][8:]
RUNNER_B[10] = "kRRkkkkkd" + RUNNER_A[10][9:]
RUNNER_B[11] = ".kkkRdRRR" + RUNNER_A[11][9:]

CAT_A = [
    ".kk..............",
    "kOOk.............",
    "kOuk.kkkkkkkkk...",
    "kOukkOOOOOOOOOk..",
    "kOukoooooooooouk.",
    "kOukookkoookkouk.",
    "kOooookWoookWouk.",
    ".kuoookkoookkoook",
    "..kkoooooooooouuk",
    "...kooookkkooouk.",
    "...kuuuuuuuuuuuk.",
    "...kOukOukOukOuk.",
    "...kuukuukuukuuk.",
    "...kkkkkkkkkkkkk.",
]
# second frame: the raised arm tips one cell lower
CAT_B = list(CAT_A)
CAT_B[0] = "................."
CAT_B[1] = ".kk.............."
CAT_B[2] = "kOOk.kkkkkkkkk..."


def grid(rows):
    w = len(rows[0])
    assert all(len(r) == w for r in rows), [len(r) for r in rows]
    im = Image.new("RGBA", (w, len(rows)))
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            im.putpixel((x, y), P[ch])
    return im


def strip(a, b):
    s = Image.new("RGBA", (a.width * 2, a.height))
    s.alpha_composite(a, (0, 0))
    s.alpha_composite(b, (a.width, 0))
    return s


ra, rb, ca, cb = grid(RUNNER_A), grid(RUNNER_B), grid(CAT_A), grid(CAT_B)
strip(ra, rb).save(os.path.join(ROOT, "public", "art", "runner.png"))
strip(ca, cb).save(os.path.join(ROOT, "public", "art", "blockcat.png"))

# check sheet: her reference (left) beside the code-drawn sprite (right), same size
ref = Image.open(REF).convert("RGB")
s = 12
sheet = Image.new("RGB", (1240, 300), (232, 77, 80))
x = 10
for crop_box, spr in (((88, 104, 208, 216), ra), ((12, 168, 104, 250), ca)):
    c = ref.crop(crop_box)
    k = 280 / c.height
    sheet.paste(c.resize((int(c.width * k), 280), Image.NEAREST), (x, 10))
    x += int(c.width * k) + 16
    big = spr.resize((spr.width * s, spr.height * s), Image.NEAREST)
    sheet.paste(big, (x, 290 - big.height), big)
    x += big.width + 40
sheet.save(os.path.join(ROOT, "qa", "mascots_vs_reference.png"))
print("runner", ra.size, "cat", ca.size)
