// Shared by the scenes traced from photographs (crab, ring, ...). Not a scene:
// build.mjs skips this folder.
//
// Shrinks a full-size photo (kept in the git-ignored sources/ folder) to the
// small grid of colours a scene is traced from: <name>-pixels.bin.gz, which is
// committed, so a fresh copy of the repo builds without the original.
//
//   node generators/lib/make-pixels.cjs <source.jpg> <out.bin.gz>
//        [--crop=x,y,w,h] [--fade=r0,r1] [--size=400] [--preview=file.jpg]
//
// or from a script: require('../lib/make-pixels.cjs')({ src, out, crop, fade, size, preview }).
//
// - crop: fractions of the original's width and height (default the whole picture).
// - fade: full picture inside r0, black beyond r1, as fractions of half the
//   smaller side, measured from the crop's centre, with a smooth step between.
//   For a long, flat nebula give fade.x and fade.y ({r0, r1} each) instead: the
//   picture then fades along each axis on its own, as fractions of half the
//   crop's width (x) and half its height (y), the two fades multiplied.
//   fade.y.bottom ({r0, r1}) may give the bottom half its own fade.
// - extend: rows to add below the crop, filled with a mirror image of its last
//   rows (so a nebula cut off by the photo's edge can fade out in its own haze);
//   the fades see the taller picture.
// - grade: an optional colour change, as the source text of a function from (r, g, b)
//   (0-255) to [r, g, b] (clamped), applied before the fade: to pull a photo's
//   colours towards a scene's palette (the Hourglass turns the photo's orange
//   walls pink). Given as text because it runs inside the browser.
// - size: the grid's width in pixels; the height follows the crop's shape.
// - preview: also save the shrunk, faded picture as a JPEG to look at.
//
// Edge (through playwright-core, installed for previews) is the image tool:
// the original is drawn onto a canvas, cropped, scaled down and faded. Set
// SCENE_BROWSER to use another Chromium-based browser. The file holds two
// 16-bit little-endian numbers (width, height), then width x height RGB bytes,
// gzipped.
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const { chromium } = require(process.env.PLAYWRIGHT_CORE || path.join(__dirname, '../../node_modules/playwright-core'))

async function makePixels({ src, out, crop = { x: 0, y: 0, w: 1, h: 1 }, fade = { r0: 0.66, r1: 1.02 }, size = 400, grade, preview, extend = 0 }) {
  const browser = await chromium.launch({ channel: process.env.SCENE_BROWSER || 'msedge' })
  try {
    const page = await browser.newPage()
    const type = /\.png$/i.test(src) ? 'png' : 'jpeg'
    const data = fs.readFileSync(src).toString('base64')
    await page.setContent(`<img id=i src="data:image/${type};base64,${data}">`)
    const res = await page.evaluate(async ({ size, CROP, FADE, GRADE_SRC, EXT }) => {
      const img = document.getElementById('i')
      await img.decode()
      const W = img.naturalWidth
      const H = img.naturalHeight
      const ow = size
      const oh0 = Math.round((size * (CROP.h * H)) / (CROP.w * W))
      const oh = oh0 + EXT
      const c = document.createElement('canvas')
      c.width = ow
      c.height = oh
      const g = c.getContext('2d')
      g.imageSmoothingQuality = 'high'
      g.drawImage(img, CROP.x * W, CROP.y * H, CROP.w * W, CROP.h * H, 0, 0, ow, oh0)
      if (EXT) {
        // Extend the picture downwards by a mirror image of its last rows.
        g.save()
        g.beginPath()
        g.rect(0, oh0, ow, EXT)
        g.clip()
        g.translate(0, oh0 * 2)
        g.scale(1, -1)
        g.drawImage(img, CROP.x * W, CROP.y * H, CROP.w * W, CROP.h * H, 0, 0, ow, oh0)
        g.restore()
      }
      const d = g.getImageData(0, 0, ow, oh)
      const px = d.data
      const GRADE = GRADE_SRC ? new Function('r', 'g', 'b', GRADE_SRC) : null
      const R = Math.min(ow, oh) / 2
      const rgb = []
      for (let y = 0; y < oh; y++) {
        for (let x = 0; x < ow; x++) {
          const step = (r, a) => {
            const t = (r - a.r0) / (a.r1 - a.r0)
            return t <= 0 ? 1 : t >= 1 ? 0 : 1 - t * t * (3 - 2 * t)
          }
          const k = FADE.x
            ? step(Math.abs(x - ow / 2) / (ow / 2), FADE.x) * step(Math.abs(y - oh / 2) / (oh / 2), y > oh / 2 && FADE.y.bottom ? FADE.y.bottom : FADE.y)
            : step(Math.hypot(x - ow / 2, y - oh / 2) / R, FADE)
          const i = (y * ow + x) * 4
          if (GRADE) {
            const c = GRADE(px[i], px[i + 1], px[i + 2])
            for (let ch = 0; ch < 3; ch++) px[i + ch] = Math.max(0, Math.min(255, c[ch]))
          }
          for (let ch = 0; ch < 3; ch++) {
            px[i + ch] = Math.round(px[i + ch] * k)
            rgb.push(px[i + ch])
          }
        }
      }
      g.putImageData(d, 0, 0)
      return { W, H, ow, oh, rgb, url: c.toDataURL('image/jpeg', 0.9) }
    }, { size, CROP: crop, FADE: fade, GRADE_SRC: grade, EXT: extend })
    const head = Buffer.alloc(4)
    head.writeUInt16LE(res.ow, 0)
    head.writeUInt16LE(res.oh, 2)
    const gz = zlib.gzipSync(Buffer.concat([head, Buffer.from(res.rgb)]), { level: 9 })
    fs.writeFileSync(out, gz)
    if (preview) fs.writeFileSync(preview, Buffer.from(res.url.split(',')[1], 'base64'))
    console.log(`${path.basename(out)}: ${res.ow} x ${res.oh} from ${res.W} x ${res.H}, ${gz.length} bytes`)
  } finally {
    await browser.close()
  }
}

module.exports = makePixels

if (require.main === module) {
  const args = process.argv.slice(2)
  const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')))
  const [src, out] = args.filter(a => !a.startsWith('--'))
  if (!src || !out) {
    console.error('usage: node make-pixels.cjs <source.jpg> <out.bin.gz> [--crop=x,y,w,h] [--fade=r0,r1] [--size=400] [--preview=file.jpg]')
    process.exit(1)
  }
  const nums = s => s.split(',').map(Number)
  const opts = { src, out, preview: flags.preview }
  if (flags.crop) { const [x, y, w, h] = nums(flags.crop); opts.crop = { x, y, w, h } }
  if (flags.fade) { const [r0, r1] = nums(flags.fade); opts.fade = { r0, r1 } }
  if (flags.size) opts.size = Number(flags.size)
  makePixels(opts).catch(e => { console.error(e); process.exit(1) })
}
