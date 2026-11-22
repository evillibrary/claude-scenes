# Horsehead Nebula

The Horsehead Nebula (Barnard 33) in Orion, in the Hubble Space Telescope's infrared view: a towering, seahorse-shaped cloud of dust rising out of the glowing gas of IC 434. In infrared the dust is no longer a black silhouette; it glows rust-red and brown, its crown and flanks are edged with pale blue light, soft grey-blue haze trails off to the lower left, and a few bright stars (one on the crown, with spikes) shine through. It stands on the LEFT of a black star field, traced from the real photograph into brush strokes, the same way as the Helix Nebula scene.

## The picture

- **Source:** "New infrared view of the Horsehead Nebula", Hubble's 23rd anniversary image (heic1307a), released 19 April 2013.
  - ESA/Hubble page: https://esahubble.org/images/heic1307a/ (2704 × 2826 pixels).
  - File used: the page's "Large JPEG", https://esahubble.org/media/archives/images/large/heic1307a.jpg , **2704 × 2826 pixels, 2.4 MB**.
- **Credit:** NASA, ESA, and the Hubble Heritage Team (AURA/STScI). ESA/Hubble images are CC BY 4.0 and need the full credit, so it must stay with the picture (README and here).
- **Kept where:** the original goes in `sources/heic1307a-large.jpg`, which git ignores. `make-picture.cjs` keeps the whole picture, shrinks it to a 500 × 523 grid of colours (one pixel about 1.4 scene units) and fades it to black in a soft circle (`fade` radial, full inside 0.72 of the half-width, black beyond 1.28), so the square photo does not show as a square and its edges dissolve into the sky and saves `horsehead-pixels.bin.gz`, which is committed so the scene builds without the original.
- **Colour:** the photo's own colours. The grade takes 12 off each channel (so the dark blue sky comes out black) and applies a gamma of 0.8 to lift the dim rust-red dust (`TAKE`, `GAMMA` in `make-picture.cjs`).

## How it is drawn

As the Helix and the Crystal Ball, with the compact brushwork (`res: 2`, `order: 'nearest'`, `fil.chain`): an underpainting, filaments laid along the photo's grain at a step of 1.2, and sparks. About 24,700 spots in 4,750 lines, for a drawing of about 122,300 characters (the build allows 125,000 for a still drawing with a shader). Each palette colour is one `<path>`.

The picture is 700 units wide and about 732 tall, centred at x 470, y 400, so its glow runs off the left border of the window (a 16:10 window shows x 200-1800) and dissolves softly on every other side, above the message box.

## What moves

The drawing is completely still (anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion:

- Twinkling stars all over the sky, and about 33 cross stars, plus a band of small stars hugging the nebula. The zone kept clear of stars is an ellipse of 345 × 350 units round the head.
- A steady cross on the bright star on the head's crown, a smaller cross on the star on its left flank, and a few cross stars placed by hand on the right.
- A slow comet across the upper right, and shooting stars on the right of the sky.
- Still, in the drawing: faint stars, a far spiral galaxy and a few faint far galaxies on the right.

## Palette and mood

- **Sky:** true black (`#000`), and the frosted glass over it is tinted black too.
- **Nebula:** rust-red and brown dust, blue-white edges, grey-blue haze. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent rust `#d8704f`, a second colour blue `#6fa8d8`, near-black navy text panels.
