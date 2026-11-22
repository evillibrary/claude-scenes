# Twin Jet Nebula

The Twin Jet Nebula (PN M2-9, "the Butterfly") in Ophiuchus: a dying star and its companion have blown out two great lobes of gas and a pair of jets. It stretches across the upper right of a black star field, tilted with its right end up, as in the older 1997 Hubble picture of it. It is traced from a real Hubble photograph into brush strokes, the same way as the Ring Nebula scene.

## The picture

- **Source:** the 2015 Hubble image of the Twin Jet Nebula (ESA/Hubble heic1518a).
  - Page: https://esahubble.org/images/heic1518a/ (news release: https://esahubble.org/news/heic1518a/ ; also on NASA at https://science.nasa.gov/image-detail/the-twin-jet-nebula/ )
  - File used: the "Large JPEG", `https://cdn.esahubble.org/archives/images/large/heic1518a.jpg`, 988 × 826 pixels. (ESA's "Fullsize Original" TIFF is the same size, 1.4 MB, so nothing sharper exists.)
  - The 1997 WFPC2 image (NASA, public domain; https://science.nasa.gov/asset/hubble/supersonic-exhaust-from-nebula-m2-9/ ) was the fallback. The person looked at both and chose the 2015 one, **turned to the 1997 picture's angle**: the 1997 lobes lean about 22° (right end up), the 2015 photo is nearly level, so the traced picture is turned 20° anticlockwise in the scene.
- **Credit:** ESA/Hubble & NASA, Acknowledgement: Judy Schmidt. The picture is licensed CC BY 4.0, so the full credit must stay with it (README and here).
- **Kept where:** the original goes in `sources/twinjet-heic1518a.jpg`, which git ignores. `make-picture.cjs` crops it to a band across the lobes (y 282 to 572 of 826, the whole width), shrinks it to a 700-pixel-wide grid of colours (700 × 205), fades the two open tips softly to black, and saves `twinjet-pixels.bin.gz`. That small file is committed, so the scene builds without the original. `sources/twinjet-1997-wfpc2-1280.jpg` is a look-at copy of the 1997 picture, not used by the build.
- The photo's two open tips (the lobes run off both sides of the frame) fade out over the outer 78 % of each half (`fade.x` in `make-picture.cjs`, a long fade option added to `generators/lib/make-pixels.cjs` for flat, wide nebulae). A shorter fade left blunt, square-cut ends.
- The bright star with spikes just above the nebula in the photo is cropped out of the traced strip (traced, it came out as a smudge) and drawn instead as a proper cross star by the shader, at its true place.

## How it is drawn

As the Ring, with the same compact brushwork of session 6:

1. **Underpainting:** broad, faint strokes laying down the soft colour.
2. **Filaments:** continuous lines of relative steps that follow the photo's grain (`fil.chain`), `res: 2`, `order: 'nearest'`; the grid is 700 pixels wide, so a pixel is 1.43 scene units. About 50,000 spots in 3,800 lines. The filament step is 0.66 (it fits the drawing to about 124,000 characters; the build allows 125,000 for a still drawing with a shader).
3. **Sparks:** the brightest points, as dots.

Each palette colour is one `<path>`. The whole picture sits in a group that translates, turns by `ANGLE` (-50°, see below) and scales it into place, so the tilt costs nothing.

## What moves

The drawing is completely still (see the Ring's philosophy for why: anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion over it:

- **Twinkling stars all over the sky**, mostly white, some yellow-white, white-blue and a few orange-gold, each dipping to about half and pulsing up brighter on its own 3 to 9 s cycle; about 33 bright cross stars spread over the sky, and a band of small stars hugging the nebula's slanted outline.
- **The clear zone** is a tilted ellipse (`avoid` with `rot`, added to the shader for this scene), 340 × 105 units, turned -50° like the nebula.
- **The central star** (the nebula's own binary) is a small still point and halo in the drawing, with a steady pale cross from the shader.
- **The orange-gold star above the nebula**, a cross star placed by hand at its place in the photo, and three more placed by hand (bottom left, lower right, top).
- **A pair of distant stars on the left of the sky** (a new shader option, `binary`) circle each other, one orbit every 61 s, about (330, 330), 26 units apart: a warm orange-gold one on the smaller orbit and a blue-white one on the larger, as a quiet echo of the binary at the nebula's heart.
- **Two shooting stars** fall on the left side of the sky, on 211 s and 277 s cycles. There is no comet in this scene.
- **Still, in the drawing:** about 460 faint stars and four faint far galaxies on the left.

No filters or blend modes in the SVG. On the phone, under Reduce Motion, or where shaders don't play, the still drawing shows alone.

## Palette and mood

- **Sky:** true black (`#000`), and the frosted glass over it is tinted black too.
- **Nebula:** the photo's own colours: blue-violet wings, a green-teal waist, warm orange-red rims and knots, and a bright white centre. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent blue-violet `#7d8cff`, the jets' orange `#e07a4a` as a second colour, near-black navy text panels.

It is centred at x 1590, y 370, about 850 units along its axis, tilted 50° with its right end up, standing steeply on the right of the sky (November 2026, at the person's request: it was first turned 20° like the 1997 picture, then 50°). At 50° the long way is mostly up and down, so the length was cut from 1,000 to 850 units to keep its upper tip below the top edge and its lower tip well above the text box. Its upper tip fades out at the right edge of the screen. Tried and put back: a 1,750-unit version centred in the window, reaching past the text on both sides, which the person looked at and did not want. The middle and the bottom stay dark and calm, where the text and the message box sit.
