// Makes generators/omega/omega-pixels.bin.gz, the small copy of the NOIRLab
// photo that the Omega Nebula scene is traced from, out of the full-size
// original in sources/ (git-ignored; see philosophy.md for where to download
// it). Only needed when the source picture should change: the scene's generator
// reads the committed .gz file, so a fresh copy of the repo builds without it.
//
//   node generators/omega/make-picture.cjs [size] [preview.jpg]
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 27)
const GAMMA = Number(process.env.GAMMA ?? 0.68)
const GAIN = Number(process.env.GAIN ?? 1.4)

makePixels({
  src: path.join(__dirname, '../../sources/omega-noirlab-m17e-large.jpg'),
  out: path.join(__dirname, 'omega-pixels.bin.gz'),
  // The photo is 1700 x 1700. The nebula (with its faint outer filaments) fills
  // about x 0.07-0.83, y 0.12-0.82 of it. Crop a margin of dark sky round that.
  crop: { x: 0.04, y: 0.02, w: 0.82, h: 0.95 },
  fade: { x: { r0: 0.88, r1: 1.0 }, y: { r0: 0.9, r1: 1.0 } },
  // Take a little off every colour so the sky comes out black, lift the dim
  // gas (a gamma and a gain).
  grade: `const f = c => Math.min(255, ${GAIN} * 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA})); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 560),
  preview: process.argv[3],
}).catch(e => { console.error(e); process.exit(1) })
