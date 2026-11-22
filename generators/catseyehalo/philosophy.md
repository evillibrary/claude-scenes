# Cat's Eye Nebula, outer halo

The same nebula as `generators/catseye` (NGC 6543 in Draco), but the picture is the ground-based photograph of its huge faint outer halo, over three light years across: a vast ragged cloud of amber filaments, with the small blue-white Cat's Eye at its heart. It fills the LEFT of a black star field and is traced into brush strokes the same way as the other nebulae. Second of four Cat's Eye scenes (see PLAN.md).

## The picture

- **Source:** ESA/Hubble heic0414b, taken with the Nordic Optical Telescope on La Palma (oxygen in blue, nitrogen in red, 1800 s each).
  - Page: https://esahubble.org/images/heic0414b/
  - File used: https://cdn.esahubble.org/archives/images/large/heic0414b.jpg, **2048 x 2048 pixels, 817 KB**.
- **Credit (as the page gives it):** Nordic Optical Telescope and Romano Corradi (Isaac Newton Group of Telescopes, Spain). The page says crediting with the full credit line, visibly, is mandatory; ESA/Hubble images are CC BY 4.0 in general (the page text did not state the licence itself), so the credit stays in the README and here.
- **Kept where:** the original is `sources/catseyehalo-nordic-full.jpg` (git-ignored). `make-picture.cjs` crops 0.9 of it (x 0.07-0.97, y 0.06-0.96), shrinks it to a 520 x 520 grid, fades the edges and saves `catseyehalo-pixels.bin.gz` (about 400 KB, committed). Grade: 30 off each channel, gamma 0.8, to take the sky glow off and lift the halo.

## How it is drawn

As the Cat's Eye (photo A): underpainting, filaments along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), bright sparks. The grid is coarser, so one pixel is about 1.6 scene units; filament step 1.52 brings the whole scene to about 123,500 characters; the bright strokes are brighter (lumGain 1.2, bright strokes 1.6 wide, fully opaque, whole drawing at full strength, not 80 %). The picture is 830 units square, centred at x 440, y 395 (the halo spans about x 30-850). The star-free zone is an ellipse 385 x 355 round it (centre 445, 395).

## What moves

Nothing in the SVG. The shader plays: twinkling stars all over the sky, about 33 cross stars, bands of stars hugging the nebula (including one straight below it), a steady cross on the central star, four hand-placed cross stars on the right, a comet on the upper right (251 s) and two shooting stars (227 s and 293 s). Still in the drawing: faint stars, a far spiral galaxy and four far galaxies on the right.

## Palette and mood

Amber and gold filaments (accent #d9a45a), blue-white heart (second colour #a8b4e8), near-black navy text panels, dimmed to 80 %. Calm and dark in the middle and at the bottom.
