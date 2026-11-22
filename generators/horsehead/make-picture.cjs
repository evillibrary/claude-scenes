// Makes generators/horsehead/horsehead-pixels.bin.gz, the small copy of the
// Hubble infrared photo that the Horsehead Nebula scene is traced from, out of
// the full-size original in sources/ (git-ignored; see philosophy.md for where
// to download it). Only needed when the source picture should change: the
// scene's generator reads the committed .gz file.
//
//   node generators/horsehead/make-picture.cjs [size] [preview.jpg]
//
// The work is done by ../lib/make-pixels.cjs; this file holds the crop.
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
const TAKE = Number(process.env.TAKE ?? 12)
const GAMMA = Number(process.env.GAMMA ?? 0.8)

makePixels({
  src: path.join(__dirname, '../../sources/heic1307a-large.jpg'),
  out: path.join(__dirname, 'horsehead-pixels.bin.gz'),
  // The photo is 2704 x 2826 and the head fills it. Keep the whole picture.
  crop: { x: 0, y: 0, w: 1, h: 1 },
  // The glow runs off the left, right and bottom edges: fade to black there.
  fade: { r0: Number(process.env.R0 ?? 0.72), r1: Number(process.env.R1 ?? 1.28) },
  // Take a little off every colour so the sky comes out black, and lift the dim
  // red-brown dust and the blue haze (a gamma).
  grade: `const f = c => 255 * Math.pow(Math.max(0, c - ${TAKE}) / 255, ${GAMMA}); return [f(r), f(g), f(b)]`,
  size: Number(process.argv[2] ?? 500),
  preview: process.argv[3],
}).catch(e => { console.error(e); process.exit(1) })
