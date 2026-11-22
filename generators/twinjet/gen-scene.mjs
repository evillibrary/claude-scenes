// Generates the Twin Jet Nebula backdrop for the scenes mod: hooks/scene-twinjet.ts,
// one completely still SVG, and hooks/shader-twinjet.ts, the GPU shader that
// plays all its motion over it.
// Run from the repo root: node generators/twinjet/gen-scene.mjs (or node build.mjs for all).
// An optional path argument writes the SVG somewhere else instead (no shader).
//
// See philosophy.md. The Twin Jet Nebula (PN M2-9), traced from the 2015 Hubble
// image (ESA/Hubble & NASA, Acknowledgement: Judy Schmidt) into brush strokes
// by ../lib/trace.mjs, stands on the right of a black star field, tilted 50
// degrees (its right end up; the 1997 Hubble picture leans about 22). Like the Ring,
// the SVG holds nothing animated at all (any change near thousands of traced
// strokes froze the app): the shader (../lib/shader.mjs) adds twinkling stars,
// cross stars, a cross on the central star, a pair of distant stars circling
// each other on the left, and shooting stars. On the phone or under Reduce
// Motion the still SVG shows alone.
import { writeFileSync } from 'node:fs'
import { loadPixels, trace } from '../lib/trace.mjs'
import { starField } from '../lib/stars.mjs'
import { starShader } from '../lib/shader.mjs'

const out = process.argv[2] ?? new URL('../../hooks/scene-twinjet.ts', import.meta.url)
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
// The same compact brushwork as the Ring (session 6): continuous lines along
// the photo's grain (fil.chain), half-pixel units (res 2), each colour's lines
// ordered to keep the moves short. The grid is 700 photo pixels wide, 1.36
// scene units each, as the Ring's 450 are 1.37.
const STEP = Number(process.env.TWINJET_STEP ?? 0.66)
const { UNDER, FIL, SPARK, count, counts, lines, PW, PH, unit } = trace(loadPixels(new URL('./twinjet-pixels.bin.gz', import.meta.url)), {
  res: 2,
  order: 'nearest',
  blurs: [2, 4, 9],
  under: [
    { step: 13, len: 9, r: 4, minL: 0.03, k: 12, width: 19, opacity: 0.16 },
    { step: 9, len: 6, r: 3, minL: 0.05, k: 16, width: 10, opacity: 0.2 },
  ],
  fil: {
    step: STEP, len: [2.4, 4.8], detailGain: 6, lumGain: 0.85, bias: 0.12, minWide: 0.07, sat: 1.85,
    dim: { k: 18, width: 1.2, opacity: 0.5 },
    bright: { k: 22, width: 1.3, opacity: 0.8 },
    chain: { gap: 4.5, maxLen: 12, turn: 0.9, colour: 90, minStep: 1.35, smooth: 1 },
  },
  spark: { minL: 0.45, minDetail: 0.1, width: 2.2 },
})

// The nebula's place: the picture's centre at NEB, S scene units per photo
// pixel, and the whole picture turned ANGLE degrees (negative is anticlockwise:
// right end up, as in the 1997 photo, where the lobes' axis leans about 22
// degrees; the 2015 photo is nearly level).
const NEB = [1590, 370]
const ANGLE = -50
const S = 850 / PW
const X0 = -(PW * S) / 2
const Y0 = -(PH * S) / 2
const CA = Math.cos((ANGLE * Math.PI) / 180)
const SA = Math.sin((ANGLE * Math.PI) / 180)
// A point of the picture (photo pixels) in the scene.
const toScene = ([x, y]) => {
  const dx = X0 + x * S
  const dy = Y0 + y * S
  return [NEB[0] + dx * CA - dy * SA, NEB[1] + dx * SA + dy * CA]
}
// The central star (the binary at the nebula's heart), in photo pixels.
const [WX, WY] = toScene([0.4995 * PW, 0.455 * PH])

// The bright star with spikes just above the nebula in the photo (it is cropped
// out of the traced strip): at (422, 254) of the 988 x 826 photo, i.e. in the
// strip's pixels (a strip pixel is 988 / PW photo pixels).
const [HX, HY] = toScene([(422 / 988) * PW, ((254 - 282) / 988) * PW])

// ---------- Still stars (see ../lib/stars.mjs) ----------
// The shader adds the twinkling stars and the big cross stars over these.
seed = 20261121
// The nebula and its glow, a long ellipse on the slant (measured on a render):
// no stars behind it.
const AV = { cx: NEB[0], cy: NEB[1], rx: 340, ry: 105, rot: ANGLE }
const inside = (x, y, k = 1) => {
  const dx = x - AV.cx
  const dy = y - AV.cy
  const ex = (dx * CA + dy * SA) / (AV.rx * k)
  const ey = (dy * CA - dx * SA) / (AV.ry * k)
  return ex * ex + ey * ey < 1
}
const STARS = starField({
  rand,
  box: [AV.cx - 520, AV.cy - 280, AV.cx + 520, AV.cy + 280],
  behind: (x, y) => inside(x, y),
  moves: () => false,
  relocate: () => [rr(100, 900), rr(30, 970)],
  small: 380,
  medium: 80,
  big: 0,
})

// ---------- Faint far galaxies, on the left, away from the nebula ----------
seed = 404
let GALAXIES = ''
;[[600, 520, 22, 35], [700, 110, 14, -20], [180, 230, 18, 60], [330, 640, 12, -10]].forEach(([x, y, r, a]) => {
  GALAXIES += `<g transform="translate(${x} ${y}) rotate(${a}) scale(1 ${r2(rr(0.3, 0.5))})"><circle r="${r}" fill="url(#gx)"/><circle r="${r1(r * 0.25)}" fill="url(#gc)"/></g>`
})

// ---------- The central star: a small still point with a soft halo ----------
const CENTRE = `<g transform="translate(${i0(WX)} ${i0(WY)})"><circle r="26" fill="url(#wd)"/><circle r="3" fill="#f4f8ff"/></g>`

// ---------- The still drawing ----------
const DEFS = `<radialGradient id="gx"><stop offset="0" stop-color="#c8c4e8" stop-opacity=".22"/><stop offset=".5" stop-color="#9890c0" stop-opacity=".08"/><stop offset="1" stop-color="#9890c0" stop-opacity="0"/></radialGradient>
<radialGradient id="gc"><stop offset="0" stop-color="#f4ead8" stop-opacity=".55"/><stop offset="1" stop-color="#f4ead8" stop-opacity="0"/></radialGradient>
<radialGradient id="neb"><stop offset="0" stop-color="#7d8cff" stop-opacity=".05"/><stop offset=".6" stop-color="#e07a4a" stop-opacity=".04"/><stop offset="1" stop-color="#e07a4a" stop-opacity="0"/></radialGradient>
<radialGradient id="wd"><stop offset="0" stop-color="#f0f8ff" stop-opacity=".75"/><stop offset=".2" stop-color="#cfe6ff" stop-opacity=".32"/><stop offset="1" stop-color="#9ed4ff" stop-opacity="0"/></radialGradient>
`

const place = `translate(${i0(NEB[0])} ${i0(NEB[1])}) rotate(${ANGLE}) translate(${r1(X0)} ${r1(Y0)}) scale(${+(S * unit).toFixed(4)})`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${DEFS}</defs>
<rect width="${W}" height="${H}"/>
${STARS.SMALL}${GALAXIES}${STARS.MEDIUM}
<g opacity=".8">
<ellipse cx="${NEB[0]}" cy="${NEB[1]}" rx="${AV.rx}" ry="${AV.ry}" transform="rotate(${ANGLE} ${NEB[0]} ${NEB[1]})" fill="url(#neb)"/>
<g transform="${place}">${UNDER}</g>
<g transform="${place}">${FIL}${SPARK}</g>
${CENTRE}
</g>
</svg>`

// ---------- The motion, as a GPU shader ----------
const SHADER = starShader({
  title: 'the Twin Jet Nebula: stars, a circling pair and shooting stars',
  // No spread star over the nebula; one that lands there moves below it.
  avoid: AV,
  moveTo: [760, 980],
  // A few more small stars in the dark band hugging the nebula: along its
  // lower edge and its upper edge, and a few at each tip.
  around: [
    { count: 14, a0: 20, a1: 160 },
    { count: 14, a0: 200, a1: 340 },
    { count: 3, a0: 160, a1: 200 },
    { count: 3, a0: 340, a1: 380 },
  ],
  placed: [
    [300, 860, 55, [1, 0.9, 0.6]], // larger, slightly yellow, near the bottom left
    [1700, 650, 58, [0.86, 0.92, 1]], // larger, very faintly blue, on the lower right
    [880, 70, 36, [1, 0.92, 0.7]], // medium, yellowish, at the top
    [i0(HX), i0(HY), 42, [1, 0.88, 0.6]], // the bright orange-gold star above the nebula in the photo
  ],
  // The star at the nebula's heart.
  core: { x: i0(WX), y: i0(WY), reach: 36, rgb: [0.9, 0.95, 1], strength: 0.9 },
  // Two distant stars on the left of the sky circle each other, one orbit
  // every 61 s: a quiet echo of the binary at the nebula's heart.
  binary: { x: 330, y: 330, sep: 26, period: 61, rgbs: [[1, 0.8, 0.52], [0.72, 0.84, 1]], mass: 0.6 },
  // Now and then a shooting star on the left side of the sky.
  shooting: [
    { from: [640, 60], dir: [-1, 0.25], cycle: 211, start: 60 },
    { from: [80, 420], dir: [1, 0.5], cycle: 277, start: 170 },
  ],
})

// A still drawing under a shader may be bigger than an animated scene (see check-scene.mjs).
const BUDGET = 125000
if (svg.length > BUDGET) throw new Error(`scene too long: ${svg.length} of ${BUDGET}`)
writeFileSync(out, `// Generated by generators/twinjet/gen-scene.mjs: the Twin Jet Nebula backdrop (still; hooks/shader-twinjet.ts plays its motion).
export const SCENE = ${JSON.stringify(svg)}
`)
if (!process.argv[2]) writeFileSync(new URL('../../hooks/shader-twinjet.ts', import.meta.url), SHADER)
console.log(`scene: ${svg.length} of ${BUDGET} characters (${count} spots in ${lines} lines + ${counts.under.join('+')} underpainting, ${counts.spark} sparks); shader ${SHADER.length}`)
