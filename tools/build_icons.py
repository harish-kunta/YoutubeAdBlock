"""Render the extension's custom video-and-shield icon at Chrome's required sizes.

Requires Pillow for development only. Generated PNGs are the runtime assets.
"""

from pathlib import Path

from PIL import Image, ImageDraw


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
    draw.rounded_rectangle(
        box((22, 27, 101, 87)), radius=10 * SCALE,
        fill="#1C2B3D", outline="#668099", width=5 * SCALE,
    )
    # Red video glyph gives an immediate YouTube cue; the framed screen and shield
    # keep the overall silhouette distinct from YouTube's standalone logo.
    draw.polygon([box((44, 42)), box((44, 72)), box((69, 57))], fill="#FF3347")
    draw.rounded_rectangle(box((48, 91, 76, 96)), radius=2 * SCALE, fill="#668099")
    draw.rounded_rectangle(box((39, 98, 85, 103)), radius=2 * SCALE, fill="#668099")

    # Shield overlays the player corner to communicate protected, distraction-free viewing.
    shield = [
        box((83, 64)), box((106, 72)), box((104, 89)),
        box((82, 108)), box((60, 89)), box((59, 72)),
    ]
    draw.polygon(shield, fill="#E52D3C")
    draw.line(
        [box((70, 85)), box((79, 93)), box((95, 78))],
        fill="#FFFFFF", width=5 * SCALE, joint="curve",
    )

    resampling = getattr(Image, "Resampling", Image).LANCZOS
    return image.resize((size, size), resampling)


for icon_size in (16, 48, 128):
    output = ROOT / "icons" / f"icon{icon_size}.png"
    render_icon(icon_size).save(output, format="PNG", optimize=True)
    print(f"Wrote {output.relative_to(ROOT)}")
