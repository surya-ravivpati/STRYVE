import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'

const CHAIN = [
  { t: 'STRYVE wearable', d: 'Reads the muscle directly, session after session.', tone: 'pulse' },
  { t: 'Mobile app', d: 'Live session view, history, and your personal baseline.', tone: 'chalk' },
  { t: 'Performance engine', d: 'Signal processing and models turning streams into features.', tone: 'ion' },
  { t: 'Athlete insight', d: 'Intensity, fatigue, readiness and risk — in plain language.', tone: 'chalk' },
  { t: 'Coach dashboard', d: 'Squad-level view of load and readiness across a roster.', tone: 'chalk' },
]

export default function Ecosystem() {
  return (
    <section className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          index="/ 07"
          label="The system"
          title="Hardware is only half of it."
          body="The wearable collects. The software interprets. The athlete gets something useful. Each layer is only worth as much as the one after it."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {CHAIN.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex min-h-[210px] flex-col justify-between border border-chalk/[0.09] bg-carbon-800 p-6 transition-colors duration-400 hover:border-chalk/25"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-pulse">0{i + 1}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    c.tone === 'pulse' ? 'bg-pulse' : c.tone === 'ion' ? 'bg-ion' : 'bg-slate'
                  }`}
                />
              </div>
              <div>
                <h3 className="font-display text-[15px] uppercase leading-tight tracking-tight text-chalk">
                  {c.t}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-chalk-dim">{c.d}</p>
              </div>
              {i < CHAIN.length - 1 && (
                <span
                  className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 font-mono text-[13px] text-slate lg:block"
                  aria-hidden
                >
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
