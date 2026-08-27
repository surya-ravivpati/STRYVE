import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'
import Reveal from '../ui/Reveal'

const PIPELINE = [
  { t: 'Raw signals', d: 'sEMG, IMU, GSR and thermal, sampled continuously.' },
  { t: 'Signal processing', d: 'Filtering, artefact rejection, normalisation to your baseline.' },
  { t: 'Feature extraction', d: 'Activation, frequency drift, movement load, response curves.' },
  { t: 'Multimodal fusion', d: 'Streams combined so patterns emerge that no single sensor shows.' },
  { t: 'Machine learning', d: 'Time-series models trained to recognise meaningful change.' },
  { t: 'Performance insight', d: 'Intensity, fatigue, readiness and risk — in athlete language.' },
]

const HARDWARE = [
  ['Sensing', 'Multi-sensor physiological monitoring'],
  ['Placement', 'Worn on the working muscle group'],
  ['Feedback', 'Haptic prompt and status indicator'],
  ['Connectivity', 'Bluetooth Low Energy to the STRYVE app'],
  ['Power', 'Rechargeable battery'],
  ['Processing', 'Real-time on-device signal handling'],
]

export default function Science() {
  return (
    <section id="science" className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          index="/ 05"
          label="Science & technology"
          title="From raw signal to real insight."
          body="STRYVE's value is not in collecting data. It is in the chain that turns messy physiological signal into something specific enough to act on."
        />

        {/* pipeline */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-chalk/[0.09] bg-chalk/[0.07] md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-carbon-800 p-7 transition-colors duration-300 hover:bg-carbon-700"
            >
              <span className="font-mono text-[10px] text-pulse">0{i + 1}</span>
              <h3 className="mt-4 font-display text-[16px] uppercase tracking-tight text-chalk">{p.t}</h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.7] text-chalk-dim">{p.d}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-pulse transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-[13px] leading-[1.8] text-slate">
            STRYVE is a performance product, not a medical device. It is designed to surface patterns
            and trends in physiological signal — not to diagnose, treat, or guarantee outcomes.
          </p>
        </Reveal>

        {/* hardware */}
        <div id="technology" className="mt-24">
          <Reveal>
            <span className="label">The hardware</span>
          </Reveal>
          <Reveal delay={0.07}>
            <h3 className="editorial mt-5 max-w-2xl text-[clamp(1.6rem,3.6vw,2.6rem)]">
              Small enough to forget. Precise enough to trust.
            </h3>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 border-t border-chalk/[0.09] sm:grid-cols-2 lg:grid-cols-3">
            {HARDWARE.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="border-b border-chalk/[0.09] py-6 pr-8"
              >
                <div className="label">{k}</div>
                <div className="mt-2.5 text-[14.5px] leading-snug text-chalk">{v}</div>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            Detailed specifications published at launch.
          </p>
        </div>
      </div>
    </section>
  )
}
