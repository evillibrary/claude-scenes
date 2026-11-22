# Hourglass Nebula

The Hourglass Nebula (MyCn 18) in Musca: a dying star has blown two great shells of gas, one above the other, that meet at a narrow waist, and at the waist glows a bright teal "eye" with the star itself, a small white point, just off its middle. It stands upright on the LEFT of a black star field. It is traced from a real Hubble photograph into brush strokes, the same way as the Ring Nebula scene.

## The picture

- **Source:** the Hubble WFPC2 image of the Hourglass Nebula, MyCn 18 (released 16 January 1996, PRC96-07).
  - Page: https://science.nasa.gov/asset/hubble/planetary-nebula-mycn18-an-hourglass-pattern-around-a-dying-star/ (also https://science.nasa.gov/image-detail/hourglass-nebula/ ).
  - File used: NASA's full-size file from that page, `https://assets.science.nasa.gov/content/dam/science/missions/hubble/releases/1996/01/STScI-01EVTAS57C47H3258SZY8J8SB5.jpg`, **2061 × 2557 pixels** (the nebula is 852 × 1459 of them). The person asked for the highest-resolution copy; NASA's 1280 × 1280 and 800 × 800 versions of the same picture are cut down from it. The file has the release's caption boxes and colour bar below the picture; the crop stays clear of them.
- **Credit:** Raghvendra Sahai and John Trauger (JPL), the WFPC2 science team, and NASA. NASA images are public domain; the credit stays with it anyway (README and here).
- **Kept where:** the original goes in `sources/hourglass-hubble-full.jpg`, which git ignores. (`sources/hourglass-hubble.jpg` is the 1280 × 1280 copy tried first; not used.) `make-picture.cjs` crops it to x 501-1591, y 202-1922 (a margin of black sky round the nebula, centred on it), shrinks that to a 350 × 552 grid of colours, fades the edges to black and saves `hourglass-pixels.bin.gz`. That small file is committed, so the scene builds without the original.
- **Colour:** the photo's walls are orange-red and its eye green-cyan, in the false colours of the release (red = nitrogen, green = hydrogen, blue = oxygen). The scene wants pink-red walls (`#e0607a`) and a teal-blue eye (`#5fb8c8`), so `make-picture.cjs` uses a new `grade` option of `generators/lib/make-pixels.cjs` (a colour function run on the photo before it is shrunk): it lends strong reds a share of blue (the olive haze between the walls is left alone), and takes 12 off every channel so the photo's grainy sky comes out black instead of a faint dirty rectangle round the nebula. The tracer's `sat` is 1.5 here (1.85 in the Ring) so the pink does not go magenta.

## How it is drawn

As the Ring, with the same compact brushwork of session 6:

1. **Underpainting:** broad, faint strokes laying down the soft colour.
2. **Filaments:** continuous lines of relative steps that follow the photo's grain (`fil.chain`), `res: 2`, `order: 'nearest'`; the grid is 350 pixels wide so a pixel is 1.35 scene units. About 52,000 spots in 3,700 lines; the filament step is 0.595, which fits the drawing to about 123,300 characters (the build allows 125,000 for a still drawing with a shader).
3. **Sparks:** the brightest points, as dots.

Each palette colour is one `<path>`. The whole picture is 472 units wide and about 745 tall (the nebula itself about 640 tall), centred at x 420, y 380 (moved 50 units left from x 470 at the person's request, after the scene was first finished; a further 50 was tried, looked too far and was undone; the stars were left exactly where they were, so the generator works the still stars and the clear zone out from the old centre, `STAR_C`).

## What moves

The drawing is completely still (see the Ring's philosophy for why: anything changing in the SVG near thousands of traced strokes froze the app). A GPU shader written by `generators/lib/shader.mjs` plays all the motion over it:

- **Twinkling stars all over the sky**, mostly white, some yellow-white, white-blue and a few orange-gold, each dipping to about half and pulsing up brighter on its own cycle; about 33 bright cross stars spread over the sky, and a band of small stars hugging the nebula.
- **The clear zone** is an ellipse 250 × 350 units round the nebula (an hourglass fits it only roughly: the corners of the shells are inside it, the sky beside the waist is left empty).
- **The white dwarf** in the eye is a small still point and halo in the drawing, with a steady pale cross from the shader.
- **Six more cross stars placed by hand:** a larger yellowish one bottom right, a larger faintly blue one right of the hourglass's top, a white-blue one bottom left, and (asked for by the person) a medium white one and a medium slightly orange one on the middle right, and a medium, more orange one at the top left just left of the nebula.
- **A slow comet** crosses the upper right of the sky every 241 s, well clear of the nebula.
- **Two shooting stars** fall on the right side of the sky, on 223 s and 289 s cycles.
- **Still, in the drawing:** about 460 faint stars and four faint far galaxies on the right.

No filters or blend modes in the SVG. On the phone, under Reduce Motion, or where shaders don't play, the still drawing shows alone.

## Palette and mood

- **Sky:** true black (`#000`), and the frosted glass over it is tinted black too.
- **Nebula:** pink-red outer walls, a gold-green haze between them, a teal-blue eye with a pink rim, a white point. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent pink-red `#e0607a`, the eye's teal `#5fb8c8` as a second colour, near-black navy text panels.

It stands on the left (the person moved it there from the right it was first planned on), clear of the middle and the bottom, where the text and the message box sit.
