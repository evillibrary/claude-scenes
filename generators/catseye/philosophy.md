# Cat's Eye Nebula

The Cat's Eye Nebula (NGC 6543) in Draco, the shells of gas a dying Sun-like star has blown off. A bright blue-white heart with the star itself at its centre, curving peach and violet bubbles round it, two orange jets at the top right and bottom left, and a faint bull's-eye of pale rings round the whole. It fills the LEFT side of a black star field. It is traced from a real Hubble photograph into brush strokes, the same way as the Helix scene.

This is the first of four Cat's Eye scenes made from four different photographs (A here; see PLAN.md for the others).

## The picture

- **Source:** the Hubble ACS image "Dying star creates fantasy-like sculpture of gas and dust" (released 9 September 2004), option A.
  - Page: https://esahubble.org/images/heic0414a/ (NASA's copy: https://science.nasa.gov/asset/hubble/cats-eye-nebula/)
  - File used: ESA's "large" JPEG, `https://cdn.esahubble.org/archives/images/large/heic0414a.jpg`, **1417 × 1417 pixels, 443 KB** (the whole picture; the page lists no bigger file).
- **Credit (as the ESA page gives it):** ESA, NASA, HEIC and The Hubble Heritage Team (STScI/AURA). (NASA's page says "NASA, ESA, and the Hubble Heritage Team (STScI/AURA)".) ESA/Hubble images are CC BY 4.0, so the credit stays with it (README and here).
- **Kept where:** the original goes in `sources/catseye-hubble-full.jpg`, which git ignores. `make-picture.cjs` crops a square of 0.8 of it (x 0.09-0.89, y 0.10-0.90, round the faint rings), shrinks it to a 600 × 600 grid, fades the edges to black and saves `catseye-pixels.bin.gz` (about 590 KB). That small file is committed, so the scene builds without the original.
- **Colour:** the photo's own colours (blue-white heart, violet and peach shells, orange jets, teal-grey rings). Only the photo's blue sky haze is taken off (26 off each channel, gamma 0.85) so the sky is black and the rings read.

## How it is drawn

As the Helix, with the same compact brushwork: underpainting, filaments along the photo's grain (`fil.chain`, `res: 2`, `order: 'nearest'`), bright sparks, each colour one `<path>`. A pixel of the grid is 1.29 scene units; the filament step is 1.37, which brings the whole scene to about 123,300 characters (the build allows 125,000 for a still drawing with a shader). The picture is 772 units square, centred at x 440, y 390 (the faint rings span about x 125-790, y 80-740).

## What moves

The drawing is completely still (anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion over it:

- **Twinkling stars all over the sky** (white, yellow-white, white-blue, a few orange-gold), each dipping to about half and pulsing up brighter; about 33 bright cross stars, and a band of small stars hugging the nebula.
- **The clear zone** is an ellipse 320 × 325 units round the nebula (measured on a render).
- **The central star** is a small still point and halo in the drawing, with a steady pale cross from the shader.
- **Four cross stars placed by hand** on the right of the sky.
- **A slow comet** crosses the upper right every 251 s; **two shooting stars** fall on the right of the sky, on 227 s and 293 s cycles.
- **Still, in the drawing:** about 460 faint stars, a faint far spiral galaxy (right) and four faint far galaxies on the right.

On the phone, under Reduce Motion, or where shaders don't play, the still drawing shows alone.

## Palette and mood

Near-black navy text panels; the accent is the peach of the shells (#d99a78) and the second colour the violet-blue of the heart (#8aa0e0). Dimmed to 80 % because it sits behind text. Calm, dark, and quiet in the middle and at the bottom, where the text and message box sit.
