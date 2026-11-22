// Makes generators/catseye/catseye-pixels.bin.gz, the small copy of the Hubble
// photo that the Cat's Eye Nebula scene is traced from, out of the full-size
// original in sources/ (git-ignored; see philosophy.md for where to download
// it). Only needed when the source picture should change: the scene's generator
// reads the committed .gz file, so a fresh copy of the repo builds without it.
//
//   node generators/catseye/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 26)
const GAMMA = Number(process.env.GAMMA ?? 0.85)

makePixels({
  src: path.join(__dirname, '../../sources/catseye-hubble-full.jpg'),
  out: path.join(__dirname, 'catseye-pixels.bin.gz'),
  // The photo is 1417 x 1417. The faint rings fill about x 0.19-0.77, y 0.20-0.80
  // of it. Crop a square of 0.8 round them.
  crop: { x: 0.09, y: 0.10, w: 0.8, h: 0.8 },
  fade: { x: { r0: 0.8, r1: 1.0 }, y: { r0: 0.8, r1: 1.0 } },
  // Take the photo's blue sky haze off every colour so the sky is black, then a
  // gamma to lift the dim shells.
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 600),
  preview: process.argv[3] ?? path.join(__dirname, '../../previews/catseye-grid.jpg'),
}).catch(e => { console.error(e); process.exit(1) })
