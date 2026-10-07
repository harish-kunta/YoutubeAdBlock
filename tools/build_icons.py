"""Render the extension's custom video-and-shield icon at Chrome's required sizes.

Requires Pillow for development only. Generated PNGs are the runtime assets.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SCALE = 4
SIZE = 128


def render_icon(size: int) -> Image.Image:
    side = SIZE * SCALE
    image = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    def box(coords):
        return tuple(round(value * SCALE) for value in coords)

    draw.rounded_rectangle(box((4, 4, 124, 124)), radius=30 * SCALE, fill="#101827")
    # Make the blocked object itself explicit: a high-contrast AD label, crossed
    # out with the familiar prohibition mark. The geometry stays legible at 16 px.
    draw.rounded_rectangle(box((18, 35, 110, 93)), radius=9 * SCALE, fill="#F8FAFC")
    font_paths = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    )
    font = None
    for font_path in font_paths:
        try:
            font = ImageFont.truetype(font_path, 43 * SCALE)
            break
        except OSError:
            continue
    if font is None:
        font = ImageFont.load_default(size=43 * SCALE)
    label = "AD"
    bounds = draw.textbbox((0, 0), label, font=font)
    label_width = bounds[2] - bounds[0]
    label_height = bounds[3] - bounds[1]
    draw.text(
        ((side - label_width) / 2 - bounds[0], (side - label_height) / 2 - bounds[1]),
        label, font=font, fill="#101827",
    )

    red = "#E53243"
    draw.ellipse(box((13, 13, 115, 115)), outline=red, width=8 * SCALE)
    draw.line([box((35, 94)), box((94, 35))], fill=red, width=10 * SCALE)

    resampling = getattr(Image, "Resampling", Image).LANCZOS
    return image.resize((size, size), resampling)


for icon_size in (16, 48, 128):
    output = ROOT / "icons" / f"icon{icon_size}.png"
    render_icon(icon_size).save(output, format="PNG", optimize=True)
    print(f"Wrote {output.relative_to(ROOT)}")
