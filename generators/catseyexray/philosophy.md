# Cat's Eye Nebula, Hubble + Chandra X-ray

The same nebula as `generators/catseye` (NGC 6543 in Draco), traced from the Chandra X-ray plus Hubble optical composite of 2008: a blue glow of multi-million-degree gas (the X-rays) inside pink-violet shells, with orange-red tips and faint rust-brown rings round it. It fills the RIGHT of a black star field and is traced into brush strokes the same way as the other nebulae. Fourth of four Cat's Eye scenes (see PLAN.md).

## The picture

- **Source:** Chandra Photo Album, NGC 6543, released 30 July 2008. X-ray data (blue) from Chandra, optical data (red and purple) from Hubble.
  - Page: https://chandra.si.edu/photo/2008/catseye/
  - File used: https://chandra.si.edu/photo/2008/catseye/catseye_lg.jpg, **3600 x 3600 pixels, 6.3 MB** (the page also offers catseye.jpg at 864 x 864 and a 9.8 MB TIFF).
- **Credit (exactly as the page gives it):** X-ray: NASA/CXC/SAO; Optical: NASA/STScI.
- **Licence:** the page names no licence. Chandra's Image Use Policy (https://chandra.si.edu/photo/image_use.html) says: for Chandra content "no claim to copyright is being asserted and the material may be used in accordance with NASA guidelines", with a request that NASA/SAO be given all appropriate acknowledgement, and that images with non-NASA data may carry the owners' copyright. The data here is NASA's (Chandra, Hubble). The credit line stays in the README and here.
- **Kept where:** the original is `sources/catseyexray-lg.jpg` (git-ignored). `make-picture.cjs` crops 0.84 of it (x and y 0.08-0.92), shrinks it to a 480 x 480 grid, fades the edges and saves `catseyexray-pixels.bin.gz` (about 265 KB, committed). Grade: 8 off each channel, gamma 0.95.

## How it is drawn

As the other Cat's Eye scenes: underpainting, filaments along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), bright sparks. The photo is sharp and detailed, so the filament step is coarser than in the 1994 scene: 0.455 brings the whole scene to about 123,400 characters (steps 0.44 and below go over the 125,000 limit; the count rises slowly, then steeply). The whole drawing is dimmed to 88 %. Blur sizes in `trace` must be whole numbers. The picture is 868 units square, centred at x 1600, y 390, so the rings are about 620 units across, the same physical size as in the first Cat's Eye scene (rings about 620, tip to tip about 600); a 16:10 window (x 200-1800) crops the right of the outer rings. The star-free zone is an ellipse 310 x 315 round the centre.

## What moves

Nothing in the SVG. The shader plays: twinkling stars all over the sky, about 33 cross stars, bands of stars hugging the nebula on every side, a steady cross on the central star, four hand-placed cross stars on the left, a comet on the upper left (251 s) and two shooting stars (227 s and 293 s). Still in the drawing: faint stars, a far spiral galaxy and four far galaxies on the left.

## Palette and mood

Orange-red tips (accent #e8603c), blue X-ray heart (#5f86f0), pink-violet shells, rust-brown rings, near-black navy text panels. Calm and dark in the middle and at the bottom.
