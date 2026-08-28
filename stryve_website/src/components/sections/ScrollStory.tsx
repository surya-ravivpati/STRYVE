import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { SENSORS } from '../three/StoryScene'

const StoryScene = lazy(() => import('../three/StoryScene'))

/** Narrative beats, each mapped to a slice of the pinned scroll. */
const SCENES = [
  {
    at: [0.0, 0.18],
    label: 'The product',
    title: 'Built for movement.',
    body: 'A single wearable, worn on the working muscle. Lightweight enough to forget, precise enough to matter.',
  },
  {
    at: [0.22, 0.37],
    label: 'The athlete',
    title: 'Worn where the work happens.',
    body: 'Positioned on the muscle group under load, STRYVE reads the body at the source rather than inferring it from the wrist.',
  },
  {
    at: [0.41, 0.57],
    label: 'The sensors',
    title: 'Four signals. One surface.',
    body: 'Muscle activity, movement, skin conductivity and temperature — captured together, in the same place, at the same moment.',
  },
  {
    at: [0.61, 0.77],
    label: 'Sensor fusion',
    title: 'Signals become a picture.',
    body: 'No single metric explains an athlete. STRYVE combines the streams to build a live model of how the body is responding.',
  },
  {
    at: [0.81, 1.0],
    label: 'Performance intelligence',
    title: 'A clearer read on your limits.',
    body: 'Intensity, fatigue, readiness and rising cramp risk — one continuous picture of what is happening beneath the surface.',
  },
]

function SceneCopy({ scene, progress }: { scene: (typeof SCENES)[number]; progress: MotionValue<number> }) {
  const [a, b] = scene.at
  const pad = 0.015
  const opacity = useTransform(progress, [a - pad, a + pad, b - pad, b + pad], [0, 1, 1, 0])
  const y = useTransform(progress, [a - pad, a + pad, b - pad, b + pad], [26, 0, 0, -26])

  return (
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 lg:inset-y-0 lg:right-auto lg:w-[34%]">
      <div className="flex h-full flex-col justify-end px-6 pb-16 md:px-10 lg:justify-center lg:px-0 lg:pb-0">
        <span className="label flex items-center gap-3">
          <span className="h-px w-8 bg-pulse" />
          {scene.label}
        </span>
        <h3 className="editorial mt-5 text-[clamp(1.8rem,3.6vw,3rem)] text-chalk">{scene.title}</h3>
        <p className="mt-4 max-w-sm text-[14.5px] leading-[1.7] text-chalk-dim">{scene.body}</p>
      </div>
    </motion.div>
  )
}

/** Sensor legend that fills in as the assembly separates. */
function SensorLegend({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.4, 0.46, 0.6, 0.655], [0, 1, 1, 0])
  return (
    <motion.ul
      style={{ opacity }}
      className="pointer-events-none absolute right-0 top-1/2 z-20 hidden w-[300px] -translate-y-1/2 flex-col gap-px lg:flex"
    >
      {SENSORS.map((s, i) => (
        <SensorRow key={s.key} index={i} label={s.label} sub={s.sub} progress={progress} />
      ))}
    </motion.ul>
  )
}

function SensorRow({
  index,
  label,
  sub,
  progress,
}: {
  index: number
  label: string
  sub: string
  progress: MotionValue<number>
}) {
  const start = 0.44 + index * 0.028
  const opacity = useTransform(progress, [start, start + 0.03], [0.15, 1])
  const x = useTransform(progress, [start, start + 0.05], [16, 0])
  return (
    <motion.li
      style={{ opacity, x }}
      className="flex items-center gap-4 border-l border-pulse/50 bg-carbon-800/70 py-2.5 pl-4 pr-6 backdrop-blur-sm"
    >
      <span className="num text-xl text-chalk">{label}</span>
      <span className="label text-[9px] text-ion">{sub}</span>
    </motion.li>
  )
}

export default function ScrollStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // fusion convergence bars near the end of the story
  const fuseOpacity = useTransform(scrollYProgress, [0.68, 0.74, 0.86, 0.93], [0, 1, 1, 0])

  return (
    <section ref={ref} id="product" className="relative h-[520vh] bg-carbon">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 grid-fine opacity-50" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[46%] bg-gradient-to-r from-carbon via-carbon/85 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-carbon via-carbon/90 to-transparent lg:hidden" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse/[0.07] blur-[150px]" />

        {/* 3D stage */}
        <Suspense fallback={<div className="absolute inset-0" />}>
          <StoryScene progress={scrollYProgress} className="absolute inset-0 h-full w-full" />
        </Suspense>

        {/* narrative overlays */}
        <div className="container-x relative h-full">
          {SCENES.map((s) => (
            <SceneCopy key={s.label} scene={s} progress={scrollYProgress} />
          ))}
          <SensorLegend progress={scrollYProgress} />

          {/* fusion readout */}
          <motion.div
            style={{ opacity: fuseOpacity }}
            className="pointer-events-none absolute right-0 top-1/2 z-20 hidden w-[300px] -translate-y-1/2 flex-col gap-2 border border-chalk/[0.09] bg-carbon-800/80 p-5 backdrop-blur-sm lg:flex"
          >
            <span className="label">Fusion</span>
            {[
              ['Muscle activity', 78],
              ['Movement load', 64],
              ['Skin response', 52],
              ['Temperature', 41],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center gap-3">
                <span className="w-[112px] font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-light">{l}</span>
                <span className="h-[3px] flex-1 bg-carbon-600">
                  <span className="block h-full bg-ion" style={{ width: `${v}%` }} />
                </span>
              </div>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-chalk/10 pt-3">
              <span className="w-[112px] label text-pulse">Output</span>
              <span className="num text-lg text-chalk">Performance intelligence</span>
            </div>
          </motion.div>
        </div>

        {/* progress rail */}
        <div className="absolute bottom-6 left-1/2 hidden w-[220px] -translate-x-1/2 lg:block">
          <div className="h-px w-full bg-chalk/10">
            <motion.div className="h-full origin-left bg-pulse" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  )
}
