import { motion } from 'framer-motion'
import SectionHead from '../ui/SectionHead'
import Reveal, { Stagger, StaggerItem } from '../ui/Reveal'

const FLOW = [
  { n: '01', t: 'Signal change', d: 'Activation, movement and skin response begin to drift from your baseline.' },
  { n: '02', t: 'Pattern detection', d: 'The system looks across streams for combinations, not single outliers.' },
  { n: '03', t: 'Risk increase', d: 'Cramp risk moves from low toward elevated as the pattern holds.' },
  { n: '04', t: 'Athlete alert', d: 'You get a quiet, early prompt — with time to adjust rather than react.' },
]

/** Risk ladder: low → elevated → high, deliberately calm rather than alarming. */
function RiskLadder() {
  const steps = [
    { label: 'Low', tone: 'ion', w: 26 },
    { label: 'Elevated', tone: 'pulse', w: 62 },
    { label: 'High', tone: 'pulse', w: 100 },
  ] as const
  return (
    <div className="flex flex-col gap-5">
      {steps.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-5"
        >
          <span className={`w-[72px] font-mono text-[10px] uppercase tracking-[0.18em] ${i === 0 ? 'text-ion' : 'text-pulse'}`}>
            {s.label}
          </span>
          <span className="h-[2px] flex-1 bg-carbon-600">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: `${s.w}%` }}
              className={`block h-full origin-left ${i === 0 ? 'bg-ion' : 'bg-pulse'}`}
            />
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default function CrampFlagship() {
  return (
    <section id="cramp" className="relative overflow-hidden border-t border-chalk/[0.07] bg-carbon-950 py-24 md:py-32">
      <div className="pointer-events-none absolute right-[6%] top-1/3 h-[460px] w-[460px] rounded-full bg-pulse/[0.1] blur-[150px]" />
      <div className="container-x relative">
        <SectionHead
          index="/ 02"
          label="Flagship capability"
          title={
            <>
              And then there's the signal <br />
              <span className="text-pulse">you don't want to miss.</span>
            </>
          }
          body="A cramp doesn't start when you feel it. The physiological changes that precede it build over time — and they are measurable. This is the capability that makes STRYVE different."
        />

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="label">Cramp risk — live</span>
            </Reveal>
            <Reveal delay={0.08} className="mt-7">
              <RiskLadder />
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-10 max-w-md border-l border-chalk/12 pl-5 text-[14px] leading-[1.8] text-slate-light">
                STRYVE identifies patterns <span className="text-chalk">associated with</span> rising
                cramp risk. It is a performance tool, not a medical device, and it does not diagnose
                or guarantee outcomes — it gives you earlier information than you would otherwise
                have.
              </p>
            </Reveal>
          </div>

          <div>
            <Stagger className="flex flex-col">
              {FLOW.map((f, i) => (
                <StaggerItem key={f.n}>
                  <div className="group relative flex gap-6 border-t border-chalk/[0.08] py-6 last:border-b">
                    <span className="font-mono text-[10px] text-pulse">{f.n}</span>
                    <div className="flex-1">
                      <h3 className="font-display text-[17px] uppercase tracking-tight text-chalk">{f.t}</h3>
                      <p className="mt-2 max-w-sm text-[14px] leading-[1.7] text-chalk-dim">{f.d}</p>
                    </div>
                    {i < FLOW.length - 1 && (
                      <span className="absolute -bottom-2 left-[3px] text-pulse/50" aria-hidden>
                        ↓
                      </span>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>

        {/* the critical re-framing: zoom back out */}
        <Reveal delay={0.1}>
          <div className="mt-20 border border-chalk/[0.09] bg-carbon-800 p-8 md:p-12">
            <span className="label">The bigger picture</span>
            <p className="editorial mt-5 max-w-4xl text-[clamp(1.3rem,2.8vw,2.2rem)] text-chalk">
              Cramp detection is the flagship. It is not the whole system.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
              {['Intensity', 'Fatigue', 'Movement', 'Muscle activity', 'Physiology', 'Cramp risk'].map(
                (t) => (
                  <span
                    key={t}
                    className={`border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      t === 'Cramp risk'
                        ? 'border-pulse/50 bg-pulse/10 text-pulse'
                        : 'border-chalk/12 text-chalk-dim'
                    }`}
                  >
                    {t}
                  </span>
                ),
              )}
              <span className="font-mono text-[10px] text-slate">→</span>
              <span className="border border-ion/40 bg-ion/10 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ion">
                Performance intelligence
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
