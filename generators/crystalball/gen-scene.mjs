// Generates the Crystal Ball Nebula backdrop for the scenes mod:
// hooks/scene-crystalball.ts, one completely still SVG, and
// hooks/shader-crystalball.ts, the GPU shader that plays all its motion over it.
// Run from the repo root: node generators/crystalball/gen-scene.mjs (or node build.mjs for all).
// An optional path argument writes the SVG somewhere else instead (no shader).
//
// See philosophy.md. The Crystal Ball Nebula (NGC 1514), traced from the Webb
// MIRI photograph (NASA, ESA, CSA, STScI, Michael Ressler (NASA-JPL), Dave Jones
// (IAC); CC BY 4.0) into brush strokes by ../lib/trace.mjs, stands on the middle
// left of a black star field. Like the Ring, the SVG holds nothing animated at
// all (any change near thousands of traced strokes froze the app): the shader
// (../lib/shader.mjs) adds twinkling stars, cross stars, a cross on the central
// star, a comet, shooting stars and a far galaxy. On the phone or under Reduce
// Motion the still SVG shows alone.
import { writeFileSync } from 'node:fs'
import { loadPixels, trace } from '../lib/trace.mjs'
import { starField } from '../lib/stars.mjs'
import { starShader } from '../lib/shader.mjs'

const out = process.argv[2] ?? new URL('../../hooks/scene-crystalball.ts', import.meta.url)
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
// The Ring's compact brushwork: continuous lines along the photo's grain
// (fil.chain), half-pixel units (res 2), each colour's lines ordered to keep the
// moves short. The grid is 520 photo pixels wide, about 1.29 scene units each.
// The filament step is what fills the budget (CB_STEP tries another).
const STEP = Number(process.env.CB_STEP ?? 1.7)
const SAT = Number(process.env.CB_SAT ?? 1.5)
const { UNDER, FIL, SPARK, count, counts, lines, PW, PH, unit } = trace(loadPixels(new URL('./crystalball-pixels.bin.gz', import.meta.url)), {
  res: 2,
  order: 'nearest',
  blurs: [2, 4, 9],
  under: [
    { step: 13, len: 9, r: 4, minL: 0.03, k: 12, width: 19, opacity: 0.16 },
    { step: 9, len: 6, r: 3, minL: 0.05, k: 16, width: 10, opacity: 0.2 },
  ],
  fil: {
    step: STEP, len: [2.4, 4.8], detailGain: 6, lumGain: 0.85, bias: 0.12, minWide: 0.07, sat: SAT,
    dim: { k: 18, width: 1.2, opacity: 0.5 },
    bright: { k: 22, width: 1.3, opacity: 0.8 },
    chain: { gap: 4.5, maxLen: 12, turn: 0.9, colour: 90, minStep: 1.35, smooth: 1 },
  },
  spark: { minL: 0.45, minDetail: 0.1, width: 2.2 },
})

// The nebula's place: the picture's centre at NEB, S scene units per photo pixel.
// The nebula fills about 93 % of the picture, so it is about 620 units across.
const NEB = [Number(process.env.CBX ?? 450), Number(process.env.CBY ?? 430)]
const S = 670 / PW
const X0 = NEB[0] - (PW * S) / 2
const Y0 = NEB[1] - (PH * S) / 2
// The bright central pair of stars, as fractions of the picture.
const CX = X0 + 0.496 * PW * S
const CY = Y0 + 0.512 * PH * S
const C2X = X0 + 0.467 * PW * S
const C2Y = Y0 + 0.596 * PH * S

// ---------- Still stars (see ../lib/stars.mjs) ----------
// The shader adds the twinkling stars and the big cross stars over these.
seed = 20261122
const BOX = [X0 - 20, Y0 - 20, X0 + PW * S + 20, Y0 + PH * S + 20]
// The nebula and its glow (measured on a render): no stars behind it.
const AV = { cx: Number(process.env.AVX ?? NEB[0]), cy: Number(process.env.AVY ?? NEB[1]), rx: Number(process.env.AVRX ?? 335), ry: Number(process.env.AVRY ?? 335) }
const STARS = starField({
  rand,
  box: BOX,
  behind: (x, y) => ((x - AV.cx) / AV.rx) ** 2 + ((y - AV.cy) / AV.ry) ** 2 < 1,
  moves: () => false,
  relocate: () => [rr(1000, 1900), rr(30, 970)],
  small: 380,
  medium: 80,
  big: 0,
})

// ---------- Faint far galaxies, on the right, away from the nebula ----------
seed = 404
let GALAXIES = ''
;[[1200, 520, 22, 35], [1560, 150, 14, -20], [1780, 640, 18, 60], [1330, 800, 12, -10]].forEach(([x, y, r, a]) => {
  GALAXIES += `<g transform="translate(${x} ${y}) rotate(${a}) scale(1 ${r2(rr(0.3, 0.5))})"><circle r="${r}" fill="url(#gx)"/><circle r="${r1(r * 0.25)}" fill="url(#gc)"/></g>`
})

// ---------- A faint far spiral galaxy, on the right (nearly face-on, tilted) ----------
// Two arms of a spiral, each a soft wide stroke with a thinner brighter one over
// it, round a soft core.
const arm = (turn, steps = 11) => {
  let d = ''
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * 4.6
    const r = 4 * Math.exp(0.5 * th)
    d += (k ? 'L' : 'M') + i0(Math.cos(th + turn) * r) + ' ' + i0(Math.sin(th + turn) * r)
  }
  return d
}
const SPIRAL = `<g transform="translate(1720 300) rotate(-32) scale(1.3 .8)"><circle r="40" fill="url(#gx)"/><path d="${arm(0)}${arm(Math.PI)}" fill="none" stroke="#aeb8ee" stroke-width="9" stroke-linecap="round" opacity=".05"/><path d="${arm(0.1)}${arm(Math.PI + 0.1)}" fill="none" stroke="#d6dcff" stroke-width="2.4" stroke-linecap="round" opacity=".13"/><circle r="9" fill="url(#gc)"/></g>`

// ---------- The central pair of stars: small still points with soft halos ----------
const DWARF = `<g transform="translate(${i0(CX)} ${i0(CY)})"><circle r="14" fill="url(#wd)"/><circle r="2" fill="#f4f8ff"/></g><g transform="translate(${i0(C2X)} ${i0(C2Y)})"><circle r="8" fill="url(#wd)"/><circle r="1.3" fill="#e8f0ff"/></g>`

// ---------- The still drawing ----------
const DEFS = `<radialGradient id="gx"><stop offset="0" stop-color="#c8c4e8" stop-opacity=".22"/><stop offset=".5" stop-color="#9890c0" stop-opacity=".08"/><stop offset="1" stop-color="#9890c0" stop-opacity="0"/></radialGradient>
<radialGradient id="gc"><stop offset="0" stop-color="#f4ead8" stop-opacity=".55"/><stop offset="1" stop-color="#f4ead8" stop-opacity="0"/></radialGradient>
<radialGradient id="wd"><stop offset="0" stop-color="#f0f8ff" stop-opacity=".6"/><stop offset=".2" stop-color="#cfe6ff" stop-opacity=".25"/><stop offset="1" stop-color="#9ed4ff" stop-opacity="0"/></radialGradient>
`

const place = `translate(${r1(X0)} ${r1(Y0)}) scale(${+(S * unit).toFixed(4)})`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${DEFS}</defs>
<rect width="${W}" height="${H}"/>
${STARS.SMALL}${GALAXIES}${SPIRAL}${STARS.MEDIUM}
<g opacity=".8">
<g transform="${place}">${UNDER}</g>
<g transform="${place}">${FIL}${SPARK}</g>
${DWARF}
</g>
</svg>`

// ---------- The motion, as a GPU shader ----------
// CB_STAGE (1, 2 or 3) leaves the comet and the shooting stars out for the
// staged tests in the app (see the scene-mods skill); the build uses 3.
const STAGE = Number(process.env.CB_STAGE ?? 3)
const SHADER = starShader({
  title: 'the Crystal Ball Nebula: stars, comet and shooting stars',
  // No spread star over the nebula; one that lands there moves below it.
  avoid: AV,
  moveTo: [1100, 980],
  // A few more small stars in the dark band hugging the nebula.
  around: [
    { count: 14, a0: 100, a1: 260 },
    { count: 14, a0: 280, a1: 440 },
  ],
  placed: [
    [1500, 130, 45, [1, 1, 1]], // medium, white, upper right
    [1760, 520, 40, [1, 0.78, 0.48]], // medium, a little orange, middle right
    [1180, 340, 36, [0.86, 0.92, 1]], // medium, faintly blue, between nebula and text
    [i0(C2X), i0(C2Y), 18, [0.8, 0.88, 1]], // a small one on the second central star
  ],
  // The brighter of the central pair of stars.
  core: { x: i0(CX), y: i0(CY), reach: 34, rgb: [0.88, 0.93, 1], strength: 0.9 },
  // One slow crossing of the upper right every four minutes.
  comet: STAGE >= 2 ? { from: [1300, 70], to: [1900, 250], cycle: 239, start: 83 } : undefined,
  // Now and then a shooting star on the right side of the sky.
  shooting: STAGE < 3 ? [] : [
    { from: [1300, 60], dir: [1, 0.28], cycle: 223, start: 70 },
    { from: [1920, 420], dir: [-1, 0.5], cycle: 281, start: 190 },
  ],
})

// A still drawing under a shader may be bigger than an animated scene (see check-scene.mjs).
const BUDGET = 125000
if (svg.length > BUDGET && !process.env.LOOSE) throw new Error(`scene too long: ${svg.length} of ${BUDGET}`)
writeFileSync(out, `// Generated by generators/crystalball/gen-scene.mjs: the Crystal Ball Nebula backdrop (still; hooks/shader-crystalball.ts plays its motion).
export const SCENE = ${JSON.stringify(svg)}
`)
if (!process.argv[2]) writeFileSync(new URL('../../hooks/shader-crystalball.ts', import.meta.url), SHADER)
if (process.env.CB_SHADER_OUT) writeFileSync(process.env.CB_SHADER_OUT, SHADER)
console.log(`scene: ${svg.length} of ${BUDGET} characters (${count} spots in ${lines} lines + ${counts.under.join('+')} underpainting, ${counts.spark} sparks); shader ${SHADER.length}`)
