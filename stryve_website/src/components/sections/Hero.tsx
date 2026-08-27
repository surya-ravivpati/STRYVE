import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Mark from '../brand/Mark'

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

  return (
    <section id="top" ref={ref} className="grain relative flex min-h-[100svh] flex-col overflow-hidden pt-[68px]">
      <div className="absolute inset-0 grid-fine opacity-60" />
      <Mark className="pointer-events-none absolute -right-[14%] -top-[10%] h-[130%] w-auto text-chalk/[0.02]" />
      <div className="pointer-events-none absolute -left-[10%] top-1/4 h-[520px] w-[520px] rounded-full bg-pulse/[0.09] blur-[160px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-ion/[0.05] blur-[150px]" />

      <motion.div
        style={{ y, opacity }}
        className="container-x relative z-10 flex flex-1 flex-col justify-center py-14"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-9 flex items-center gap-3">
          <span className="label flex items-center gap-2.5 text-chalk-dim">
            <Mark className="h-3 w-auto text-pulse" />
            PowerThru — Athletics × Technology
          </span>
        </motion.div>

        <h1 className="display max-w-[16ch] text-[clamp(2.9rem,9vw,8.2rem)]">
          <motion.span variants={item} className="block">
            Know your
          </motion.span>
          <motion.span variants={item} className="block">
            performance.
          </motion.span>
        </h1>

        <motion.div variants={item} className="mt-10 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <p className="max-w-md text-[15.5px] leading-[1.75] text-chalk-dim">
            STRYVE is a performance monitor for athletes. It reads physiological and movement
            signals from the working muscle and turns them into a live picture of how hard you're
            working — and how your body is responding.
          </p>
          <p className="max-w-sm border-l border-pulse/40 pl-5 text-[14px] leading-[1.75] text-slate-light">
            And as your body approaches its limit, STRYVE identifies signals associated with rising
            cramp risk — early enough to do something about it.
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#product" className="btn-primary lift">
            Explore STRYVE <span aria-hidden>→</span>
          </a>
          <a href="#how" className="btn-ghost">
            How It Works <span aria-hidden>↓</span>
          </a>
        </motion.div>
      </motion.div>

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
