import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Mark from '../brand/Mark.jsx'

const WearableModel = lazy(() => import('../three/WearableModel.jsx'))

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const STATS = [
  ['5', 'Fused sensors'],
  ['<1s', 'Signal latency'],
  ['6 min', 'Warning window'],
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, 90])
  const yProduct = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section id="top" ref={ref} className="relative grain min-h-[100svh] overflow-hidden pt-[72px]">
      <div className="absolute inset-0 grid-lines opacity-60" />
      {/* giant mark watermark */}
      <Mark className="pointer-events-none absolute -left-[12%] top-[8%] h-[120%] w-auto text-chalk/[0.022]" />
      <div className="pointer-events-none absolute -right-[8%] top-0 h-[620px] w-[620px] rounded-full bg-pulse/[0.13] blur-[150px]" />
      <div className="pointer-events-none absolute -left-[6%] bottom-0 h-[420px] w-[420px] rounded-full bg-ion/[0.07] blur-[140px]" />

      <div className="container-x relative z-10 grid min-h-[calc(100svh-72px)] grid-cols-1 items-center gap-8 py-10 lg:grid-cols-12 lg:gap-4">
        <motion.div className="lg:col-span-6" style={{ y: yCopy, opacity }} variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-pulse" />
              Predict · Prevent · Perform
            </span>
          </motion.div>

          <h1 className="display-tight text-[clamp(2.6rem,7vw,5.9rem)]">
            <motion.span variants={item} className="block">Performance</motion.span>
            <motion.span variants={item} className="block text-outline">starts before</motion.span>
            <motion.span variants={item} className="block">
              the <span className="text-pulse">cramp.</span>
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-7 max-w-md text-[15px] leading-[1.75] text-chalk-dim">
            An intelligent wearable that reads muscle fatigue at the source — catching the signals
            that lead to cramps before they cost you the moment.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#join" className="btn-primary">Get STRYVE <span aria-hidden>→</span></a>
            <a href="#technology" className="btn-ghost">Explore the Technology <span aria-hidden>↓</span></a>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-stretch gap-x-12 gap-y-4 border-t border-chalk/[0.08] pt-6">
            {STATS.map(([n, l]) => (
              <div key={l} className="flex flex-col">
                <span className="font-display text-[26px] leading-none tracking-tight text-chalk">{n}</span>
                <span className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Real 3D wearable */}
        <motion.div
          className="relative lg:col-span-6"
          style={{ y: yProduct }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.25 }}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[500px]">
            <Suspense fallback={<div className="h-full w-full" />}>
              <WearableModel className="h-full w-full" spin={0.16} />
            </Suspense>

            <Chip className="left-0 top-[18%]" label="MUSCLE FATIGUE" value="72%" tone="ion" delay={1.0} />
            <Chip className="right-0 top-[44%]" label="CRAMP RISK" value="LOW" tone="pulse" delay={1.2} />
            <Chip className="left-2 bottom-[16%]" label="READINESS" value="91" tone="ion" delay={1.4} />
          </div>
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-slate">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-slate to-transparent" />
      </motion.div>
    </section>
  )
}

function Chip({ className = '', label, value, tone = 'ion', delay = 0 }) {
  const dot = tone === 'pulse' ? 'bg-pulse' : 'bg-ion'
  const val = tone === 'pulse' ? 'text-pulse' : 'text-chalk'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-20 hidden items-center gap-3 border border-chalk/10 bg-carbon-800/85 px-4 py-2.5 backdrop-blur-md sm:flex ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot} animate-pulse-glow`} />
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate">{label}</span>
        <span className={`mt-1.5 font-display text-sm ${val}`}>{value}</span>
      </div>
    </motion.div>
  )
}
