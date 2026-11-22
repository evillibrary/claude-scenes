import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE as MARS } from './scene-mars'
import { SCENE as DEEP } from './scene-deep-sea'
import { SCENE as RAIN } from './scene-rainforest'
import { SCENE as SNOW } from './scene-blizzard'
import { SCENE as BOOKS } from './scene-library'
import { SCENE as CRAB } from './scene-crab'
import { SCENE as HELIX } from './scene-helix'
import { SCENE as HOURGLASS } from './scene-hourglass'
import { SCENE as RING } from './scene-ring'
import { SCENE as TWINJET } from './scene-twinjet'

// All the looks in one mod, switched with /scene. The choice is kept in the
// mod's store, so new sessions open on the last scene picked.

type Look = {
  name: string
  label: string
  svg: string
  alt: string
  look: ThemeSetArgs
  problems: readonly string[]
}

function look(
  name: string,
  label: string,
  svg: string,
  alt: string,
  roles: { accent: string; danger: string; success: string; warning: string; pro: string },
  anchors: { 'surface-0': string; 'text-primary': string } & Record<string, string>,
  tint: string,
  opacity: number,
  blur = 10,
): Look {
  const { theme, problems } = makeColors({ label, only: 'dark', roles, dark: { gray: { anchors } } })
  // A lighter frost than before (blur 18 -> 10) so more of the scene shows
  // through the middle panel.
  const set: ThemeSetArgs = { colors: theme, backdrop: { scene: name, glass: { blur, tint, opacity } } }

  return { name, label, svg, alt, look: set, problems }
}

const LOOKS: Look[] = [
  look(
    'mars-dusk',
    'Mars at dusk',
    MARS,
    'A Martian dusk: rust ground, a dusty horizon glow and a slowly turning sky',
    { accent: '#d9783a', danger: '#d8404f', success: '#8fae5a', warning: '#e0a83a', pro: '#a586d9' },
    {
      'surface-0': '#130909', 'surface-1': '#1a0d0c', 'surface-2': '#211110', 'surface-3': '#281513',
      'text-primary': '#f5e8db', 'text-secondary': '#d9c3b0', 'text-muted': '#b89f8b',
    },
    '#140808',
    0.6,
  ),
  look(
    'deep-sea',
    'Deep sea',
    DEEP,
    'The ocean from the surface to the abyssal floor, with deep-sea animals slowly appearing and fading',
    { accent: '#3fc6d8', danger: '#e0566a', success: '#4fbf8f', warning: '#e2b44a', pro: '#9a7cf0' },
    {
      'surface-0': '#03070d', 'surface-1': '#070d16', 'surface-2': '#0b1320', 'surface-3': '#0f1828',
      'text-primary': '#e6f0f6', 'text-secondary': '#b5c7d4', 'text-muted': '#8ca3b4',
    },
    '#02060c',
    0.56,
  ),
  look(
    'rainforest',
    'Rainforest',
    RAIN,
    'A misty rainforest understorey where insects, gibbons, a hornbill and a stalking tiger come and go',
    { accent: '#8fcf6a', danger: '#e0574f', success: '#4fbfa0', warning: '#e3b13c', pro: '#b28be0' },
    {
      'surface-0': '#060a07', 'surface-1': '#0a100b', 'surface-2': '#0e160f', 'surface-3': '#131c14',
      'text-primary': '#e9efe2', 'text-secondary': '#c1ccb9', 'text-muted': '#98a690',
    },
    '#050906',
    0.56,
  ),
  look(
    'blizzard',
    'Blizzard',
    SNOW,
    'A gloomy blizzard in a fog-bound pine forest, framed by snow-plastered trees where a snowy owl now and then comes to rest',
    { accent: '#86bfe0', danger: '#e0606a', success: '#6fbf8f', warning: '#e2b552', pro: '#a58be0' },
    {
      'surface-0': '#0b0e12', 'surface-1': '#0f1318', 'surface-2': '#13181e', 'surface-3': '#181e25',
      'text-primary': '#e8eef3', 'text-secondary': '#c0cad3', 'text-muted': '#97a3ae',
    },
    '#080b0f',
    // A lighter veil than the others, so more of the storm shows through.
    0.38,
  ),
  look(
    'library',
    'Library',
    BOOKS,
    'A dim, lamplit wall of bookshelves where books glow with runes or vanish, red eyes watch from a gap, and an orangutan climbs down to read',
    { accent: '#d9a54a', danger: '#d8504a', success: '#7fae6a', warning: '#e0a83a', pro: '#a98be0' },
    {
      'surface-0': '#0d0805', 'surface-1': '#130c08', 'surface-2': '#19110b', 'surface-3': '#20160f',
      'text-primary': '#f3e9dc', 'text-secondary': '#d4c3ad', 'text-muted': '#ab9883',
    },
    '#0c0704',
    0.5,
    // Half the usual frost, so the shelves show through behind the text.
    5,
  ),
  look(
    'ring',
    'Ring Nebula',
    RING,
    'The Ring Nebula, traced from a Hubble photograph, in a black star field with twinkling stars, a small edge-on galaxy, a passing comet and a shooting star now and then',
    { accent: '#5fc8e0', danger: '#e0566a', success: '#6fc79a', warning: '#e2b052', pro: '#c8553d' },
    {
      'surface-0': '#04060c', 'surface-1': '#080b15', 'surface-2': '#0c101d', 'surface-3': '#111626',
      'text-primary': '#eaf1f6', 'text-secondary': '#c0ccd8', 'text-muted': '#96a3b4',
    },
    '#000000',
    0.5,
  ),
  look(
    'twinjet',
    'Twin Jet Nebula',
    TWINJET,
    'The Twin Jet Nebula, traced from a Hubble photograph, glowing on the right of a black star field with twinkling stars, a pair of distant stars circling each other on the left, and a shooting star now and then',
    { accent: '#7d8cff', danger: '#e0566a', success: '#6fc79a', warning: '#e2b052', pro: '#e07a4a' },
    {
      'surface-0': '#04050d', 'surface-1': '#080a16', 'surface-2': '#0c0f1f', 'surface-3': '#111428',
      'text-primary': '#eceef8', 'text-secondary': '#c2c8e0', 'text-muted': '#989fba',
    },
    '#000000',
    0.5,
  ),
  look(
    'hourglass',
    'Hourglass Nebula',
    HOURGLASS,
    'The Hourglass Nebula, traced from a Hubble photograph, standing upright on the left of a black star field with an eye of teal light at its waist, twinkling stars, a passing comet and a shooting star now and then',
    { accent: '#e0607a', danger: '#e0566a', success: '#6fc79a', warning: '#e2b052', pro: '#5fb8c8' },
    {
      'surface-0': '#05050d', 'surface-1': '#090a16', 'surface-2': '#0d0e1f', 'surface-3': '#121328',
      'text-primary': '#eef0f8', 'text-secondary': '#c6cadf', 'text-muted': '#9ca0b9',
    },
    '#000000',
    0.5,
  ),
  look(
    'helix',
    'Helix Nebula',
    HELIX,
    'The Helix Nebula, traced from a Hubble photograph, glowing on the right of a black star field like a great eye with a red ring, a gold and teal inner ring and a blue-green centre, with twinkling stars, a passing comet and a shooting star now and then',
    { accent: '#e0b04a', danger: '#e0566a', success: '#6fc79a', warning: '#e2b052', pro: '#4fb0b0' },
    {
      'surface-0': '#04060d', 'surface-1': '#080b16', 'surface-2': '#0c101f', 'surface-3': '#111528',
      'text-primary': '#eef0f8', 'text-secondary': '#c6cadf', 'text-muted': '#9ca0b9',
    },
    '#000000',
    0.5,
  ),
]

// Short names people may type.
const ALIASES: Record<string, string> = {
  mars: 'mars-dusk', dusk: 'mars-dusk', 'mars-dusk': 'mars-dusk',
  deep: 'deep-sea', sea: 'deep-sea', ocean: 'deep-sea', 'deep-sea': 'deep-sea',
  rainforest: 'rainforest', jungle: 'rainforest', forest: 'rainforest', rain: 'rainforest',
  blizzard: 'blizzard', snow: 'blizzard', storm: 'blizzard', winter: 'blizzard', owl: 'blizzard',
  library: 'library', books: 'library', stacks: 'library', librarian: 'library', ook: 'library',
  crab: 'crab', 'crab-nebula': 'crab', m1: 'crab', pulsar: 'crab', supernova: 'crab',
  ring: 'ring', 'ring-nebula': 'ring', m57: 'ring', lyra: 'ring',
  twinjet: 'twinjet', 'twin-jet': 'twinjet', butterfly: 'twinjet', 'm2-9': 'twinjet', jets: 'twinjet',
  hourglass: 'hourglass', mycn18: 'hourglass', 'mycn-18': 'hourglass', eye: 'hourglass',
  helix: 'helix', 'helix-nebula': 'helix', ngc7293: 'helix', 'eye-of-god': 'helix',
}
const DEFAULT = 'rainforest'
const find = (name: unknown) => LOOKS.find(l => l.name === name)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'scene',
      description: 'Switch the backdrop scene: mars, deep, rainforest, blizzard, library, ring, crab, twinjet, hourglass or helix (no name lists them)',
      argumentHint: '[mars|deep|rainforest|blizzard|library|ring|crab|twinjet|hourglass|helix|next]',
    })
    const chosen = find(await $.store.get('scene')) ?? find(DEFAULT)!
    const unpainted = chosen.problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(chosen.look)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('command.run', { command: 'scene' }, async ($, e) => {
    const current = find(await $.store.get('scene')) ?? find(DEFAULT)!
    const word = e.args.trim().toLowerCase()
    const list = LOOKS.map(l => `${l.name === current.name ? '●' : '○'} ${l.label}`).join('\n')

    if (word === '') {
      return { text: `Scenes (/scene <name>, or /scene next):\n${list}` }
    }
    const target =
      word === 'next'
        ? LOOKS[(LOOKS.indexOf(current) + 1) % LOOKS.length]!
        : find(ALIASES[word])

    if (target === undefined) {
      return { text: `No scene called "${word}". Try mars, deep, rainforest, blizzard, library, ring, crab, twinjet, hourglass or helix.\n${list}` }
    }
    await $.store.set('scene', target.name)
    const set = await $.theme.set(target.look)

    return {
      text: set.isDrawn
        ? `Scene: ${target.label}. New sessions open on it too; other open sessions change when they restart.`
        : `Scene set to ${target.label}, but this surface can't draw it: ${set.reason}`,
    }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const chosen = find(e.props.scene)

    if (chosen === undefined) {
      return next(e)
    }
    const { Shader, Svg } = $.ui.resolve(e)

    // The nebula scenes are one completely still drawing, with all their motion
    // played over it on the GPU by a shader (generators/lib/shader.mjs). Any
    // change in the SVG near their ~9,000 traced strokes froze the app. On the
    // phone or under Reduce Motion the still drawing shows alone. A Shader's
    // module must be written out in the element itself, so one line per scene.
    if (chosen.name === 'ring') {
      return (
        <Shader module="./shader-ring.ts">
          <Svg source={chosen.svg} alt={chosen.alt} />
        </Shader>
      )
    }
    if (chosen.name === 'crab') {
      return (
        <Shader module="./shader-crab.ts">
          <Svg source={chosen.svg} alt={chosen.alt} />
        </Shader>
      )
    }
    if (chosen.name === 'twinjet') {
      return (
        <Shader module="./shader-twinjet.ts">
          <Svg source={chosen.svg} alt={chosen.alt} />
        </Shader>
      )
    }
    if (chosen.name === 'hourglass') {
      return (
        <Shader module="./shader-hourglass.ts">
          <Svg source={chosen.svg} alt={chosen.alt} />
        </Shader>
      )
    }
    if (chosen.name === 'helix') {
      return (
        <Shader module="./shader-helix.ts">
          <Svg source={chosen.svg} alt={chosen.alt} />
        </Shader>
      )
    }
    return <Svg source={chosen.svg} alt={chosen.alt} isInteractive />
  })
}
