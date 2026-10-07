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
    # Red video player cues YouTube; the crossed-out AD badge makes the function explicit.
    draw.rounded_rectangle(box((20, 29, 108, 91)), radius=13 * SCALE, fill="#E53243")
    draw.polygon([box((53, 42)), box((53, 78)), box((82, 60))], fill="#FFFFFF")

    badge = box((69, 66, 116, 113))
    draw.ellipse(badge, fill="#F8FAFC", outline="#101827", width=3 * SCALE)
    font_paths = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    )
    try:
        font = ImageFont.truetype(font_paths[0], 17 * SCALE)
    except OSError:
        font = ImageFont.truetype(font_paths[1], 17 * SCALE)
    bounds = draw.textbbox((0, 0), "AD", font=font)
    badge_center = ((69 + 116) * SCALE / 2, (66 + 113) * SCALE / 2)
    label_origin = (
        badge_center[0] - (bounds[2] - bounds[0]) / 2 - bounds[0],
        badge_center[1] - (bounds[3] - bounds[1]) / 2 - bounds[1],
    )
    draw.text(label_origin, "AD", font=font, fill="#E53243")
    draw.line([box((77, 104)), box((107, 74))], fill="#E53243", width=5 * SCALE)

    resampling = getattr(Image, "Resampling", Image).LANCZOS
    return image.resize((size, size), resampling)


for icon_size in (16, 48, 128):
    output = ROOT / "icons" / f"icon{icon_size}.png"
    render_icon(icon_size).save(output, format="PNG", optimize=True)
    print(f"Wrote {output.relative_to(ROOT)}")
