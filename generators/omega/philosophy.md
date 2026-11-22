# Omega Nebula

The Omega Nebula (M17, also the Swan, Checkmark or Horseshoe Nebula) in Sagittarius, a stellar nursery about 5,500 light years away. A bright turquoise bar of glowing gas with a pink lower edge, tangled rust-orange filaments streaming off to the left, green clouds on the right, and faint wisps reaching upwards. It fills the UPPER LEFT of a black star field. It is traced from a real photograph into brush strokes, the same way as the Helix Nebula scene.

## The picture

- **Source:** "The Omega Nebula, M17" (noao-m17e), a ratio image made from ten observations at the Burrell Schmidt telescope (Warner and Swasey Observatory, Case Western Reserve University, on Kitt Peak), May 1995, during the REU programme at Kitt Peak National Observatory (NSF supported). Red, green and blue come from the ratios H-alpha/SII, SII/HeI and OIII/H-beta; released 29 January 2003; image size 28.8 arcminutes.
  - Page: https://noirlab.edu/public/images/noao-m17e
  - File used: `https://storage.noirlab.edu/media/archives/images/large/noao-m17e.jpg`, **1700 x 1700 pixels, 1.16 MB** (the page also lists an 8.3 MB TIFF original, not used).
- **Credit (as the page gives it):** Hillary Mathis, N.A.Sharp, REU program/NOIRLab/NSF/AURA.
- **Licence:** the page's own text states no licence, only that crediting with the full credit line is mandatory. NOIRLab's usage policy for its images is CC BY 4.0 (to be checked against the usage page in the final review, session 19).
- **Chosen by the person** over a Hubble close-up (heic0206d), a Hubble "stormy sea" (heic0305a), ESO's VVVX infrared (eso2413b) and ESO's VST wide field (eso1119a), because the others are cropped tight so they would show square edges, while this one holds the whole nebula with dark sky all round.
- **Kept where:** the original goes in `sources/omega-noirlab-m17e-large.jpg`, which git ignores. `make-picture.cjs` crops it to x 0.04-0.86, y 0.02-0.97 (the faint wisps at the top and bottom need the tall crop), shrinks that to a 560 x 649 grid of colours (one pixel about 1.1 scene units), takes 27 off each channel (the photo's sky is dark red-brown) and lifts the rest with a gain of 1.4 and a gamma of 0.68, fades the edges to black and saves `omega-pixels.bin.gz`, which is committed.
- **Red specks:** the photo's stars come out as little red dots (the ratio image colours them oddly). They show as a few tiny red sparks in the trace; the real stars of the scene come from the still star field and the shader.

## How it is drawn

As the Helix: underpainting, filaments laid along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), sparks, each palette colour one `<path>`. The filament step is 1.17; the scene is 123,251 characters (the build allows 125,000). The picture is about 617 units wide and 715 tall, centred at x 410, y 385 (the person asked for it moved left and made about 20 % smaller than the first try).

## What moves

Nothing in the SVG: it is completely still. The shader from `generators/lib/shader.mjs` plays all the motion: twinkling stars all over the sky with about 33 cross stars, a band of small stars hugging the nebula (clear zone an ellipse 310 x 285 round x 405, y 395), four cross stars placed by hand, a slow comet across the upper right every 241 s and two shooting stars on the right on 223 s and 289 s cycles. Still, in the drawing: faint stars, a faint spiral galaxy and four far galaxies, all on the right. There is no central star, so no cross on the nebula.

## Palette and mood

- **Sky:** true black (`#000`), the frosted glass black too.
- **Nebula:** turquoise and white-cyan bar, pink edge, rust-orange and gold filaments, green clouds. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent orange `#e8703c`, turquoise `#4fd3c4` as a second colour, near-black navy text panels.

It sits upper left; its lower edge fades by about y 740, clear of the message box, and its right side stops near x 720, left of the text column. Its far-left wisps reach the edge of a 16:10 window.
