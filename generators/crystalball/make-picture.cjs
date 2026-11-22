// Makes generators/crystalball/crystalball-pixels.bin.gz, the small copy of the
// Webb photo that the Crystal Ball Nebula scene is traced from, out of the
// full-size original in sources/ (git-ignored; see philosophy.md for where to
// download it). Only needed when the source picture should change: the scene's
// generator reads the committed .gz file, so a fresh copy of the repo builds
// without the original.
//
//   node generators/crystalball/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 6)
const GAMMA = Number(process.env.GAMMA ?? 0.85)

makePixels({
  src: path.join(__dirname, '../../sources/crystalball-webb-full.png'),
  out: path.join(__dirname, 'crystalball-pixels.bin.gz'),
  // The photo is 2315 x 2278 with black notches (the mosaic's cut-off corners) at
  // its edges. The nebula and its faint haze fill about x 0.08-0.93, y 0.05-0.90.
  crop: { x: 0.075, y: 0.05, w: 0.855, h: 0.855 },
  // The nebula nearly fills the crop; it fades out in the last part of each side.
  fade: { x: { r0: 0.9, r1: 1.0 }, y: { r0: 0.9, r1: 1.0 } },
  // Take a little off every colour so the sky haze comes out black, and lift the
  // dim red-brown interior a little (a gamma).
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 520),
  preview: process.argv[3],
}).catch(e => { console.error(e); process.exit(1) })
