// Generates the Hourglass Nebula backdrop for the scenes mod: hooks/scene-hourglass.ts,
// one completely still SVG, and hooks/shader-hourglass.ts, the GPU shader that
// plays all its motion over it.
// Run from the repo root: node generators/hourglass/gen-scene.mjs (or node build.mjs for all).
// An optional path argument writes the SVG somewhere else instead (no shader).
//
// See philosophy.md. The Hourglass Nebula (MyCn 18), traced from the Hubble
// photograph (Raghvendra Sahai and John Trauger (JPL), the WFPC2 science team,
// NASA, ESA) into brush strokes by ../lib/trace.mjs, stands upright on the
// left of a black star field. Like the Ring, the SVG holds nothing animated at
// all (any change near thousands of traced strokes froze the app): the shader
// (../lib/shader.mjs) adds twinkling stars, cross stars, a cross on the central
// star, a comet and shooting stars. On the phone or under Reduce Motion the
// still SVG shows alone.
import { writeFileSync } from 'node:fs'
import { loadPixels, trace } from '../lib/trace.mjs'
import { starField } from '../lib/stars.mjs'
import { starShader } from '../lib/shader.mjs'

const out = process.argv[2] ?? new URL('../../hooks/scene-hourglass.ts', import.meta.url)
const W = 2000
const H = 1000

let seed = 1
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}
const rr = (a, b) => a + rand() * (b - a)
const i0 = n => Math.round(n)
const r1 = n => Math.round(n * 10) / 10
const r2 = n => Math.round(n * 100) / 100

// ---------- The photo, traced into brush strokes (see ../lib/trace.mjs) ----------
// The Ring's compact brushwork (session 6): continuous lines along the photo's
// grain (fil.chain), half-pixel units (res 2), each colour's lines ordered to
// keep the moves short. The grid is 350 photo pixels wide, 1.35 scene units
// each, as the Ring's 450 are 1.37. The filament step is what fills the
// budget (HOURGLASS_STEP tries another).
const STEP = Number(process.env.HOURGLASS_STEP ?? 0.595)
const { UNDER, FIL, SPARK, count, counts, lines, PW, PH, unit } = trace(loadPixels(new URL('./hourglass-pixels.bin.gz', import.meta.url)), {
  res: 2,
  order: 'nearest',
  blurs: [2, 4, 9],
  under: [
    { step: 13, len: 9, r: 4, minL: 0.03, k: 12, width: 19, opacity: 0.16 },
    { step: 9, len: 6, r: 3, minL: 0.05, k: 16, width: 10, opacity: 0.2 },
  ],
  fil: {
    step: STEP, len: [2.4, 4.8], detailGain: 6, lumGain: 0.85, bias: 0.12, minWide: 0.07, sat: 1.5,
    dim: { k: 18, width: 1.2, opacity: 0.5 },
    bright: { k: 22, width: 1.3, opacity: 0.8 },
    chain: { gap: 4.5, maxLen: 12, turn: 0.9, colour: 90, minStep: 1.35, smooth: 1 },
  },
  spark: { minL: 0.45, minDetail: 0.1, width: 2.2 },
})

// The nebula's place: the picture's centre at NEB, S scene units per photo pixel
// (the nebula itself, 935 of the 1090 source pixels tall, comes out about 640
// units tall).
// (Moved 50 units left, from x 470, at the person's request (a second 50 was tried and undone); the stars were
// then left exactly where they were, so everything star-related below is still
// worked out from STAR_C, the old centre.)
const NEB = [420, 380]
const STAR_C = [470, 380]
const S = 472 / PW
const X0 = NEB[0] - (PW * S) / 2
const Y0 = NEB[1] - (PH * S) / 2
// The off-centre white dwarf in the eye, in photo pixels.
const WX = X0 + 0.4754 * PW * S
const WY = Y0 + 0.4844 * PH * S

// ---------- Still stars (see ../lib/stars.mjs) ----------
// The shader adds the twinkling stars and the big cross stars over these.
seed = 20261121
const BOX = [STAR_C[0] - (PW * S) / 2 - 20, STAR_C[1] - (PH * S) / 2 - 20, STAR_C[0] + (PW * S) / 2 + 20, STAR_C[1] + (PH * S) / 2 + 20]
// The nebula and its glow, an ellipse taller than it is wide (measured on a
// render): no stars behind it.
const AV = { cx: STAR_C[0], cy: STAR_C[1], rx: 250, ry: 350 }
const STARS = starField({
  rand,
  box: BOX,
  behind: (x, y) => ((x - AV.cx) / AV.rx) ** 2 + ((y - AV.cy) / AV.ry) ** 2 < 1,
  moves: () => false,
  relocate: () => [rr(750, 1900), rr(30, 970)],
  small: 380,
  medium: 80,
  big: 0,
})

// ---------- Faint far galaxies, on the right, away from the nebula ----------
seed = 404
let GALAXIES = ''
;[[1400, 520, 22, 35], [1240, 150, 14, -20], [1820, 250, 18, 60], [1670, 660, 12, -10]].forEach(([x, y, r, a]) => {
  GALAXIES += `<g transform="translate(${x} ${y}) rotate(${a}) scale(1 ${r2(rr(0.3, 0.5))})"><circle r="${r}" fill="url(#gx)"/><circle r="${r1(r * 0.25)}" fill="url(#gc)"/></g>`
})

// ---------- The white dwarf: a small still point with a soft halo ----------
const DWARF = `<g transform="translate(${i0(WX)} ${i0(WY)})"><circle r="18" fill="url(#wd)"/><circle r="2.2" fill="#f4f8ff"/></g>`

// ---------- The still drawing ----------
const DEFS = `<radialGradient id="gx"><stop offset="0" stop-color="#c8c4e8" stop-opacity=".22"/><stop offset=".5" stop-color="#9890c0" stop-opacity=".08"/><stop offset="1" stop-color="#9890c0" stop-opacity="0"/></radialGradient>
<radialGradient id="gc"><stop offset="0" stop-color="#f4ead8" stop-opacity=".55"/><stop offset="1" stop-color="#f4ead8" stop-opacity="0"/></radialGradient>
<radialGradient id="neb"><stop offset="0" stop-color="#5fb8c8" stop-opacity=".05"/><stop offset=".6" stop-color="#e0607a" stop-opacity=".05"/><stop offset="1" stop-color="#e0607a" stop-opacity="0"/></radialGradient>
<radialGradient id="wd"><stop offset="0" stop-color="#f0f8ff" stop-opacity=".7"/><stop offset=".2" stop-color="#cfe6ff" stop-opacity=".3"/><stop offset="1" stop-color="#9ed4ff" stop-opacity="0"/></radialGradient>
`

const place = `translate(${r1(X0)} ${r1(Y0)}) scale(${+(S * unit).toFixed(4)})`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${DEFS}</defs>
<rect width="${W}" height="${H}"/>
${STARS.SMALL}${GALAXIES}${STARS.MEDIUM}
<g opacity=".8">
<ellipse cx="${NEB[0]}" cy="${NEB[1]}" rx="${AV.rx + 20}" ry="${AV.ry + 20}" fill="url(#neb)"/>
<g transform="${place}">${UNDER}</g>
<g transform="${place}">${FIL}${SPARK}</g>
${DWARF}
</g>
</svg>`

// ---------- The motion, as a GPU shader ----------
const SHADER = starShader({
  title: 'the Hourglass Nebula: stars, comet and shooting stars',
  // No spread star over the nebula; one that lands there moves below it.
  avoid: AV,
  moveTo: [620, 980],
  // A few more small stars in the dark band hugging the nebula: down both
  // sides and a few over the top and under the bottom.
  around: [
    { count: 10, a0: 100, a1: 260 },
    { count: 10, a0: 280, a1: 440 },
    { count: 3, a0: 60, a1: 100 },
    { count: 3, a0: 440, a1: 480 },
  ],
  placed: [
    [1560, 880, 55, [1, 0.9, 0.6]], // larger, slightly yellow, near the bottom right
    [780, 110, 58, [0.86, 0.92, 1]], // larger, very faintly blue, right of the hourglass's top
    [1620, 430, 42, [1, 1, 1]], // medium, white, middle of the right half
    [1740, 600, 38, [1, 0.78, 0.48]], // medium, a little orange, middle right
    [245, 130, 36, [1, 0.66, 0.34]], // medium, more orange, top left, to the left of the nebula
    [110, 850, 40, [0.9, 0.95, 1]], // medium, white-blue, bottom left
  ],
  // The white dwarf in the eye.
  core: { x: i0(WX), y: i0(WY), reach: 34, rgb: [0.9, 0.95, 1], strength: 0.9 },
  // One slow crossing of the upper right every four minutes.
  comet: { from: [1800, 60], to: [1140, 270], cycle: 241, start: 91 },
  // Now and then a shooting star on the right side of the sky.
  shooting: [
    { from: [1300, 60], dir: [1, 0.28], cycle: 223, start: 70 },
    { from: [1920, 420], dir: [-1, 0.5], cycle: 289, start: 190 },
  ],
})

// A still drawing under a shader may be bigger than an animated scene (see check-scene.mjs).
const BUDGET = 125000
if (svg.length > BUDGET) throw new Error(`scene too long: ${svg.length} of ${BUDGET}`)
writeFileSync(out, `// Generated by generators/hourglass/gen-scene.mjs: the Hourglass Nebula backdrop (still; hooks/shader-hourglass.ts plays its motion).
export const SCENE = ${JSON.stringify(svg)}
`)
if (!process.argv[2]) writeFileSync(new URL('../../hooks/shader-hourglass.ts', import.meta.url), SHADER)
console.log(`scene: ${svg.length} of ${BUDGET} characters (${count} spots in ${lines} lines + ${counts.under.join('+')} underpainting, ${counts.spark} sparks); shader ${SHADER.length}`)
