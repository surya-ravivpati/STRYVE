import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'

const STEPS = [
  { n: '01', t: 'Sense', d: 'Four sensors read muscle activity, movement, skin conductivity and temperature from the working muscle.' },
  { n: '02', t: 'Analyze', d: 'Signals are filtered and turned into features — activation, drift, load, response.' },
  { n: '03', t: 'Predict', d: 'Models look across the combined streams for the patterns that matter.' },
  { n: '04', t: 'Act', d: 'You get a clear read on intensity, fatigue and risk while the session is still running.' },
]

/** The live training arc — a session from baseline to informed adjustment. */
const SESSION = [
  ['Before', 'Baseline established'],
  ['During', 'Intensity climbs'],
  ['Monitor', 'Signals shift'],
  ['Performance', 'Target intensity held'],
  ['Early warning', 'Risk pattern appears'],
  ['Response', 'Informed adjustment'],
  ['Result', 'Session continues'],
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-chalk/[0.07] bg-carbon py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-40" />
      <div className="container-x relative">
        <SectionHead
          index="/ 03"
          label="How it works"
          title="Sense. Analyze. Predict. Act."
          body="Four stages turn raw biometric noise into something you can use before the session is over."
        />

        <div className="relative mt-16">
          {/* flowing rail */}
          <div className="pointer-events-none absolute inset-x-0 top-[30px] hidden lg:block">
            <svg className="h-2 w-full" preserveAspectRatio="none" aria-hidden>
              <line x1="0" y1="4" x2="100%" y2="4" stroke="#20242A" strokeWidth="2" />
              <motion.line
                x1="0"
                y1="4"
                x2="100%"
                y2="4"
                stroke="url(#flow)"
                strokeWidth="2"
                strokeDasharray="8 16"
                initial={{ strokeDashoffset: 240 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
              />
              <defs>
                <linearGradient id="flow" x1="0" x2="1">
                  <stop offset="0" stopColor="#3BE0CF" />
                  <stop offset="1" stopColor="#FF421D" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.t}
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="group relative"
              >
                <div className="relative z-10 mb-6 flex h-[62px] w-[62px] items-center justify-center border border-chalk/12 bg-carbon-800 transition-colors duration-300 group-hover:border-pulse/50">
                  <span className="font-mono text-[13px] text-pulse">{s.n}</span>
                </div>
                <h3 className="display text-[26px] text-chalk">{s.t}</h3>
                <p className="mt-3 max-w-[250px] text-[14px] leading-[1.7] text-chalk-dim">{s.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* session arc */}
        <div className="mt-24">
          <span className="label">A session, end to end</span>
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-7 grid grid-cols-2 gap-px overflow-hidden border border-chalk/[0.09] bg-chalk/[0.07] sm:grid-cols-4 lg:grid-cols-7"
          >
            {SESSION.map(([k, v], i) => {
              const flagged = k === 'Early warning'
              return (
                <motion.li
                  key={k}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  className={`flex flex-col gap-2 p-5 ${flagged ? 'bg-pulse/[0.08]' : 'bg-carbon-800'}`}
                >
                  <span className={`font-mono text-[9px] ${flagged ? 'text-pulse' : 'text-slate'}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`font-display text-[13px] uppercase tracking-tight ${
                      flagged ? 'text-pulse' : 'text-chalk'
                    }`}
                  >
                    {k}
                  </span>
                  <span className="text-[12px] leading-snug text-slate-light">{v}</span>
                </motion.li>
              )
            })}
          </motion.ol>
          <p className="mt-7 editorial text-[clamp(1.2rem,2.4vw,1.8rem)] text-chalk-dim">
            Don't just train harder. <span className="text-chalk">Train smarter.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
