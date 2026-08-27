import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Wordmark from './brand/Wordmark.jsx'
import Mark from './brand/Mark.jsx'

const LINKS = [
  { label: 'Technology', href: '#technology' },
  { label: 'How It Works', href: '#how' },
  { label: 'Performance', href: '#performance' },
  { label: 'For Athletes', href: '#athletes' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-chalk/[0.08] bg-carbon/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between">
        <a href="#top" className="group flex items-center gap-3" aria-label="STRYVE home">
          <Mark className="h-6 w-auto text-pulse transition-transform duration-500 group-hover:-translate-y-0.5" />
          <Wordmark className="h-[13px]" />
        </a>

        <ul className="hidden items-center gap-10 lg:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="group relative font-mono text-[10.5px] uppercase tracking-[0.24em] text-chalk-dim transition-colors hover:text-chalk"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-pulse transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#join" className="btn-primary hidden px-5 py-2.5 text-[11.5px] sm:inline-flex">
            Get STRYVE <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className={`h-[2px] w-6 bg-chalk transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-6 bg-chalk transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`h-[2px] w-6 bg-chalk transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-chalk/[0.06] lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-6">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-3 font-display text-2xl uppercase tracking-tight text-chalk"
                  >
                    <Mark className="h-4 w-auto text-pulse/50" />
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <a href="#join" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full py-4">
                Get STRYVE →
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
