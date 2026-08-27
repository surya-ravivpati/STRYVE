import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader.jsx'

const CARDS = [
  {
    key: 'emg',
    label: 'Muscle Activity',
    tag: 'EMG',
    desc: 'Monitor muscle activity through electromyography-based sensing to see load and fatigue as it happens.',
    icon: (
      <path d="M3 12h4l2-7 3 14 2-9 2 4h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    key: 'imu',
    label: 'Movement',
    tag: 'IMU',
    desc: 'Track movement and motion patterns with inertial sensing — every stride, cut, jump and landing.',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'eda',
    label: 'Skin Response',
    tag: 'EDA',
    desc: 'Capture physiological signals tied to exertion and stress through electrodermal response.',
    icon: (
      <path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
  },
  {
    key: 'temp',
    label: 'Temperature',
    tag: 'THERM',
    desc: 'Monitor changes in skin temperature to contextualize effort and environmental load.',
    icon: (
      <>
        <path d="M10 4a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="17" r="1.6" fill="currentColor" />
      </>
    ),
  },
  {
    key: 'ai',
    label: 'STRYVE AI',
    tag: 'FUSION',
    desc: 'Fuse every signal to identify the patterns associated with cramp risk — and only surface what matters.',
    icon: (
      <>
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="5" cy="6" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="19" cy="6" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="5" cy="18" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="19" cy="18" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.4 6.8 10.5 11M17.6 6.8 13.5 11M6.4 17.2 10.5 13M17.6 17.2 13.5 13" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
  },
]

export default function Technology() {
  const [active, setActive] = useState('emg')

  return (
    <section id="technology" className="relative border-t border-chalk/[0.07] bg-carbon py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            index="/ 03"
            eyebrow="The Technology"
            title="Built around the athlete."
            kicker="A fused sensor system reads your body from five angles at once — sophisticated underneath, effortless on the skin."
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {CARDS.map((c, i) => {
            const isActive = active === c.key
            return (
              <motion.button
                key={c.key}
                type="button"
                onMouseEnter={() => setActive(c.key)}
                onFocus={() => setActive(c.key)}
                onClick={() => setActive(c.key)}
                aria-expanded={isActive}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex min-h-[240px] flex-col justify-between overflow-hidden border p-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
                  isActive
                    ? 'border-pulse/40 bg-carbon-700'
                    : 'border-chalk/[0.08] bg-carbon-800 hover:border-chalk/25'
                }`}
              >
                {/* glow */}
                <span
                  className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ background: 'radial-gradient(circle, rgba(255,66,29,0.4), transparent 70%)' }}
                />

                <div className="relative flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center border transition-colors ${
                      isActive ? 'border-pulse/50 text-pulse' : 'border-chalk/10 text-ion'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      {c.icon}
                    </svg>
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate">{c.tag}</span>
                </div>

                <div className="relative">
                  <h3 className="font-display text-lg uppercase leading-tight tracking-tight text-chalk">
                    {c.label}
                  </h3>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden text-xs leading-relaxed text-slate-light"
                      >
                        {c.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span
                    className={`mt-3 block h-px origin-left bg-pulse transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
