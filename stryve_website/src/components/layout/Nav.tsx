import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Wordmark from '../brand/Wordmark'
import Mark from '../brand/Mark'

// Order matches actual scroll position on the page (#technology sits inside
// the Science section, so Science must precede it).
const LINKS = [
  { label: 'Performance', href: '#performance' },
  { label: 'Cramp Detection', href: '#cramp' },
  { label: 'About', href: '#about' },
  { label: 'Science', href: '#science' },
  { label: 'Technology', href: '#technology' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  // Section anchors only exist on the home route; elsewhere route back to it.
  const to = (hash: string) => (onHome ? hash : `/${hash}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-chalk/[0.08] bg-carbon/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[68px] items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="STRYVE home">
          <Mark className="h-[22px] w-auto text-pulse transition-transform duration-500 group-hover:-translate-y-0.5" />
          <Wordmark className="h-[12px]" />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={to(l.href)}
                className="group relative font-mono text-[10px] uppercase tracking-[0.22em] text-chalk-dim transition-colors hover:text-chalk"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-pulse transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/reserve" className="btn-primary lift hidden px-5 py-2.5 text-[10px] sm:inline-flex">
            Reserve
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className={`h-[1.5px] w-6 bg-chalk transition-all duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`h-[1.5px] w-6 bg-chalk transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`h-[1.5px] w-6 bg-chalk transition-all duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
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
            <ul className="container-x flex flex-col py-5">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={to(l.href)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 border-b border-chalk/[0.06] py-4 font-display text-xl uppercase tracking-tight text-chalk"
                  >
                    <Mark className="h-3.5 w-auto text-pulse/60" />
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <Link to="/reserve" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full py-4">
                Reserve STRYVE
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
