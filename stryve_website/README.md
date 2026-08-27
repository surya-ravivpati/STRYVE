# STRYVE

**Predict. Prevent. Perform.**

A premium, cinematic marketing site for STRYVE — an intelligent athletic wearable
that reads muscle fatigue and predicts cramp risk before it happens.

Built as a modern React single-page experience with a strict brand system,
scroll-driven motion, and a live biometric dashboard.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3** — design tokens for the brand palette
- **Framer Motion** — scroll reveals, parallax, staggered transitions
- Pure-SVG product rendering & data visualization (no external image/3D assets)

## Brand system

Pulse and Chalk are sampled directly from the supplied brand artwork, so the site
matches the logo and wordmark exactly. Carbon and Slate are warmed to sit under
that cream-and-orange pairing.

| Token  | Role                                   | Value     | Source              |
| ------ | -------------------------------------- | --------- | ------------------- |
| Carbon | Dominant dark surface / backgrounds    | `#0B0A09` | warm graphite black |
| Chalk  | Primary light text                     | `#F2EBE0` | sampled: wordmark   |
| Pulse  | Primary accent — CTAs, energy, glow    | `#FF421D` | sampled: logo mark  |
| Ion    | Secondary accent — data / tech         | `#31E7E0` | data accent         |
| Slate  | Neutral — borders, dividers, muted UI  | `#8A8078` | warm neutral        |

Type: **Archivo Black** (display, matched to the wordmark's weight) · **Archivo**
(body) · **Space Mono** (data readouts).

## Brand assets

- `public/brand/word_mark.png` — official wordmark, used verbatim in nav and footer
- `public/brand/logo.png` — source logo art
- `src/components/brand/Mark.jsx` — the Y-spike mark traced from `logo.png` to a
  single SVG path, so it scales crisply and can be recolored or animated. It runs
  through the site as the section-header glyph, nav mark, and large watermark.

## 3D product

`models/PowerThru_Assembly_Reveal.blend` is the authored source (Blender 5.x).
Browsers cannot load `.blend`, so it is exported to `public/models/stryve-wearable.glb`
(763 KB, 8.6k verts) and rendered live with three.js / React Three Fiber in
`src/components/three/WearableModel.jsx`.

Re-export after editing the .blend:

```bash
pip install bpy==5.0.1
python3 scripts/export_model.py
```

The renderer lights the model in-scene with `<Lightformer>` rigs rather than an
external HDR, so it has no third-party runtime dependency. Each canvas pauses its
render loop when scrolled out of view, and the whole three.js bundle is lazily
loaded so it never blocks first paint.

## Structure

Reusable components under `src/components`:

- `Navbar` — transparent over hero, transitions to carbon on scroll, mobile menu
- `sections/` — Hero, Problem, HowItWorks, Technology, Dashboard, BuiltForMoment,
  UseCases, Philosophy, Product, CTA, Footer
- `ui/` — `Button`, `Reveal` (scroll animation), `SectionHeader`, `Wordmark`, `Wearable`
- `hooks/useCountUp` — viewport-triggered number counters

Below-the-fold sections are lazy-loaded for fast first paint. All motion respects
`prefers-reduced-motion`; interactive elements are keyboard navigable.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```
