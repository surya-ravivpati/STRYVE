# STRYVE

**Performance intelligence for athletes.** The flagship product of **PowerThru —
Athletics × Technology**.

STRYVE is a performance monitor: it reads physiological and movement signals from
the working muscle and turns them into a live picture of training intensity,
muscle activity, fatigue and readiness. Its flagship capability is cramp-risk
detection — a differentiated feature *inside* the platform, not the whole product.

## Positioning

The site is deliberately ordered so performance monitoring lands before cramp
detection:

```
Athletics × Technology
  └─ STRYVE performance monitor
       └─ multimodal physiological intelligence
            └─ flagship cramp detection
```

Copy about cramp risk is written to be scientifically responsible: STRYVE
identifies patterns *associated with* rising risk. It is not presented as a
medical device and makes no diagnostic, accuracy or clinical-validation claims.

## Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS** for the design system tokens
- **three.js / React Three Fiber / drei** for the 3D product
- **Framer Motion** for scroll-linked motion

## Design system

Pulse and Chalk are sampled from the supplied brand artwork so the site matches
the logo and wordmark exactly. Carbon is a cool instrument-grade graphite, chosen
so the warm cream and orange read as light inside a dark machine.

| Token  | Role                                  | Value     | Source             |
| ------ | ------------------------------------- | --------- | ------------------ |
| Carbon | Primary background, surfaces          | `#0A0B0D` | graphite black     |
| Chalk  | Primary text, high contrast           | `#F2EBE0` | sampled: wordmark  |
| Pulse  | Data, active states, CTAs, risk       | `#FF421D` | sampled: logo mark |
| Ion    | Secondary data / AI accent, sparingly | `#3BE0CF` | data accent        |
| Slate  | Secondary text, borders, muted UI     | `#6E757E` | warm-neutral gray  |

Type: **Archivo** variable — the width axis drives a condensed display voice
(`.display`) against a normal-width editorial voice (`.editorial`) — with
**JetBrains Mono** for technical labels and readouts (`.label`).

## The scroll-driven 3D story

`src/components/sections/ScrollStory.tsx` pins a full-screen canvas across 520vh
and drives `three/StoryScene.tsx` from a single scroll `MotionValue`. Scroll
progress controls camera dolly and height, rotation, tilt, and an **exploded
view** built from the model's real part names — `semg_electrode_pad`,
`imu_sensor_pod`, `gsr_electrode_pad_a/b`, `temperature_sensor_mount` separate
further than structural parts, so the sensing system reads as an engineering
reveal rather than scattered geometry.

Beats: product → placement → sensors → fusion → performance intelligence.

## 3D pipeline

`models/PowerThru_Assembly_Reveal.blend` (Blender 5.x) is the authored source.
Browsers cannot load `.blend`, so it is exported to
`public/models/stryve-wearable.glb` (763 KB, 8.6k verts).

```bash
pip install bpy==5.0.1
python3 scripts/export_model.py
```

## Performance

- three.js is a separate lazily-loaded chunk — it never blocks first paint
- every canvas pauses its render loop when scrolled out of view
- mobile gets lower DPR, a smaller environment map, no contact shadows, and a
  pulled-back camera
- all sections below the story are route-split via `React.lazy`
- motion respects `prefers-reduced-motion`; the live traces stop entirely

## Develop

```bash
npm install
npm run dev        # dev server
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build
npm run preview    # serve the production build
```
