import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'

const SPORTS = [
  { name: 'Basketball', demand: 'Explosive, repeated', d: 'Repeated high-intensity efforts with short recovery. Fourth-quarter load is where output quietly drops.' },
  { name: 'Soccer', demand: 'Long duration', d: 'Ninety minutes of repeated sprinting. Fatigue accumulates well before it is felt.' },
  { name: 'Football', demand: 'Explosive output', d: 'Short maximal efforts under heat and equipment load across long sessions.' },
  { name: 'Track & Field', demand: 'Peak intensity', d: 'Every rep near the limit. Knowing whether you hit target intensity matters more than volume.' },
  { name: 'Endurance', demand: 'Sustained load', d: 'Hours of continuous physiological load, where small drifts compound into large ones.' },
]

export default function Sports() {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <section className="relative border-t border-chalk/[0.07] bg-carbon py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          index="/ 06"
          label="Across sport"
          title="Different demands. Same physiology."
          body="Wherever athletes work near their limit, the same signals are there to be read."
        />

        <div className="mt-14 border-t border-chalk/[0.09]">
          {SPORTS.map((s, i) => {
            const on = hover === i
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`group relative grid grid-cols-1 items-center gap-4 border-b border-chalk/[0.09] px-1 py-8 transition-colors duration-500 md:grid-cols-12 md:gap-8 ${
                  on ? 'bg-chalk/[0.025]' : ''
                }`}
              >
                <span className="font-mono text-[10px] text-pulse md:col-span-1">0{i + 1}</span>

                <h3
                  className={`display text-[clamp(1.8rem,5vw,3.4rem)] transition-colors duration-500 md:col-span-5 ${
                    on ? 'text-chalk' : 'text-chalk/70'
                  }`}
                >
                  {s.name}
                </h3>

                <span className="label md:col-span-2">{s.demand}</span>

                <p className="max-w-md text-[13.5px] leading-[1.7] text-chalk-dim md:col-span-4">{s.d}</p>

                {/* sweep accent on hover */}
                <span
                  className={`pointer-events-none absolute bottom-0 left-0 h-px bg-pulse transition-all duration-700 ${
                    on ? 'w-full' : 'w-0'
                  }`}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
