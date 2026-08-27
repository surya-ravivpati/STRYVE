import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Sense',
    desc: 'STRYVE collects physiological and movement signals through its wearable sensor array.',
  },
  {
    n: '02',
    title: 'Analyze',
    desc: 'On-device AI fuses the incoming streams and reads patterns across every signal.',
  },
  {
    n: '03',
    title: 'Predict',
    desc: 'The system identifies the signatures associated with rising cramp risk.',
  },
  {
    n: '04',
    title: 'Act',
    desc: 'You get a precise, early warning — with time to hydrate, adjust or recover.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="container-x relative">
        <SectionHeader
          index="/ 02"
          eyebrow="How It Works"
          title="From signal to strategy."
          kicker="Four stages turn raw biometric noise into a decision you can act on — in under a second."
        />

        {/* Pipeline */}
        <div className="relative mt-20">
          {/* flow rail */}
          <div className="pointer-events-none absolute left-0 right-0 top-[38px] hidden lg:block">
            <svg className="h-3 w-full" preserveAspectRatio="none" aria-hidden>
              <line x1="0" y1="6" x2="100%" y2="6" stroke="#1B212C" strokeWidth="2" />
              <motion.line
                x1="0"
                y1="6"
                x2="100%"
                y2="6"
                stroke="url(#flowgrad)"
                strokeWidth="2"
                strokeDasharray="10 14"
                initial={{ strokeDashoffset: 200 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <defs>
                <linearGradient id="flowgrad" x1="0" x2="1">
                  <stop offset="0" stopColor="#31E7E0" />
                  <stop offset="1" stopColor="#FF421D" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="group relative"
              >
                <div className="relative z-10 mb-6 flex h-[76px] w-[76px] items-center justify-center border border-chalk/10 bg-carbon-800 transition-colors duration-300 group-hover:border-pulse/50">
                  <span className="font-mono text-lg font-bold text-pulse">{s.n}</span>
                  <span className="absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(circle, rgba(255,66,29,0.35), transparent 70%)' }} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-tight text-chalk">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-slate-light">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
