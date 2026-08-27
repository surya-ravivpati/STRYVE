import { lazy, Suspense, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import Mark from '../components/brand/Mark'
import Reveal from '../components/ui/Reveal'

const StoryScene = lazy(() => import('../components/three/StoryScene'))

/* ------------------------------------------------------------------ *
 * PLACEHOLDER COMMERCE VALUES — replace with real figures before launch.
 * Nothing here is a committed price; the UI states that explicitly.
 * ------------------------------------------------------------------ */
const PRICE_ESTIMATE = 279
const DEPOSIT = 40
const CURRENCY = 'USD'

const BANDS = [
  { id: 'thigh', name: 'Quad / hamstring', detail: 'Fits 42–72 cm' },
  { id: 'calf', name: 'Calf', detail: 'Fits 30–50 cm' },
  { id: 'forearm', name: 'Forearm', detail: 'Fits 22–38 cm' },
] as const

const FINISHES = [
  { id: 'carbon', name: 'Carbon', swatch: '#15181C', ring: '#2B3039' },
  { id: 'chalk', name: 'Chalk', swatch: '#D8D2C7', ring: '#F2EBE0' },
  { id: 'pulse', name: 'Pulse', swatch: '#C42D0F', ring: '#FF421D' },
] as const

const INCLUDED = [
  ['STRYVE module', 'The sensing unit — sEMG, IMU, GSR and thermal.'],
  ['Performance band', 'Elastic strap, alloy buckle, in your chosen size.'],
  ['Charging dock', 'Magnetic contact dock with USB-C cable.'],
  ['STRYVE app', 'iOS and Android, included with every unit.'],
]

const SPECS: [string, string][] = [
  ['Sensing', 'sEMG, inertial, skin conductivity, skin temperature'],
  ['Placement', 'Worn on the working muscle group'],
  ['Feedback', 'Haptic prompt and status indicator'],
  ['Connectivity', 'Bluetooth Low Energy'],
  ['Power', 'Rechargeable, magnetic dock'],
  ['Processing', 'Real-time on-device signal handling'],
  ['App', 'iOS and Android'],
  ['Materials', 'Anodised aluminium lid, elastic band, alloy buckle'],
]

const FAQ = [
  {
    q: 'When does STRYVE ship?',
    a: 'Reservations are being taken ahead of the first production run. Reservation holders are contacted with confirmed pricing, final specifications and a shipping window before any balance is charged.',
  },
  {
    q: 'Is the deposit refundable?',
    a: 'Yes. The reservation deposit is fully refundable at any point before your order is confirmed for shipping.',
  },
  {
    q: 'Is STRYVE a medical device?',
    a: 'No. STRYVE is a performance product. It surfaces patterns and trends in physiological signal to help you train with better information. It does not diagnose, treat, or guarantee any outcome.',
  },
  {
    q: 'Where is the band worn?',
    a: 'On the working muscle group rather than the wrist — quad, hamstring, calf or forearm depending on your sport. Reading the muscle directly is what makes muscle activity and cramp-risk signals available at all.',
  },
  {
    q: 'Do I need a subscription?',
    a: 'The STRYVE app is included with every unit. Any future team or coaching tier will be optional and announced separately.',
  },
]

function Money({ value, className = '' }: { value: number; className?: string }) {
  return <span className={className}>${value.toLocaleString('en-US')}</span>
}

export default function Reserve() {
  const [band, setBand] = useState<string>(BANDS[0].id)
  const [finish, setFinish] = useState<string>(FINISHES[0].id)
  const [qty, setQty] = useState(1)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // The model sits in a fixed, assembled "product shot" pose on this page.
  const pose = useMotionValue(0.06)

  const depositTotal = useMemo(() => DEPOSIT * qty, [qty])
  const estimateTotal = useMemo(() => PRICE_ESTIMATE * qty, [qty])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) setDone(true)
  }

  const selectedBand = BANDS.find((b) => b.id === band)!
  const selectedFinish = FINISHES.find((f) => f.id === finish)!

  return (
    <div className="pt-[68px]">
      {/* ---------------- product ---------------- */}
      <section className="relative overflow-hidden border-b border-chalk/[0.07] bg-carbon">
        <div className="absolute inset-0 grid-fine opacity-50" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[520px] w-[520px] rounded-full bg-pulse/[0.09] blur-[160px]" />

        <div className="container-x relative grid grid-cols-1 gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* visual */}
          <div className="lg:sticky lg:top-[92px] lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden border border-chalk/[0.09] bg-carbon-800">
              <Suspense fallback={<div className="h-full w-full" />}>
                <StoryScene progress={pose} className="h-full w-full" zoom={1.45} />
              </Suspense>
              <span className="absolute left-5 top-5 label">STRYVE — {selectedFinish.name}</span>
              <span className="absolute bottom-5 left-5 label text-slate">Live render · rotating</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['4', 'Sensors'],
                ['On-muscle', 'Placement'],
                ['Real-time', 'Readout'],
              ].map(([n, l]) => (
                <div key={l} className="border border-chalk/[0.09] bg-carbon-800 px-4 py-3">
                  <div className="num text-[15px] text-chalk">{n}</div>
                  <div className="label mt-1 text-[8.5px]">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* configurator */}
          <div>
            <div className="flex items-center gap-3">
              <Mark className="h-3 w-auto text-pulse" />
              <span className="label">Reserve · First production run</span>
            </div>

            <h1 className="display mt-6 text-[clamp(2.4rem,6vw,4.4rem)]">STRYVE</h1>
            <p className="mt-4 max-w-md text-[15px] leading-[1.75] text-chalk-dim">
              The performance monitor. Four fused sensors read from the working muscle, turned into
              live intensity, fatigue, readiness — and rising cramp risk.
            </p>

            {/* price */}
            <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-3 border-y border-chalk/[0.09] py-6">
              <div>
                <div className="label">Estimated price</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <Money value={estimateTotal} className="num text-[38px] text-chalk" />
                  <span className="label">{CURRENCY}</span>
                </div>
              </div>
              <div>
                <div className="label">Due today</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <Money value={depositTotal} className="num text-[38px] text-pulse" />
                  <span className="label">deposit</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-[1.7] text-slate">
              Pricing is an estimate ahead of the first production run and is not final. You are
              charged the deposit only — fully refundable, with confirmed pricing sent before any
              balance is taken.
            </p>

            {/* band */}
            <fieldset className="mt-10">
              <legend className="label">Band — worn on</legend>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {BANDS.map((b) => {
                  const on = b.id === band
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBand(b.id)}
                      aria-pressed={on}
                      className={`border px-4 py-4 text-left transition-colors duration-250 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pulse ${
                        on
                          ? 'border-pulse bg-pulse/[0.07]'
                          : 'border-chalk/12 bg-carbon-800 hover:border-chalk/30'
                      }`}
                    >
                      <span className={`block text-[13.5px] font-semibold ${on ? 'text-chalk' : 'text-chalk-dim'}`}>
                        {b.name}
                      </span>
                      <span className="label mt-1.5 block text-[8.5px]">{b.detail}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* finish */}
            <fieldset className="mt-8">
              <legend className="label">Finish</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {FINISHES.map((f) => {
                  const on = f.id === finish
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinish(f.id)}
                      aria-pressed={on}
                      aria-label={f.name}
                      className={`flex items-center gap-3 border px-4 py-3 transition-colors duration-250 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pulse ${
                        on ? 'border-pulse bg-pulse/[0.07]' : 'border-chalk/12 bg-carbon-800 hover:border-chalk/30'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border"
                        style={{ background: f.swatch, borderColor: f.ring }}
                      />
                      <span className={`text-[13px] ${on ? 'text-chalk' : 'text-chalk-dim'}`}>{f.name}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* quantity */}
            <fieldset className="mt-8">
              <legend className="label">Quantity</legend>
              <div className="mt-4 inline-flex items-center border border-chalk/12 bg-carbon-800">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-4 py-3 text-chalk-dim transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pulse"
                >
                  −
                </button>
                <span className="num min-w-[42px] py-3 text-center text-[15px] text-chalk">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="px-4 py-3 text-chalk-dim transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pulse"
                >
                  +
                </button>
              </div>
            </fieldset>

            {/* reserve */}
            <div className="mt-10 border border-chalk/[0.09] bg-carbon-800 p-6">
              {done ? (
                <div className="flex flex-col gap-3">
                  <span className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ion" />
                    <span className="label text-ion">Reservation held</span>
                  </span>
                  <p className="text-[14px] leading-[1.7] text-chalk">
                    {qty} × STRYVE · {selectedBand.name} · {selectedFinish.name}
                  </p>
                  <p className="text-[13px] leading-[1.7] text-slate-light">
                    We've sent confirmation to <span className="text-chalk">{email}</span>. Nothing has
                    been charged — you'll receive final pricing and a shipping window before your
                    deposit is taken.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-3">
                  <label htmlFor="reserve-email" className="label">
                    Reserve your place
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="reserve-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="flex-1 border border-chalk/15 bg-carbon-700 px-5 py-4 text-sm text-chalk placeholder:text-slate focus:border-pulse focus:outline-none focus:ring-1 focus:ring-pulse"
                    />
                    <button type="submit" className="btn-primary lift shrink-0">
                      Reserve — <Money value={depositTotal} />
                    </button>
                  </div>
                  <p className="text-[11.5px] leading-[1.6] text-slate">
                    Refundable deposit. No charge until pricing is confirmed.
                  </p>
                </form>
              )}
            </div>

            {/* included */}
            <div className="mt-10">
              <span className="label">In the box</span>
              <ul className="mt-4 border-t border-chalk/[0.09]">
                {INCLUDED.map(([t, d]) => (
                  <li key={t} className="flex gap-5 border-b border-chalk/[0.09] py-4">
                    <Mark className="mt-1 h-3 w-auto shrink-0 text-pulse" />
                    <div>
                      <div className="text-[14px] font-semibold text-chalk">{t}</div>
                      <div className="mt-1 text-[13px] leading-[1.6] text-chalk-dim">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- specs ---------------- */}
      <section className="border-b border-chalk/[0.07] bg-carbon-950 py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <span className="label">Specifications</span>
          </Reveal>
          <Reveal delay={0.07}>
            <h2 className="editorial mt-5 max-w-2xl text-[clamp(1.7rem,3.6vw,2.6rem)]">
              What's inside the band.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 border-t border-chalk/[0.09] sm:grid-cols-2">
            {SPECS.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.07 }}
                className="flex flex-col gap-2 border-b border-chalk/[0.09] py-6 pr-8 sm:odd:border-r sm:odd:pr-10"
              >
                <span className="label">{k}</span>
                <span className="text-[14.5px] leading-snug text-chalk">{v}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-[12.5px] leading-[1.7] text-slate">
            Full specifications — including battery life, weight, dimensions and ingress rating — are
            confirmed with reservation holders before the first production run ships.
          </p>
        </div>
      </section>

      {/* ---------------- faq ---------------- */}
      <section className="border-b border-chalk/[0.07] bg-carbon py-20 md:py-24">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr]">
          <div>
            <span className="label">Questions</span>
            <h2 className="editorial mt-5 text-[clamp(1.7rem,3.4vw,2.4rem)]">Before you reserve.</h2>
          </div>

          <ul className="border-t border-chalk/[0.09]">
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <li key={f.q} className="border-b border-chalk/[0.09]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pulse"
                  >
                    <span className="text-[15px] font-semibold text-chalk">{f.q}</span>
                    <span
                      className={`shrink-0 font-mono text-[15px] text-pulse transition-transform duration-300 ${
                        open ? 'rotate-45' : ''
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-[14px] leading-[1.75] text-chalk-dim">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- closing ---------------- */}
      <section className="relative overflow-hidden bg-carbon-950 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[800px] -translate-x-1/2 rounded-full bg-pulse/[0.1] blur-[150px]" />
        <div className="container-x relative text-center">
          <h2 className="display mx-auto max-w-3xl text-[clamp(2rem,5.4vw,4rem)]">
            Know your limits. <span className="text-pulse">Then push them.</span>
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#reserve-email" className="btn-primary lift">
              Reserve STRYVE <span aria-hidden>→</span>
            </a>
            <Link to="/" className="btn-ghost">
              Back to the technology
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
