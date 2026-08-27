import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader.jsx'
import { useCountUp } from '../../hooks/useCountUp.js'

/* ---- live biometric graph ---- */
function LiveGraph() {
  const W = 640
  const H = 200
  const POINTS = 60
  const [series, setSeries] = useState(() =>
    Array.from({ length: POINTS }, (_, i) => 0.5 + 0.18 * Math.sin(i / 4)),
  )
  const running = useRef(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let t = POINTS
    const id = setInterval(() => {
      if (!running.current) return
      t += 1
      setSeries((prev) => {
        const next = prev.slice(1)
        const base = 0.5 + 0.16 * Math.sin(t / 4) + 0.08 * Math.sin(t / 1.6)
        const noise = (Math.random() - 0.5) * 0.12
        next.push(Math.max(0.08, Math.min(0.92, base + noise)))
        return next
      })
    }, 90)
    return () => clearInterval(id)
  }, [])

  const toXY = (v, i) => [(i / (POINTS - 1)) * W, H - v * H]
  const path = series
    .map((v, i) => {
      const [x, y] = toXY(v, i)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`
  const lastV = series[series.length - 1]
  const [lx, ly] = toXY(lastV, POINTS - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="graphFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#31E7E0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#31E7E0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="graphLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#31E7E0" />
          <stop offset="0.8" stopColor="#31E7E0" />
          <stop offset="1" stopColor="#FF421D" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#graphFill)" />
      <path d={path} fill="none" stroke="url(#graphLine)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="4" fill="#FF421D" />
      <circle cx={lx} cy={ly} r="4" fill="none" stroke="#FF421D" strokeOpacity="0.4" strokeWidth="6">
        <animate attributeName="r" values="4;12;4" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Metric({ label, value, suffix = '', decimals = 0, accent = 'ion' }) {
  const [ref, v] = useCountUp(value, { decimals, duration: 1600 })
  const color = accent === 'pulse' ? 'text-pulse' : accent === 'chalk' ? 'text-chalk' : 'text-ion'
  return (
    <div ref={ref} className="panel flex flex-col justify-between p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">{label}</span>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={`font-display text-3xl tracking-tight ${color}`}>
          {decimals ? v.toFixed(decimals) : Math.round(v)}
        </span>
        <span className="font-display text-sm text-slate-light">{suffix}</span>
      </div>
    </div>
  )
}

function Gauge({ value, label }) {
  const [ref, v] = useCountUp(value, { duration: 1600 })
  return (
    <div ref={ref} className="panel flex flex-col justify-between p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">{label}</span>
      <div className="mt-4">
        <span className="font-display text-3xl tracking-tight text-chalk">{Math.round(v)}%</span>
        <div className="mt-3 h-1.5 w-full overflow-hidden bg-carbon-600">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-ion"
          />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <section id="performance" className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="container-x relative">
        <SectionHeader
          index="/ 04"
          eyebrow="Real-Time UI"
          title="Mission control for the body."
          kicker="A live readout of what's happening beneath the surface — engineered to be understood in a glance, mid-effort."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 overflow-hidden border border-chalk/[0.08] bg-carbon-800"
        >
          {/* window bar */}
          <div className="flex items-center justify-between border-b border-chalk/[0.07] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-pulse animate-pulse-glow" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                STRYVE · Live Session
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
              82 min · Second Half
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-3">
            {/* Cramp risk + graph */}
            <div className="lg:col-span-2">
              <div className="panel flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                    Cramp Risk · Live Signal
                  </span>
                  <RiskBadge level="Moderate" />
                </div>
                <div className="mt-4 h-[200px] w-full">
                  <LiveGraph />
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
                  <span>Left Quad · EMG</span>
                  <span className="text-ion">● streaming</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Gauge value={72} label="Muscle Fatigue" />
                <Gauge value={84} label="Hydration" />
              </div>
            </div>

            {/* Side stack */}
            <div className="flex flex-col gap-4">
              <Metric label="Readiness" value={91} accent="chalk" />
              <Metric label="Activity" value={12.4} suffix="km" decimals={1} accent="ion" />
              <div className="panel flex flex-1 flex-col justify-between p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                  Recommendation
                </span>
                <p className="mt-3 font-display text-sm font-semibold leading-snug text-chalk">
                  Hydrate now.
                  <span className="text-slate-light"> Left quad fatigue trending up — act within 6 min.</span>
                </p>
                <div className="mt-4 flex items-center gap-2 border border-pulse/30 bg-pulse/10 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pulse animate-pulse-glow" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-pulse">
                    Early warning active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function RiskBadge({ level }) {
  const map = {
    Low: 'text-ion border-ion/40 bg-ion/10',
    Moderate: 'text-pulse-soft border-pulse/40 bg-pulse/10',
    High: 'text-pulse border-pulse/60 bg-pulse/15',
  }
  return (
    <span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${map[level]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-glow" />
      {level}
    </span>
  )
}
