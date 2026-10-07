#!/usr/bin/env python3
"""Generate the 440x280 Chrome Web Store promotional tile."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "store-assets" / "small-promo-440x280.png"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

image = Image.new("RGB", (440, 280), "#101217")
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((16, 16, 424, 264), radius=25, fill="#171a20", outline="#30343d", width=2)

bold = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)
medium = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)

# Original play-and-block mark. It references the video use case without copying
# YouTube's wordmark or claiming that the extension is an official product.
draw.rounded_rectangle((42, 39, 94, 77), radius=11, fill="#e62117")
draw.polygon(((63, 48), (63, 68), (79, 58)), fill="#ffffff")
draw.ellipse((76, 61, 102, 87), fill="#101217", outline="#ffffff", width=3)
draw.line((82, 81, 96, 67), fill="#e62117", width=4)

draw.text((42, 107), "YouTube Ad Controls", font=bold, fill="#ffffff")
draw.text((42, 145), "Hide common ad placements.", font=medium, fill="#e5e7eb")
draw.text((42, 168), "Hide Shorts when you choose.", font=medium, fill="#e5e7eb")

draw.rounded_rectangle((42, 207, 195, 239), radius=16, fill="#292d35")
draw.ellipse((51, 215, 66, 230), fill="#e62117")
draw.line((54, 227, 63, 218), fill="#ffffff", width=2)
draw.text((74, 215), "Unofficial extension", font=small, fill="#c6c9d0")

image.save(OUTPUT, format="PNG", optimize=True)
print(OUTPUT)
