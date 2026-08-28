import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import Mark from '../brand/Mark'

const StoryScene = lazy(() => import('../three/StoryScene'))

const container = { hidden: {}, show: { transition: { staggerChildren: 0.085, delayChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
}

/** Live-looking intensity readout — the hero's one piece of "instrument" UI. */
function IntensityStrip() {
  const bars = [38, 52, 61, 74, 83, 91, 86, 79, 88, 94, 90, 84, 77, 85, 92]
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.9 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: `${h * 0.42}px` }}
          className={`w-[3px] origin-bottom ${h > 80 ? 'bg-pulse' : 'bg-slate-dark'}`}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 110])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  /* Hold the assembly in its "whole product" pose, drifting gently on scroll. */
  const modelProgress = useTransform(scrollYProgress, [0, 1], [0.03, 0.2])
  const yModel = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section id="top" ref={ref} className="grain relative flex min-h-[100svh] flex-col overflow-hidden pt-[68px]">
      <div className="absolute inset-0 grid-fine opacity-60" />
      <Mark className="pointer-events-none absolute -right-[14%] -top-[10%] h-[130%] w-auto text-chalk/[0.02]" />
      <div className="pointer-events-none absolute -left-[10%] top-1/4 h-[520px] w-[520px] rounded-full bg-pulse/[0.09] blur-[160px]" />
      <div className="pointer-events-none absolute right-[4%] top-1/3 h-[460px] w-[460px] rounded-full bg-pulse/[0.1] blur-[150px]" />

      <div className="container-x relative z-10 flex flex-1 flex-col justify-center py-10">
        {/* headline runs the full measure — nothing crowds it */}
        <motion.div style={{ y, opacity }} variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-7 flex items-center gap-3">
            <span className="label flex items-center gap-2.5 text-chalk-dim">
              <Mark className="h-3 w-auto text-pulse" />
              PowerThru — Athletics × Technology
            </span>
          </motion.div>

          <h1 className="display text-[clamp(2.7rem,7.6vw,6.6rem)]">
            <motion.span variants={item} className="block">
              Know your
            </motion.span>
            <motion.span variants={item} className="block">
              performance.
            </motion.span>
          </h1>
        </motion.div>

        {/* supporting band: copy left, product right */}
        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <motion.div
            style={{ y, opacity }}
            className="lg:col-span-7"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item} className="max-w-md text-[15.5px] leading-[1.75] text-chalk-dim">
              STRYVE is a performance monitor for athletes. It reads physiological and movement
              signals from the working muscle and turns them into a live picture of how hard you're
              working — and how your body is responding.
            </motion.p>

            <motion.p
              variants={item}
              className="mt-5 max-w-md border-l border-pulse/40 pl-5 text-[13.5px] leading-[1.75] text-slate-light"
            >
              And as your body approaches its limit, STRYVE identifies signals associated with rising
              cramp risk — early enough to do something about it.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/reserve" className="btn-primary lift">
                Reserve STRYVE <span aria-hidden>→</span>
              </Link>
              <a href="#product" className="btn-ghost">
                Explore STRYVE <span aria-hidden>↓</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:col-span-5"
            style={{ y: yModel, opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.35 }}
          >
            <div className="relative mx-auto aspect-square w-full max-w-[400px]">
              <Suspense fallback={<div className="h-full w-full" />}>
                <StoryScene progress={modelProgress} className="h-full w-full" zoom={1.42} />
              </Suspense>

              <Chip className="-left-8 top-[6%]" label="Intensity" value="92%" tone="pulse" delay={1.1} />
              <Chip className="-right-8 top-[50%]" label="Cramp risk" value="Low" tone="ion" delay={1.3} />
              <Chip className="-left-4 bottom-[6%]" label="Readiness" value="88" tone="ion" delay={1.5} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* instrument footer rail */}
      <motion.div style={{ opacity }} className="container-x relative z-10 pb-8">
        <div className="rule mb-6" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-end gap-x-12 gap-y-5">
            {[
              ['4', 'Fused sensors'],
              ['Real-time', 'Signal processing'],
              ['On-muscle', 'Sensor placement'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="num text-[22px] text-chalk">{n}</div>
                <div className="label mt-1.5">{l}</div>
              </div>
            ))}
          </div>
          <div className="hidden items-end gap-4 md:flex">
            <div>
              <div className="label mb-2">Session intensity</div>
              <IntensityStrip />
            </div>
            <div className="pb-0.5">
              <span className="num text-[22px] text-pulse">92</span>
              <span className="label ml-1.5">%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function Chip({
  className = '',
  label,
  value,
  tone = 'ion',
  delay = 0,
}: {
  className?: string
  label: string
  value: string
  tone?: 'pulse' | 'ion'
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-20 hidden items-center gap-3 border border-chalk/10 bg-carbon-800/85 px-4 py-2.5 backdrop-blur-md sm:flex ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'pulse' ? 'bg-pulse' : 'bg-ion'} animate-pulse-glow`} />
      <div className="flex flex-col leading-none">
        <span className="label text-[8px]">{label}</span>
        <span className={`mt-1.5 num text-[15px] ${tone === 'pulse' ? 'text-pulse' : 'text-chalk'}`}>
          {value}
        </span>
      </div>
    </motion.div>
  )
}
