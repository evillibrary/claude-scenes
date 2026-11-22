# Eagle Nebula

The Eagle Nebula (M16) in Serpens, 6,500 to 7,000 light years away, and its famous Pillars of Creation: three towering columns of dust and gas where stars are being born. Rust-brown pillars with glowing yellow-gold ridges, green-teal and blue glowing haze between and behind them, and a bright star between the first two pillars. It stands on the LEFT of a black star field (first planned for the right; the person moved it left during the app test). It is traced from a real Hubble photograph into brush strokes, the same way as the Helix and Omega Nebula scenes.

## The picture

- **Source:** "New view of the Pillars of Creation, visible" (heic1501a), Hubble's 2014 revisit of the pillars in visible light (filters Oiii, H-alpha, Sii; released 5 January 2015).
  - Page: https://esahubble.org/images/heic1501a/
  - File used: the "Large JPEG", `https://cdn.esahubble.org/archives/images/large/heic1501a.jpg`, **6780 x 7071 pixels, 25.6 MB** (the page also lists a 114.9 MB full-size original, not used).
- **Credit (as the page gives it):** NASA, ESA/Hubble and the Hubble Heritage Team.
- **Licence:** the page's own text states no licence, only that crediting with the full credit line is mandatory. ESA/Hubble's usage policy for its images is CC BY 4.0 (to be checked against the usage page in the final review, session 19).
- **Chosen by the person** (option A) over the 1995 Hubble original (opo9544a), the Webb 2022 near-infrared view (weic2216b) and the NOIRLab wide view (noao-04086); upright, on the left.
- **Kept where:** the original goes in `sources/eagle-hubble-large.jpg`, which git ignores. `make-picture.cjs` crops it to x 0.1-0.9, y 0.04-1.0, shrinks that to a 480 x 601 grid of colours, grades it (see below), then adds 70 rows under it (`extend`, a mirror image of the photo's last rows) so that the broad base of the pillars, which the photo cuts off, dissolves into its own rust-orange haze (the person asked for a diffuse bottom like the right-hand side, after a first try with vector ellipses was scrapped). The edges fade to black (the bottom fade starts at 90 % of the photo's height and ends at the last added row). The result is 480 x 671 pixels in `eagle-pixels.bin.gz`, which is committed.
- **Colour:** the photo's sky is a blue-teal haze and the pillars are red-brown, so each colour channel has its own take-off (red 70, green 78, blue 96, `TR`, `TG`, `TB`), then a gamma of 0.95 and a gain of 3.0; the trace's colour boost (`EAGLE_SAT`) is 1.8, so the bright colours pop. The haze goes black, the pillars keep their rust and the glowing teal edges stay.

## How it is drawn

As the Helix and Omega: underpainting, filaments laid along the grain (`fil.chain`, `res: 2`, `order: 'nearest'`), sparks, each palette colour one `<path>`. The filament step is 1.7 (the haze rows eat budget); the scene is 124,016 characters (the build allows 125,000). The picture is 620 units wide and about 865 tall, centred at x 420, y 548 (the photo part spans y 102 to 878). The pillars' dark bodies trace as near-black, so the pillars read through their lit ridges and the glow behind them.

## What moves

Nothing in the SVG: it is completely still. The shader from `generators/lib/shader.mjs` plays all the motion: twinkling stars all over the sky with about 33 cross stars, a band of small stars hugging the nebula (clear zone an ellipse 300 x 400 round x 420, y 515), five cross stars placed by hand (one on the bright star between the pillars, at x 352, y 367), a slow comet across the upper right every 241 s and two shooting stars on the right on 223 s and 289 s cycles. Still, in the drawing: faint stars, a faint spiral galaxy and four far galaxies, all on the right. `EAGLE_STAGE` (1, 2 or 3) leaves the comet and shooting stars out for the staged tests in the app.

## Palette and mood

- **Sky:** true black (`#000`), the frosted glass black too.
- **Nebula:** rust-brown and gold pillars, teal and blue haze. Dimmed to about 80 % because it sits behind text.
- **Theme:** accent amber `#e8a050`, teal `#3fc4b0` as a second colour, near-black navy text panels.

It sits on the left; its haze reaches down to about y 930 but faint. At a 16:10 window (x 200-1800 visible) the left pillar's outer haze touches the window's left edge, which the person chose; wider windows show more. Its right side stops near x 740, left of the text column.
