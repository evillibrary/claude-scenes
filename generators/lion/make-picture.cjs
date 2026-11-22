// Makes generators/lion/lion-pixels.bin.gz, the small copy of the Webb photo that
// the Lion Nebula scene is traced from, out of the full-size picture in sources/
// (git-ignored; see philosophy.md for where to download it). Only needed when the
// source picture should change: the scene's generator reads the committed .gz
// file, so a fresh copy of the repo builds without it.
//
//   node generators/lion/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 4)
const GAMMA = Number(process.env.GAMMA ?? 0.95)
const CROP = Number(process.env.CROP ?? 0.66)

makePixels({
  src: path.join(__dirname, '../../sources/lion-webb-weic2616a-large.jpg'),
  out: path.join(__dirname, 'lion-pixels.bin.gz'),
  // The photo is 3505 x 3505 with the nebula in the middle: crop the middle part.
  crop: { x: (1 - CROP) / 2, y: (1 - CROP) / 2, w: CROP, h: CROP },
  fade: { x: { r0: 0.85, r1: 1.0 }, y: { r0: 0.85, r1: 1.0 } },
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 480),
  preview: process.argv[3] ?? path.join(__dirname, '../../previews/lion-grid.jpg'),
}).catch(e => { console.error(e); process.exit(1) })
