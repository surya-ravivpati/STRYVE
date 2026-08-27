import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Reveal from '../ui/Reveal.jsx'

/* stylized athlete-in-motion silhouette with tracking sensor overlays */
function AthleteFigure() {
  return (
    <svg viewBox="0 0 480 480" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="figGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#20242E" />
          <stop offset="1" stopColor="#0C0F15" />
        </linearGradient>
      </defs>
      {/* motion trail */}
      {[0.14, 0.28].map((op, i) => (
        <g key={i} opacity={op} transform={`translate(${-38 - i * 34} ${6 + i * 4})`}>
          <path d="M250 96 c14 0 24 10 24 24 c0 14 -10 24 -24 24 c-14 0 -24 -10 -24 -24 c0 -14 10 -24 24 -24z M244 150 l40 10 l28 60 l-16 70 l-10 84 l-26 0 l6 -84 l-20 -50 l-40 30 l-30 40 l-20 -14 l34 -54 l40 -46 l-6 -60z" fill="#20242E" />
        </g>
      ))}
      {/* body */}
      <g>
        <path
          d="M250 96 c14 0 24 10 24 24 c0 14 -10 24 -24 24 c-14 0 -24 -10 -24 -24 c0 -14 10 -24 24 -24z M244 150 l40 10 l28 60 l-16 70 l-10 84 l-26 0 l6 -84 l-20 -50 l-40 30 l-30 40 l-20 -14 l34 -54 l40 -46 l-6 -60z"
          fill="url(#figGrad)"
          stroke="#2E3542"
          strokeWidth="1.5"
        />
      </g>
      {/* sensor nodes on muscle groups */}
      {[
        [286, 218, '#FF4127'],
        [262, 300, '#31E7E0'],
        [214, 240, '#31E7E0'],
        [300, 150, '#31E7E0'],
      ].map(([cx, cy, color], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill={color} />
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={color} strokeWidth="8" strokeOpacity="0.25">
            <animate attributeName="r" values="5;18;5" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* data connector following the body */}
      <motion.path
        d="M300 150 L286 218 L214 240 L262 300"
        fill="none"
        stroke="#31E7E0"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function BuiltForMoment() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yFig = useTransform(scrollYProgress, [0, 1], [60, -60])
  const xData = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/[0.06] bg-carbon py-24 md:py-36"
    >
      <div className="pointer-events-none absolute right-[8%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-pulse/10 blur-[140px]" />
      <div className="container-x relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal variant="up">
            <span className="eyebrow">
              <span className="h-px w-8 bg-pulse" /> Built for the moment
            </span>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <h2 className="display-tight mt-6 text-[clamp(2.4rem,7vw,5.5rem)]">
              Don't wait <br />
              for the <span className="text-pulse">cramp.</span>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.16}>
            <p className="mt-8 max-w-md font-display text-xl font-semibold leading-snug text-chalk-dim md:text-2xl">
              The goal isn't to tell you what happened.
              <span className="text-chalk"> It's to help you act before it does.</span>
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ['6 min', 'Median early-warning window'],
                ['Real-time', 'Movement-locked tracking'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-extrabold tracking-tight text-chalk">{n}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div style={{ y: yFig }} className="relative mx-auto w-full max-w-[440px]">
          <div className="relative aspect-square">
            <AthleteFigure />
            {/* overlay readout that drifts with scroll */}
            <motion.div
              style={{ x: xData }}
              className="absolute right-0 top-6 border border-white/10 bg-carbon-800/80 px-3 py-2 backdrop-blur-md"
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate">Quad Load</div>
              <div className="mt-1 font-display text-sm font-bold text-pulse">↑ Rising</div>
            </motion.div>
            <motion.div
              style={{ x: xData }}
              className="absolute bottom-10 left-0 border border-white/10 bg-carbon-800/80 px-3 py-2 backdrop-blur-md"
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate">Cadence</div>
              <div className="mt-1 font-display text-sm font-bold text-ion">178 spm</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
