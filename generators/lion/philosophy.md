# Lion Nebula (NGC 2392), Webb

A planetary nebula in Gemini, about 6,500 light years away, better known as the Eskimo Nebula; the Webb team nicknamed it the Lion Nebula in 2026. It is NOT Sh2-132 in Cepheus, the other nebula called the Lion (no freely reusable professional picture of that one exists; see PLAN.md). It fills the RIGHT of a black star field, touching the window's right edge, and is traced into brush strokes the same way as the other nebulae. Chosen by the person from six options in session 16.

## The picture

- **Source:** ESA/Webb picture weic2616a, "Lion Nebula (NIRCam + MIRI image)", released 10 August 2026, near- and mid-infrared composite.
  - Page: https://esawebb.org/images/weic2616a/
  - File used: https://cdn.esawebb.org/archives/images/large/weic2616a.jpg, **3505 x 3505 pixels, 1.8 MB** (the full-size original is a 35.2 MB TIFF).
- **Credit (exactly as the page gives it):** NASA, ESA, CSA, STScI. Image Processing: A. Pagan (STScI).
- **Licence:** the page states none in its text, only that "crediting this image with the full credit line, in a visible way is MANDATORY". ESA/Webb's usage policy for images is CC BY 4.0 (Wikimedia Commons lists this picture as CC BY 4.0). Full credit stays in the README and here.
- **Kept where:** `sources/lion-webb-weic2616a-large.jpg` (git-ignored). `make-picture.cjs` crops the middle 0.66 of it, shrinks it to a 480 x 480 grid, fades the edges and saves `lion-pixels.bin.gz` (committed). Grade: 4 off each channel, gamma 0.95.

## How it is drawn

Underpainting, filaments along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), bright sparks, as the Cat's Eye X-ray scene. Filament step 1.03 brings the whole scene to about 123,800 characters (1.02 goes over the 124,000 target; 125,000 is the limit). The whole drawing is dimmed to 88 %. The picture is 817 units square, centred at x 1580, y 400 (moved right in two steps of 30 and 20 units while testing); the outer disc is about 540 units across. The star-free zone is an ellipse 290 x 290 round the centre.

## What moves

Nothing in the SVG. The shader plays: twinkling stars all over the sky, about 33 cross stars, bands of stars hugging the nebula, a steady cross on the central star, four hand-placed cross stars on the left, a comet on the upper left (251 s) and two shooting stars (227 s and 293 s). Still in the drawing: faint stars, a far spiral galaxy and four far galaxies on the left; the photo's own small galaxy sits below the nebula.

## Palette and mood

Pink-white shell (#e08ac8), blue-violet mane (accent #9aa8f0), teal (#6fc8d0), near-black navy text panels. Calm and dark in the middle and at the bottom.
