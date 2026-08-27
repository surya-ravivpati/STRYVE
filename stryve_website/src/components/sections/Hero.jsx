import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Wearable from '../ui/Wearable.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

function SignalField() {
  // decorative animated biometric signal lines
  const lines = [
    { y: 120, delay: 0, color: '#31E7E0', opacity: 0.5 },
    { y: 210, delay: 0.6, color: '#FF4127', opacity: 0.6 },
    { y: 320, delay: 1.1, color: '#31E7E0', opacity: 0.35 },
  ]
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
      {lines.map((l, i) => (
        <motion.path
          key={i}
          d={`M-20 ${l.y} q 120 -60 240 0 t 240 0 t 240 0 t 240 0 t 240 0 t 240 0`}
          fill="none"
          stroke={l.color}
          strokeWidth="1.4"
          strokeOpacity={l.opacity}
          strokeDasharray="6 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yProduct = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, 70])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="top" ref={ref} className="relative grain min-h-[100svh] overflow-hidden pt-[68px]">
      {/* backdrop layers */}
      <div className="absolute inset-0 grid-lines opacity-70" />
      <div className="pointer-events-none absolute -right-[10%] top-[6%] h-[560px] w-[560px] rounded-full bg-pulse/10 blur-[130px]" />
      <div className="pointer-events-none absolute left-[-6%] bottom-[4%] h-[420px] w-[420px] rounded-full bg-ion/10 blur-[130px]" />
      <SignalField />

      <div className="container-x relative z-10 grid min-h-[calc(100svh-68px)] grid-cols-1 items-center gap-8 py-14 lg:grid-cols-12 lg:gap-6">
        {/* Copy */}
        <motion.div
          className="lg:col-span-7"
          style={{ y: yCopy, opacity }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-7 flex items-center gap-3">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-pulse" />
              Predict. Prevent. Perform.
            </span>
          </motion.div>

          <h1 className="display-tight text-[clamp(2.9rem,8.5vw,7.2rem)]">
            <motion.span variants={item} className="block">
              Performance
            </motion.span>
            <motion.span variants={item} className="block text-slate-light">
              starts before
            </motion.span>
            <motion.span variants={item} className="block">
              the <span className="text-pulse">cramp.</span>
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-8 max-w-md text-[15px] leading-relaxed text-chalk-dim">
            STRYVE is an intelligent wearable built to help athletes read muscle fatigue and catch the
            signals that lead to cramps — before they cost you the moment.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#join" className="btn-primary">
              Get STRYVE <span aria-hidden>→</span>
            </a>
            <a href="#technology" className="btn-ghost">
              Explore the Technology <span aria-hidden>↓</span>
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              ['5', 'Fused sensors'],
              ['<1s', 'Signal latency'],
              ['24/7', 'Muscle readout'],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col">
                <span className="font-display text-2xl font-extrabold tracking-tight text-chalk">{n}</span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Product */}
        <motion.div
          className="relative flex items-center justify-center lg:col-span-5"
          style={{ y: yProduct }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full max-w-[440px]"
          >
            <Wearable className="w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]" />
          </motion.div>

          {/* floating readout chips */}
          <FloatingChip className="left-2 top-[16%]" label="MUSCLE FATIGUE" value="72%" color="ion" delay={0.9} />
          <FloatingChip className="right-0 top-[42%]" label="READINESS" value="91" color="pulse" delay={1.15} />
          <FloatingChip className="left-4 bottom-[12%]" label="HYDRATION" value="84%" color="ion" delay={1.4} />
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-slate to-transparent" />
      </motion.div>
    </section>
  )
}

function FloatingChip({ className = '', label, value, color = 'ion', delay = 0 }) {
  const dot = color === 'pulse' ? 'bg-pulse' : 'bg-ion'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-20 hidden items-center gap-2.5 border border-white/10 bg-carbon-800/80 px-3.5 py-2.5 backdrop-blur-md sm:flex ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot} animate-pulse-glow`} />
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate">{label}</span>
        <span className="mt-1 font-display text-sm font-bold text-chalk">{value}</span>
      </div>
    </motion.div>
  )
}
