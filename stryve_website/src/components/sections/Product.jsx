import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../ui/Reveal.jsx'
import Mark from '../brand/Mark.jsx'

const WearableModel = lazy(() => import('../three/WearableModel.jsx'))

/* Labels map to real components in the STRYVE assembly */
const SPECS = [
  { n: '01', label: 'Sensor array', desc: 'sEMG, GSR, IMU and thermal on one contact face.' },
  { n: '02', label: 'Athletic fit', desc: 'Elastic strap, alloy buckle, locked-down keeper.' },
  { n: '03', label: 'Real-time feedback', desc: 'Status LED and haptic motor, sub-second latency.' },
  { n: '04', label: 'Wireless connectivity', desc: 'Streams live to the STRYVE app.' },
  { n: '05', label: 'Rechargeable battery', desc: 'Multi-day charge, fast top-up.' },
]

export default function Product() {
  const [active, setActive] = useState(null)

  return (
    <section id="product" className="relative overflow-hidden border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="container-x relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Live 3D product */}
        <div className="relative order-2 lg:order-1">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse/[0.12] blur-[130px]" />
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <Suspense fallback={<div className="h-full w-full" />}>
              <WearableModel className="h-full w-full" spin={0.3} tilt={false} dpr={[1, 1.5]} />
            </Suspense>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {['sEMG', 'IMU', 'GSR', 'THERM', 'HAPTIC'].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="border border-chalk/10 bg-carbon-800 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ion"
              >
                {t}
              </motion.span>
            ))}
          </div>
          <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-[0.24em] text-slate">
            Drag-free live render · rotate in real time
          </p>
        </div>

        {/* Spec list */}
        <div className="order-1 lg:order-2">
          <Reveal variant="up">
            <span className="eyebrow"><Mark className="h-3.5 w-auto text-pulse" /> The Product</span>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <h2 className="display-tight mt-6 text-[clamp(2.1rem,5vw,3.7rem)]">
              Engineered to <br />
              <span className="text-outline">disappear on you.</span>
            </h2>
          </Reveal>

          <div className="mt-10 border-y border-chalk/[0.08]">
            {SPECS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onMouseEnter={() => setActive(s.n)}
                onMouseLeave={() => setActive(null)}
                className={`group flex items-center gap-5 border-b border-chalk/[0.06] py-4 transition-colors last:border-b-0 ${
                  active === s.n ? 'bg-chalk/[0.03]' : ''
                }`}
              >
                <span className="font-mono text-xs text-pulse">{s.n}</span>
                <div className="flex-1">
                  <h3 className="font-display text-base uppercase tracking-tight text-chalk">{s.label}</h3>
                  <p className="mt-0.5 text-sm text-slate-light">{s.desc}</p>
                </div>
                <span className="text-slate transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pulse">→</span>
              </motion.div>
            ))}
          </div>

          <Reveal variant="up" delay={0.1}>
            <a href="#join" className="btn-primary mt-10">Meet STRYVE <span aria-hidden>→</span></a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
