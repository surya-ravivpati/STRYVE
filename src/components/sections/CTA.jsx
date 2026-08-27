import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../ui/Reveal.jsx'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <section id="join" className="relative overflow-hidden border-t border-white/[0.06] bg-carbon py-28 md:py-40">
      {/* controlled pulse lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-pulse/[0.12] blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />

      <div className="container-x relative text-center">
        <Reveal variant="up">
          <span className="eyebrow justify-center">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-pulse" /> Get STRYVE
          </span>
        </Reveal>

        <Reveal variant="up" delay={0.08}>
          <h2 className="display-tight mx-auto mt-7 max-w-4xl text-[clamp(2.3rem,7vw,6rem)]">
            Your next level <br className="hidden sm:block" /> starts with{' '}
            <span className="text-pulse">understanding</span> your body.
          </h2>
        </Reveal>

        <Reveal variant="up" delay={0.16}>
          <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-chalk-dim">
            Join the athletes building the future of performance. Be first to train, recover and
            compete with STRYVE.
          </p>
        </Reveal>

        <Reveal variant="up" delay={0.24}>
          {sent ? (
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 border border-ion/30 bg-ion/[0.06] px-6 py-4">
              <span className="h-2 w-2 rounded-full bg-ion animate-pulse-glow" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ion">
                You're on the list — welcome to STRYVE.
              </span>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 border border-white/15 bg-carbon-800 px-5 py-3.5 text-sm text-chalk placeholder:text-slate focus:border-pulse focus:outline-none focus:ring-1 focus:ring-pulse"
              />
              <button type="submit" className="btn-primary shrink-0">
                Join STRYVE <span aria-hidden>→</span>
              </button>
            </form>
          )}
        </Reveal>

        <Reveal variant="up" delay={0.3}>
          <a
            href="#technology"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-light transition-colors hover:text-chalk"
          >
            Explore the Technology <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
