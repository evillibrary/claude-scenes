# Cat's Eye Nebula, Hubble 1994

The same nebula as `generators/catseye` (NGC 6543 in Draco), traced from the original Hubble photograph of 1994, the first sharp look at it: tangled red shells round a blue-white heart, with arcs of green and gold. It fills the RIGHT of a black star field and is traced into brush strokes the same way as the other nebulae. Third of four Cat's Eye scenes (see PLAN.md).

## The picture

- **Source:** ESA/Hubble opo9501a, taken with the Hubble Space Telescope's Wide Field and Planetary Camera 2 in 1994, released 11 January 1995.
  - Page: https://esahubble.org/images/opo9501a/
  - File used: https://cdn.esahubble.org/archives/images/large/opo9501a.jpg, **800 x 800 pixels, 99 KB**. (NASA hosts it too, but its files are no bigger.)
- **Credit (as the page gives it):** J.P. Harrington and K.J. Borkowski (University of Maryland), and NASA / ESA.
- **Licence:** the page itself states no licence name (no "CC BY" text). It says that crediting the image with the full credit line, in a visible way, is mandatory if it is used without paying a fee. So the full credit stays in the README and here. (The 1994 image was a NASA release, so it is normally NASA public domain; the credit is given regardless.)
- **Kept where:** the original is `sources/catseye1994-opo9501a.jpg` (git-ignored). `make-picture.cjs` crops 0.9 of it (x 0.05-0.95, y 0.05-0.95), shrinks it to a 400 x 400 grid, fades the edges and saves `catseye1994-pixels.bin.gz` (about 125 KB, committed). Grade: 14 off each channel, gamma 0.9, to take the grainy blue noise off the sky.

## How it is drawn

As the Cat's Eye (photo A): underpainting, filaments along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), bright sparks. The grid is small (one pixel is about 1.7 scene units), so the filament step has to be very fine, 0.176, to bring the whole scene to about 123,900 characters; the whole drawing is dimmed to 88 %. Blur sizes in `trace` must be whole numbers (a fractional one made every spot NaN). The picture is 680 units square, centred at x 1633, y 419; the nebula itself is about 570 units across, spanning about x 1353-1923 (its right edge nearly touches the right border of the full 2000-unit picture, which a wide window shows; a 16:10 window, x 200-1800, crops its right arc). The star-free zone is an ellipse 310 x 245 round it (centre 1643, 392).

## What moves

Nothing in the SVG. The shader plays: twinkling stars all over the sky, about 33 cross stars, bands of stars hugging the nebula on every side, a steady cross on the central star, four hand-placed cross stars on the left, a comet on the upper left (251 s) and two shooting stars (227 s and 293 s). Still in the drawing: faint stars, a far spiral galaxy and four far galaxies on the left.

## Palette and mood

Red filaments (accent #e0483a), green and gold arcs (success #8fdc78), blue-violet heart (#8f7ae8), near-black navy text panels. Calm and dark in the middle and at the bottom.
