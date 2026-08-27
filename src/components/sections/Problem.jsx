import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader.jsx'
import Reveal from '../ui/Reveal.jsx'

const STAGES = [
  { label: 'Movement', desc: 'Every stride, cut and jump.' },
  { label: 'Muscle Activity', desc: 'Fibers fire and load builds.' },
  { label: 'Fatigue', desc: 'Output drops, effort climbs.' },
  { label: 'Risk', desc: 'Instability signals emerge.' },
  { label: 'Cramp', desc: 'The moment slips away.' },
]

export default function Problem() {
  return (
    <section id="problem" className="relative border-t border-white/[0.06] bg-carbon py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="/ 01"
          eyebrow="The Problem"
          title={
            <>
              Your body signals it. <br />
              <span className="text-slate-light">STRYVE listens.</span>
            </>
          }
          kicker="Cramps don't appear out of nowhere. Long before it locks up, the body produces measurable signals of fatigue, exertion and physiological stress. Most athletes only feel them when it's already too late."
        />

        {/* Sequence */}
        <div className="mt-16 md:mt-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
            className="relative grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-5 md:gap-x-0"
          >
            {/* connecting line (desktop) */}
            <div className="pointer-events-none absolute left-0 right-0 top-[26px] hidden md:block">
              <svg className="h-2 w-full" preserveAspectRatio="none" aria-hidden>
                <motion.line
                  x1="8%"
                  y1="4"
                  x2="92%"
                  y2="4"
                  stroke="#31E7E0"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
              </svg>
            </div>

            {STAGES.map((s, i) => {
              const isLast = i === STAGES.length - 1
              return (
                <motion.div
                  key={s.label}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="relative flex flex-col items-center text-center md:px-3"
                >
                  <div
                    className={`relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border ${
                      isLast ? 'border-pulse/60 bg-pulse/10' : 'border-white/15 bg-carbon-800'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${isLast ? 'bg-pulse animate-pulse-glow' : 'bg-ion'}`}
                    />
                    <span className="absolute -top-3 -right-2 font-mono text-[9px] text-slate">
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    className={`mt-5 font-display text-sm font-bold uppercase tracking-wide ${
                      isLast ? 'text-pulse' : 'text-chalk'
                    }`}
                  >
                    {s.label}
                  </h3>
                  <p className="mt-2 max-w-[150px] text-xs leading-relaxed text-slate-light">{s.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <Reveal variant="up" className="mt-16 border-t border-white/[0.06] pt-8">
          <p className="max-w-2xl font-display text-xl font-semibold leading-snug text-chalk-dim md:text-2xl">
            STRYVE reads the chain in real time — turning invisible physiology into an early,
            <span className="text-chalk"> actionable warning.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
