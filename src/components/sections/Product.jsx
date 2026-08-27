import { motion } from 'framer-motion'
import Wearable from '../ui/Wearable.jsx'
import Reveal from '../ui/Reveal.jsx'

const SPECS = [
  { n: '01', label: 'Sensor array', desc: 'Five fused signals on one contact strip.' },
  { n: '02', label: 'Athletic fit', desc: 'Sweat-wicking strap that stays put.' },
  { n: '03', label: 'Real-time feedback', desc: 'On-device readout, sub-second latency.' },
  { n: '04', label: 'Wireless connectivity', desc: 'Streams live to the STRYVE app.' },
  { n: '05', label: 'Rechargeable battery', desc: 'Multi-day charge, fast top-up.' },
]

export default function Product() {
  return (
    <section id="product" className="relative overflow-hidden border-t border-white/[0.06] bg-carbon-900 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="container-x relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Product visual */}
        <div className="relative order-2 lg:order-1">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse/10 blur-[120px]" />
          <motion.div
            initial={{ opacity: 0, rotate: -4, scale: 0.94 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-[420px]"
          >
            <Wearable className="w-full" />
          </motion.div>

          {/* spec chips scattered */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['EMG', 'IMU', 'EDA', 'THERM', 'AI'].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="border border-white/10 bg-carbon-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ion"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Spec list */}
        <div className="order-1 lg:order-2">
          <Reveal variant="up">
            <span className="eyebrow">
              <span className="h-px w-8 bg-pulse" /> The Product
            </span>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <h2 className="display-tight mt-5 text-[clamp(2rem,5vw,3.6rem)]">
              Engineered to <br />
              <span className="text-slate-light">disappear on you.</span>
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {SPECS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group flex items-center gap-5 py-4"
              >
                <span className="font-mono text-xs text-pulse">{s.n}</span>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-chalk">
                    {s.label}
                  </h3>
                  <p className="text-sm text-slate-light">{s.desc}</p>
                </div>
                <span className="text-slate transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pulse">
                  →
                </span>
              </motion.div>
            ))}
          </div>

          <Reveal variant="up" delay={0.1}>
            <a href="#join" className="btn-primary mt-10">
              Meet STRYVE <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
