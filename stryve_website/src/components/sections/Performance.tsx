import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHead from '../ui/SectionHead'

type Metric = {
  key: string
  label: string
  question: string
  body: string
  readout: string
  unit?: string
  tone: 'chalk' | 'pulse' | 'ion'
  bars: number[]
}

const METRICS: Metric[] = [
  {
    key: 'intensity',
    label: 'Intensity',
    question: 'How hard are you actually working?',
    body: 'Effort is easy to misjudge mid-session. STRYVE reads output at the muscle and shows whether you are actually hitting the intensity the session calls for.',
    readout: '92',
    unit: '% of target',
    tone: 'pulse',
    bars: [40, 55, 62, 71, 80, 88, 92, 90, 94, 91],
  },
  {
    key: 'muscle',
    label: 'Muscle activity',
    question: 'What is happening at the muscle level?',
    body: 'Surface EMG reads activation directly from the working muscle, rather than inferring effort from heart rate at the wrist.',
    readout: '74',
    unit: 'activation index',
    tone: 'ion',
    bars: [30, 44, 58, 66, 70, 74, 72, 76, 74, 73],
  },
  {
    key: 'fatigue',
    label: 'Fatigue',
    question: 'How is your body responding to workload?',
    body: 'As work accumulates, activation patterns shift. STRYVE tracks that drift to build a picture of accumulating fatigue across a session.',
    readout: '61',
    unit: 'accumulated load',
    tone: 'chalk',
    bars: [8, 15, 24, 31, 39, 46, 52, 57, 60, 61],
  },
  {
    key: 'readiness',
    label: 'Readiness',
    question: 'How prepared are you to perform?',
    body: 'Session-to-session, STRYVE builds a baseline of your normal response — so you can see when you are recovered and when you are not.',
    readout: '88',
    unit: 'readiness score',
    tone: 'ion',
    bars: [72, 78, 81, 74, 83, 86, 84, 87, 88, 88],
  },
  {
    key: 'cramp',
    label: 'Cramp risk',
    question: 'Are physiological patterns suggesting increased risk?',
    body: 'The flagship capability. STRYVE watches for the signal combinations associated with rising cramp risk, and surfaces them while there is still time to respond.',
    readout: 'Low',
    tone: 'pulse',
    bars: [10, 12, 14, 13, 18, 22, 27, 31, 36, 42],
  },
]

const toneText = { chalk: 'text-chalk', pulse: 'text-pulse', ion: 'text-ion' } as const
const toneBar = { chalk: 'bg-chalk/70', pulse: 'bg-pulse', ion: 'bg-ion' } as const

export default function Performance() {
  const [active, setActive] = useState(0)
  const m = METRICS[active]

  return (
    <section id="performance" className="relative border-t border-chalk/[0.07] bg-carbon py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          index="/ 01"
          label="Performance intelligence"
          title={
            <>
              One body. Multiple signals. <br />
              <span className="text-slate-light">One performance picture.</span>
            </>
          }
          body="STRYVE does not rely on a single metric. It reads several streams at once and combines them into something an athlete can actually act on, mid-session."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-chalk/[0.09] bg-chalk/[0.07] lg:grid-cols-[340px_1fr]">
          {/* selector */}
          <ul className="flex flex-col gap-px bg-chalk/[0.07]">
            {METRICS.map((metric, i) => {
              const on = i === active
              return (
                <li key={metric.key}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={on}
                    className={`group flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-pulse ${
                      on ? 'bg-carbon-700' : 'bg-carbon-800 hover:bg-carbon-700/60'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`font-mono text-[10px] ${on ? 'text-pulse' : 'text-slate'}`}>
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-[15px] uppercase tracking-tight transition-colors ${
                          on ? 'text-chalk' : 'text-chalk-dim'
                        }`}
                      >
                        {metric.label}
                      </span>
                    </span>
                    {metric.key === 'cramp' && (
                      <span className="border border-pulse/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-pulse">
                        Flagship
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* detail */}
          <div className="relative min-h-[380px] bg-carbon-800 p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full flex-col justify-between gap-10"
              >
                <div>
                  <span className="label">{m.label}</span>
                  <h3 className="editorial mt-4 max-w-lg text-[clamp(1.4rem,2.6vw,2.1rem)] text-chalk">
                    {m.question}
                  </h3>
                  <p className="mt-5 max-w-md text-[14.5px] leading-[1.75] text-chalk-dim">{m.body}</p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className={`num text-[clamp(3rem,7vw,5rem)] ${toneText[m.tone]}`}>
                        {m.readout}
                      </span>
                      {m.unit && <span className="label pb-2">{m.unit}</span>}
                    </div>
                  </div>
                  <div className="flex items-end gap-[4px]" aria-hidden>
                    {m.bars.map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: `${h * 0.62}px` }}
                        className={`w-[6px] origin-bottom ${toneBar[m.tone]}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
