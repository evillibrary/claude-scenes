// Generates the Cat's Eye Nebula backdrop for the scenes mod: hooks/scene-catseye.ts,
// one completely still SVG, and hooks/shader-catseye.ts, the GPU shader that
// plays all its motion over it.
// Run from the repo root: node generators/catseye/gen-scene.mjs (or node build.mjs for all).
// An optional path argument writes the SVG somewhere else instead (no shader).
//
// See philosophy.md. The Cat's Eye Nebula (NGC 6543), traced from the Hubble ACS
// photograph (ESA, NASA, HEIC and the Hubble Heritage Team (STScI/AURA)) into
// brush strokes by ../lib/trace.mjs, fills the left of a black star field. Like
// the Helix, the SVG holds nothing animated at all (any change near thousands of
// traced strokes froze the app): the shader (../lib/shader.mjs) adds twinkling
// stars, cross stars, a cross on the central star, a comet and shooting stars.
// On the phone or under Reduce Motion the still SVG shows alone.
import { writeFileSync } from 'node:fs'
import { loadPixels, trace } from '../lib/trace.mjs'
import { starField } from '../lib/stars.mjs'
import { starShader } from '../lib/shader.mjs'

const out = process.argv[2] ?? new URL('../../hooks/scene-catseye.ts', import.meta.url)
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
// The Helix's compact brushwork: continuous lines along the photo's grain
// (fil.chain), half-pixel units (res 2), each colour's lines ordered to keep the
// moves short. The grid is 600 photo pixels wide, about 1.29 scene units each.
const STEP = Number(process.env.CAT_STEP ?? 1.37)
const SAT = Number(process.env.CAT_SAT ?? 1.5)
const { UNDER, FIL, SPARK, count, counts, lines, PW, PH, unit } = trace(loadPixels(new URL('./catseye-pixels.bin.gz', import.meta.url)), {
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
const NEB = [Number(process.env.NEBX ?? 440), Number(process.env.NEBY ?? 390)]
const S = 772 / PW
const X0 = NEB[0] - (PW * S) / 2
const Y0 = NEB[1] - (PH * S) / 2
// The central star, as fractions of the picture.
const WX = X0 + 0.5165 * PW * S
const WY = Y0 + 0.508 * PH * S

// ---------- Still stars (see ../lib/stars.mjs) ----------
seed = 20261122
const BOX = [X0 - 20, Y0 - 20, X0 + PW * S + 20, Y0 + PH * S + 20]
// The nebula and its rings (measured on a render): no stars behind it.
const AV = { cx: Number(process.env.AVX ?? 455), cy: Number(process.env.AVY ?? 405), rx: Number(process.env.AVRX ?? 320), ry: Number(process.env.AVRY ?? 325) }
const STARS = starField({
  rand,
  box: BOX,
  behind: (x, y) => ((x - AV.cx) / AV.rx) ** 2 + ((y - AV.cy) / AV.ry) ** 2 < 1,
  moves: () => false,
  relocate: () => [rr(900, 1950), rr(30, 970)],
  small: 380,
  medium: 80,
  big: 0,
})

// ---------- Faint far galaxies, on the right, away from the nebula ----------
seed = 404
let GALAXIES = ''
;[[1250, 760, 22, 35], [1100, 180, 14, -20], [1880, 240, 18, 60], [1560, 930, 12, -10]].forEach(([x, y, r, a]) => {
  GALAXIES += `<g transform="translate(${x} ${y}) rotate(${a}) scale(1 ${r2(rr(0.3, 0.5))})"><circle r="${r}" fill="url(#gx)"/><circle r="${r1(r * 0.25)}" fill="url(#gc)"/></g>`
})

// ---------- A faint far spiral galaxy, on the right (nearly face-on, tilted) ----------
const arm = (turn, steps = 11) => {
  let d = ''
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * 4.6
    const r = 4 * Math.exp(0.5 * th)
    d += (k ? 'L' : 'M') + i0(Math.cos(th + turn) * r) + ' ' + i0(Math.sin(th + turn) * r)
  }
  return d
}
const SPIRAL = `<g transform="translate(1700 640) rotate(-32) scale(1.3 .8)"><circle r="40" fill="url(#gx)"/><path d="${arm(0)}${arm(Math.PI)}" fill="none" stroke="#aeb8ee" stroke-width="9" stroke-linecap="round" opacity=".05"/><path d="${arm(0.1)}${arm(Math.PI + 0.1)}" fill="none" stroke="#d6dcff" stroke-width="2.4" stroke-linecap="round" opacity=".13"/><circle r="9" fill="url(#gc)"/></g>`

// ---------- The central star: a small still point with a soft halo ----------
const CENTRE = `<g transform="translate(${i0(WX)} ${i0(WY)})"><circle r="16" fill="url(#wd)"/><circle r="2" fill="#f4f8ff"/></g>`

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
${CENTRE}
</g>
</svg>`

// ---------- The motion, as a GPU shader ----------
// CAT_STAGE (1, 2 or 3) leaves the comet and the shooting stars out for the
// staged tests in the app (see the scene-mods skill); the build uses 3.
const STAGE = Number(process.env.CAT_STAGE ?? 3)
const SHADER = starShader({
  title: "the Cat's Eye Nebula: stars, comet and shooting stars",
  // No spread star over the nebula; one that lands there moves below it.
  avoid: AV,
  moveTo: [900, 980],
  // A few more small stars in the dark band hugging the nebula.
  around: [
    { count: 14, a0: 100, a1: 260 },
    { count: 14, a0: 280, a1: 440 },
  ],
  placed: [
    [980, 120, 40, [1, 0.74, 0.4]], // smaller, golden-orange, top middle
    [1620, 330, 55, [0.86, 0.92, 1]], // larger, very faintly blue, upper right
    [1150, 520, 36, [1, 1, 1]], // medium, white
    [1800, 850, 38, [1, 0.78, 0.48]], // medium, a little orange, lower right
  ],
  // The central star.
  core: { x: i0(WX), y: i0(WY), reach: 34, rgb: [0.9, 0.95, 1], strength: 0.9 },
  // One slow crossing of the upper right every four minutes.
  comet: STAGE >= 2 ? { from: [1300, 60], to: [1900, 330], cycle: 251, start: 97 } : undefined,
  // Now and then a slow shooting star on the right side of the sky.
  shooting: STAGE < 3 ? [] : [
    { from: [1750, 80], dir: [-1, 0.28], cycle: 227, start: 60 },
    { from: [1100, 640], dir: [1, 0.5], cycle: 293, start: 200 },
  ],
})

// A still drawing under a shader may be bigger than an animated scene (see check-scene.mjs).
const BUDGET = 125000
if (svg.length > BUDGET && !process.env.LOOSE) throw new Error(`scene too long: ${svg.length} of ${BUDGET}`)
writeFileSync(out, `// Generated by generators/catseye/gen-scene.mjs: the Cat's Eye Nebula backdrop (still; hooks/shader-catseye.ts plays its motion).
export const SCENE = ${JSON.stringify(svg)}
`)
if (!process.argv[2]) writeFileSync(new URL('../../hooks/shader-catseye.ts', import.meta.url), SHADER)
console.log(`scene: ${svg.length} of ${BUDGET} characters (${count} spots in ${lines} lines + ${counts.under.join('+')} underpainting, ${counts.spark} sparks); shader ${SHADER.length}`)
