// Makes generators/eagle/eagle-pixels.bin.gz, the small copy of the Hubble
// photo that the Eagle Nebula scene is traced from, out of the full-size
// original in sources/ (git-ignored; see philosophy.md for where to download
// it). Only needed when the source picture should change: the scene's generator
// reads the committed .gz file, so a fresh copy of the repo builds without it.
//
//   node generators/eagle/make-picture.cjs [size] [preview.jpg]
const path = require('path')
const makePixels = require('../lib/make-pixels.cjs')
// The sky haze is blue-teal and the pillars are red-brown, so each colour has its own
// take: the haze goes black and the pillars keep their rust.
const TR = Number(process.env.TR ?? 70)
const TG = Number(process.env.TG ?? 78)
const TB = Number(process.env.TB ?? 96)
const GAMMA = Number(process.env.GAMMA ?? 0.95)
const GAIN = Number(process.env.GAIN ?? 3.0)

// The photo ends at the pillars' broad base. EXT rows of its own haze (a mirror
// image of the last rows) are added under it, and the bottom fade runs from the
// photo's edge to the end of them, so the base dissolves into haze, not a line.
const EXT = Number(process.env.EXT ?? 70)
const OH0 = Math.round(480 * (0.96 * 7071) / (0.8 * 6780))
const BR0 = Math.max(0, (OH0 * Number(process.env.FADE0 ?? 0.9) - (OH0 + EXT) / 2) / ((OH0 + EXT) / 2))

makePixels({
  extend: EXT,
  src: path.join(__dirname, '../../sources/eagle-hubble-large.jpg'),
  out: path.join(__dirname, 'eagle-pixels.bin.gz'),
  // The photo is 6780 x 7071. The pillars span about x 0.2-0.75, y 0.12-1.0.
  crop: { x: 0.1, y: 0.04, w: 0.8, h: 0.96 },
  fade: { x: { r0: 0.8, r1: 1.0 }, y: { r0: 0.88, r1: 1.0, bottom: { r0: BR0, r1: 1.0 } } },
  grade: `const f = (c, t) => Math.min(255, ${GAIN} * 255 * Math.pow(Math.max(0, c - t) / 255, ${GAMMA})); return [f(r, ${TR}), f(g, ${TG}), f(b, ${TB})]`,
  size: Number(process.argv[2] ?? 480),
  preview: process.argv[3],
}).catch(e => { console.error(e); process.exit(1) })
