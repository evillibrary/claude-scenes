# Southern Ring Nebula

The Southern Ring Nebula (NGC 3132, also called the Eight-Burst) in Vela: the shell of gas a dying star has blown off, with a second, brighter star at its heart. In the Webb mid-infrared view the dusty centre glows salmon-red and orange, wrapped in a lacy blue-white shell and a faint blue haze. It stands on the RIGHT of a black star field. It is traced from a real Webb photograph into brush strokes, the same way as the Helix and Crystal Ball scenes.

## The picture

- **Source:** the Webb MIRI (mid-infrared) image of the Southern Ring Nebula, released 12 July 2022.
  - Page: https://esawebb.org/images/weic2207c/
  - File used: `https://cdn.esawebb.org/archives/images/large/weic2207c.jpg`, **1306 × 1133 pixels, 239 KB** (the largest the page offers for this view).
  - Chosen by the person from three options: the Webb NIRCam image (weic2207b), this MIRI image, and the 1998 Hubble image (opo9839a, https://esahubble.org/images/opo9839a/).
- **Credit (as the page gives it):** NASA, ESA, CSA, STScI, and the Webb ERO Production Team. ESA/Webb images are CC BY 4.0, so the full credit stays with it (README and here).
- **Kept where:** the original goes in `sources/southernring-webb-miri-full.jpg`, which git ignores. `make-picture.cjs` crops it to x 0.20-0.88, y 0.10-0.92 of the picture (the nebula and its blue haze), shrinks that to a 520 × 544 grid of colours, fades the edges to black (a wide fade, so no square edge shows) and saves `southernring-pixels.bin.gz` (about 560 KB). That small file is committed, so the scene builds without the original.
- **Colour:** the photo's own colours, with 8 taken off each channel (the sky haze comes out black) and a gamma of 0.9.

## How it is drawn

As the Helix and Crystal Ball, with the Ring's compact brushwork: an underpainting of broad faint strokes, filaments as continuous lines along the photo's grain (`fil.chain`, `res: 2`, `order: 'nearest'`, filament step 1.4, about 25,600 spots in 4,200 lines) and sparks for the brightest points. Each palette colour is one `<path>`. The scene is about 123,600 characters (the build allows 125,000 for a still drawing with a shader). One grid pixel is 1.36 scene units; the picture is 707 units wide and 740 tall, centred at x 1590, y 400, so its blue haze touches the right edge of a 16:10 window.

## What moves

The drawing is completely still (anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion over it:

- **Twinkling stars all over the sky** in the star look (mostly white, some yellow-white, white-blue and a few orange-gold), about 33 cross stars spread over the sky, and a band of small stars hugging the nebula.
- **The clear zone** is an ellipse 345 × 385 units round the nebula.
- **The central pair of stars:** a small still point and halo in the drawing, with a steady cross from the shader on the brighter one, and a small cross on the second, dimmer star to its left.
- **Four cross stars placed by hand** on the left half of the sky.
- **A slow comet** crosses the upper left every 239 s, well clear of the nebula.
- **Two shooting stars** on the left side of the sky, on 223 s and 281 s cycles.
- **Still, in the drawing:** about 460 faint stars, a faint far spiral galaxy (lower left) and four faint far galaxies on the left.

On the phone, under Reduce Motion, or where shaders don't play, the still drawing shows alone.

## Palette and mood

- **Sky:** true black (`#000`), and the frosted glass over it is tinted black too.
- **Nebula:** salmon-red and orange heart, a pale blue-white lacy shell, blue haze, a white pair of stars. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent orange-red `#e8704f`, a second colour blue `#6fb4d8`, near-black navy text panels.

Its lower edge fades out about y 770, clear of the message box.
