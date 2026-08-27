import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'
import { useCountUp } from '../../hooks/useCountUp'

/** Continuously streaming muscle-activation trace. */
function LiveTrace() {
  const W = 680
  const H = 190
  const N = 70
  const [series, setSeries] = useState<number[]>(() =>
    Array.from({ length: N }, (_, i) => 0.5 + 0.16 * Math.sin(i / 4)),
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t = N
    const id = setInterval(() => {
      t += 1
      setSeries((prev) => {
        const next = prev.slice(1)
        const base = 0.52 + 0.15 * Math.sin(t / 4.5) + 0.07 * Math.sin(t / 1.7)
        next.push(Math.max(0.1, Math.min(0.92, base + (Math.random() - 0.5) * 0.11)))
        return next
      })
    }, 95)
    return () => clearInterval(id)
  }, [])

  const pt = (v: number, i: number): [number, number] => [(i / (N - 1)) * W, H - v * H]
  const d = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${pt(v, i)[0].toFixed(1)},${pt(v, i)[1].toFixed(1)}`).join(' ')
  const [lx, ly] = pt(series[series.length - 1], N - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="traceFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3BE0CF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3BE0CF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="traceLine" x1="0" x2="1">
          <stop offset="0" stopColor="#3BE0CF" />
          <stop offset="0.82" stopColor="#3BE0CF" />
          <stop offset="1" stopColor="#FF421D" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="#F2EBE0" strokeOpacity="0.05" />
      ))}
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#traceFill)" />
      <path d={d} fill="none" stroke="url(#traceLine)" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="#FF421D" />
      <circle cx={lx} cy={ly} r="3" fill="none" stroke="#FF421D" strokeOpacity="0.4" strokeWidth="5">
        <animate attributeName="r" values="3;11;3" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="1.7s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Tile({
  label,
  value,
  unit,
  tone = 'chalk',
  sub,
}: {
  label: string
  value: number | string
  unit?: string
  tone?: 'chalk' | 'pulse' | 'ion'
  sub?: string
}) {
  const numeric = typeof value === 'number'
  const [ref, v] = useCountUp(numeric ? (value as number) : 0)
  const colour = tone === 'pulse' ? 'text-pulse' : tone === 'ion' ? 'text-ion' : 'text-chalk'
  return (
    <div ref={ref} className="flex flex-col justify-between gap-6 bg-carbon-800 p-5">
      <span className="label">{label}</span>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className={`num text-[34px] ${colour}`}>{numeric ? Math.round(v) : value}</span>
          {unit && <span className="label text-[9px]">{unit}</span>}
        </div>
        {sub && <span className="mt-1.5 block text-[11px] text-slate-light">{sub}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const clock = useRef<HTMLSpanElement>(null)
  const [secs, setSecs] = useState(48 * 60 + 21)
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <section className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          index="/ 04"
          label="The dashboard"
          title="Mission control for the body."
          body="Everything STRYVE reads, resolved into a view an athlete or coach can act on in a glance — mid-session, not after it."
        />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 overflow-hidden border border-chalk/[0.09] bg-chalk/[0.07]"
        >
          {/* status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-carbon-800 px-5 py-3.5">
            <span className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-pulse" />
              <span className="label">STRYVE Performance — live session</span>
            </span>
            <span className="label">
              Session <span ref={clock} className="text-chalk">{mm}:{ss}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
            <Tile label="STRYVE Performance" value={87} tone="chalk" sub="Composite score" />
            <Tile label="Current intensity" value={92} unit="% of target" tone="pulse" sub="Optimal" />
            <Tile label="Muscle load" value="High" tone="chalk" sub="Left quad · sEMG" />
            <Tile label="Cramp risk" value="Low" tone="ion" sub="Stable this half" />
          </div>

          <div className="grid grid-cols-1 gap-px lg:grid-cols-[1fr_320px]">
            <div className="bg-carbon-800 p-5">
              <div className="flex items-center justify-between">
                <span className="label">Muscle activation — live</span>
                <span className="label text-ion">● streaming</span>
              </div>
              <div className="mt-4 h-[190px] w-full">
                <LiveTrace />
              </div>
            </div>

            <div className="flex flex-col gap-px">
              <div className="flex-1 bg-carbon-800 p-5">
                <span className="label">Fatigue accumulation</span>
                <div className="mt-4 flex flex-col gap-3">
                  {[
                    ['Left quad', 61, 'pulse'],
                    ['Right quad', 48, 'ion'],
                    ['Calf', 34, 'ion'],
                  ].map(([l, v, t]) => (
                    <div key={l as string} className="flex items-center gap-3">
                      <span className="w-[74px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-light">
                        {l}
                      </span>
                      <span className="h-[3px] flex-1 bg-carbon-600">
                        <motion.span
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ width: `${v}%` }}
                          className={`block h-full origin-left ${t === 'pulse' ? 'bg-pulse' : 'bg-ion'}`}
                        />
                      </span>
                      <span className="num w-8 text-right text-[12px] text-chalk-dim">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-carbon-800 p-5">
                <span className="label">Readout</span>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-chalk">
                  Holding target intensity.
                  <span className="text-slate-light"> Left quad fatigue trending up — risk still low.</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
