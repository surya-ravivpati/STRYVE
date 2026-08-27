import { motion } from 'framer-motion'
import Mark from '../brand/Mark'

export default function AthleticsXTech() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-chalk/[0.07] bg-carbon py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse/[0.07] blur-[160px]" />

      <div className="container-x relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="text-center"
        >
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7 } } }}
            className="mb-10 flex justify-center"
          >
            <Mark className="h-12 w-auto text-pulse" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: '108%' },
                show: { opacity: 1, y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="display text-[clamp(2.4rem,10vw,8rem)]"
            >
              Athletics
              <span className="mx-[0.12em] text-pulse">×</span>
              Technology
            </motion.h2>
          </div>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            className="mx-auto mt-12 max-w-2xl text-[16px] leading-[1.8] text-chalk-dim"
          >
            PowerThru builds technology that makes invisible physiology understandable to athletes.
            STRYVE is the first product — wearable sensing, signal processing and machine learning
            applied to a single question: what is actually happening inside the athlete right now?
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } }}
            className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-6 border-t border-chalk/[0.09] pt-10"
          >
            {[
              ['Predict', 'Understand what is happening — and what may happen next.'],
              ['Prevent', 'Intervene before performance is compromised.'],
              ['Perform', 'Train and compete with better information.'],
            ].map(([t, d]) => (
              <div key={t} className="max-w-[220px] text-left">
                <div className="font-display text-[15px] uppercase tracking-tight text-pulse">{t}</div>
                <p className="mt-2 text-[12.5px] leading-[1.65] text-slate-light">{d}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
