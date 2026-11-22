# Crystal Ball Nebula

The Crystal Ball Nebula (NGC 1514) in Taurus: the shell of gas a dying pair of stars has blown off, seen in the mid-infrared by the James Webb Space Telescope. A great glassy bubble of dust and gas, with a bright pink-red heart, rings of orange and pale lilac along its edge, and the bright central pair of stars, one with Webb's eight-spiked glare. It stands on the middle of the LEFT side of a black star field. It is traced from the real Webb photograph into brush strokes, the same way as the Helix Nebula scene.

## The picture

- **Source:** the Webb MIRI image of NGC 1514, released 14 April 2025.
  - ESA/Webb page: https://esawebb.org/images/weic2508a/ (the page's own JPEG is 2315 × 2278 pixels).
  - File used: the original PNG from NASA's page https://science.nasa.gov/asset/webb/planetary-nebula-ngc-1514-miri-image/ , `https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2025/04/STScI-01JR92B3NYH10ZQ49KC8QMG569.png`, **2315 × 2278 pixels, 5.7 MB**. That is the largest picture there is: the "full resolution" print file the page mentions is not on the server, and the ESA and NASA pictures have the same size.
- **Credit:** NASA, ESA, CSA, STScI, Michael Ressler (NASA-JPL), Dave Jones (IAC). The image is CC BY 4.0 (ESA/Webb), so this credit must stay with it (README and here).
- **Kept where:** the original goes in `sources/crystalball-webb-full.png`, which git ignores. `make-picture.cjs` crops it to x 0.075-0.93, y 0.05-0.905 of the picture (the mosaic's black, cut-off corners mostly fall outside or fade to black), shrinks that to a 520 × 512 grid of colours, fades the edges to black and saves `crystalball-pixels.bin.gz` (590 KB). That small file is committed, so the scene builds without the original.
- **Colour:** the photo's own colours are used. The grade takes 6 off each channel (so the faint sky haze comes out black) and applies a gamma of 0.85 to lift the dim brown-red inner walls (`TAKE`, `GAMMA` in `make-picture.cjs`).

## How it is drawn

As the Helix and the Ring, with the compact brushwork of session 6:

1. **Underpainting:** broad, faint strokes laying down the soft colour.
2. **Filaments:** continuous lines of relative steps that follow the photo's grain (`fil.chain`), `res: 2`, `order: 'nearest'`; a pixel of the grid is 1.29 scene units. About 21,000 spots in 4,400 lines at a filament step of 1.7, for a drawing of about 123,500 characters (the build allows 125,000 for a still drawing with a shader).
3. **Sparks:** the brightest points, as dots.
4. **The central pair of stars:** two small still points with soft halos, over the stars the trace gives.

Each palette colour is one `<path>`. The picture is 670 units wide and the nebula about 620 across, centred at x 450, y 430, so it stands in the middle of the left side, its lower edge above y 750, clear of the message box.

## What moves

The drawing is completely still (anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion over it:

- **Twinkling stars all over the sky**, mostly white, some yellow-white, white-blue and a few orange-gold, each dipping to about half and pulsing up brighter on its own cycle; about 33 bright cross stars spread over the sky, and a band of small stars hugging the nebula.
- **The clear zone** is a circle of 335 units round the nebula.
- **The brighter central star** has a steady pale cross from the shader; the second, smaller star has a small cross.
- **Three cross stars placed by hand** on the right.
- **A slow comet** crosses the upper right of the sky every 239 s, well clear of the nebula.
- **Two shooting stars** fall on the right side of the sky, on 223 s and 281 s cycles.
- **Still, in the drawing:** about 460 faint stars, a faint far spiral galaxy (upper right) and four faint far galaxies on the right.

No filters or blend modes in the SVG. On the phone, under Reduce Motion, or where shaders don't play, the still drawing shows alone.

## Palette and mood

- **Sky:** true black (`#000`), and the frosted glass over it is tinted black too.
- **Nebula:** pink-red heart, orange and gold rim, pale lilac-white edges, a blue-white central pair. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent pink-red `#e8607a`, a second colour orange `#e89050`, near-black navy text panels.
