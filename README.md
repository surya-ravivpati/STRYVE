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

| Token  | Role                                   | Value     |
| ------ | -------------------------------------- | --------- |
| Carbon | Dominant dark surface / backgrounds    | `#0A0C10` |
| Chalk  | Primary light text                     | `#F4F6F5` |
| Pulse  | Primary accent — CTAs, energy, glow    | `#FF4127` |
| Ion    | Secondary accent — data / tech         | `#31E7E0` |
| Slate  | Neutral — borders, dividers, muted UI  | `#7A828C` |

Type: **Archivo** (geometric athletic display + body) · **Space Mono** (data readouts).

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
