// Makes generators/southernring/southernring-pixels.bin.gz, the small copy of the
// Webb MIRI photo that the Southern Ring Nebula scene is traced from, out of the
// full-size original in sources/ (git-ignored; see philosophy.md for where to
// download it). Only needed when the source picture should change: the scene's
// generator reads the committed .gz file, so a fresh copy of the repo builds
// without it.
//
//   node generators/southernring/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 8)
const GAMMA = Number(process.env.GAMMA ?? 0.9)

makePixels({
  src: path.join(__dirname, '../../sources/southernring-webb-miri-full.jpg'),
  out: path.join(__dirname, 'southernring-pixels.bin.gz'),
  // The photo is 1306 x 1133. The nebula and its blue haze fill about x 0.22-0.85,
  // y 0.12-0.90 of it, centred near (0.52, 0.5).
  crop: { x: 0.2, y: 0.1, w: 0.68, h: 0.82 },
  // The nebula nearly fills the crop; it fades out in the last part of each side.
  fade: { x: { r0: 0.74, r1: 1.0 }, y: { r0: 0.8, r1: 1.0 } },
  // Take a little off every colour so the sky haze comes out black, and lift the
  // dim blue haze a little (a gamma).
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 520),
  preview: process.argv[3],
}).catch(e => { console.error(e); process.exit(1) })
