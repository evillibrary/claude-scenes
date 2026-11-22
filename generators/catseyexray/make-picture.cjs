// Makes generators/catseyexray/catseyexray-pixels.bin.gz, the small copy of the Hubble
// photo that the Cat's Eye X-ray scene is traced from, out of the full-size
// original in sources/ (git-ignored; see philosophy.md for where to download
// it). Only needed when the source picture should change: the scene's generator
// reads the committed .gz file, so a fresh copy of the repo builds without it.
//
//   node generators/catseyexray/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 8)
const GAMMA = Number(process.env.GAMMA ?? 0.95)

makePixels({
  src: path.join(__dirname, '../../sources/catseyexray-lg.jpg'),
  out: path.join(__dirname, 'catseyexray-pixels.bin.gz'),
  // The photo is 3600 x 3600. The rings fill about x 0.19-0.78; crop 0.84 of it.
  crop: { x: 0.08, y: 0.08, w: 0.84, h: 0.84 },
  fade: { x: { r0: 0.85, r1: 1.0 }, y: { r0: 0.85, r1: 1.0 } },
  // Take the grainy blue noise off every colour so the sky is black, then a gamma.
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 480),
  preview: process.argv[3] ?? path.join(__dirname, '../../previews/catseyexray-grid.jpg'),
}).catch(e => { console.error(e); process.exit(1) })
