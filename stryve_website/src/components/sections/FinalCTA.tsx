import { lazy, Suspense, useRef, useState, type FormEvent } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Mark from '../brand/Mark'

const StoryScene = lazy(() => import('../three/StoryScene'))

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Hold the model in its assembled, hero-like state for this final appearance.
  const modelProgress = useTransform(scrollYProgress, [0, 1], [0.02, 0.24])

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <section
      id="join"
      ref={ref}
      className="relative overflow-hidden border-t border-chalk/[0.07] bg-carbon py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-pulse/[0.11] blur-[160px]" />

      <div className="container-x relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <Mark className="h-3.5 w-auto text-pulse" />
            <span className="label">Join STRYVE</span>
          </div>

          <h2 className="display mt-7 text-[clamp(2.4rem,6.4vw,5.2rem)]">
            Know your limits.
            <br />
            <span className="text-pulse">Then push them.</span>
          </h2>

          <p className="mt-8 max-w-md text-[15px] leading-[1.8] text-chalk-dim">
            STRYVE gives athletes a clearer picture of what is happening beneath the surface — so
            they can train with more intelligence, not just more effort.
          </p>

          {sent ? (
            <div className="mt-10 flex max-w-md items-center gap-3 border border-ion/30 bg-ion/[0.06] px-6 py-4">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ion" />
              <span className="label text-ion">You're on the list — welcome to STRYVE.</span>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="join-email" className="sr-only">
                Email address
              </label>
              <input
                id="join-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 border border-chalk/15 bg-carbon-800 px-5 py-4 text-sm text-chalk placeholder:text-slate focus:border-pulse focus:outline-none focus:ring-1 focus:ring-pulse"
              />
              <button type="submit" className="btn-primary lift shrink-0">
                Join STRYVE
              </button>
            </form>
          )}

          <a
            href="#science"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-light transition-colors hover:text-chalk"
          >
            Explore the Technology <span aria-hidden>→</span>
          </a>
        </div>

        {/* final product beauty pass */}
        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
          <Suspense fallback={<div className="h-full w-full" />}>
            <StoryScene progress={modelProgress} className="h-full w-full" />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
