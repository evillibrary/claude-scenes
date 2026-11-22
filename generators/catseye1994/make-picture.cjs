// Makes generators/catseye1994/catseye1994-pixels.bin.gz, the small copy of the Hubble
// photo that the Cat's Eye 1994 scene is traced from, out of the full-size
// original in sources/ (git-ignored; see philosophy.md for where to download
// it). Only needed when the source picture should change: the scene's generator
// reads the committed .gz file, so a fresh copy of the repo builds without it.
//
//   node generators/catseye1994/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 14)
const GAMMA = Number(process.env.GAMMA ?? 0.9)

makePixels({
  src: path.join(__dirname, '../../sources/catseye1994-opo9501a.jpg'),
  out: path.join(__dirname, 'catseye1994-pixels.bin.gz'),
  // The photo is 800 x 800. The nebula fills about x 0.15-0.88, y 0.17-0.72; crop 0.9 of it.
  crop: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 },
  fade: { x: { r0: 0.85, r1: 1.0 }, y: { r0: 0.85, r1: 1.0 } },
  // Take the grainy blue noise off every colour so the sky is black, then a gamma.
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 400),
  preview: process.argv[3] ?? path.join(__dirname, '../../previews/catseye1994-grid.jpg'),
}).catch(e => { console.error(e); process.exit(1) })
