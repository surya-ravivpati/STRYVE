import Wordmark from '../brand/Wordmark.jsx'
import Mark from '../brand/Mark.jsx'

const NAV = [
  { label: 'Technology', href: '#technology' },
  { label: 'How It Works', href: '#how' },
  { label: 'Performance', href: '#performance' },
  { label: 'Athletes', href: '#athletes' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#join' },
]
const LEGAL = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-chalk/[0.08] bg-carbon-950">
      <Mark className="pointer-events-none absolute -right-[4%] -top-[30%] h-[220%] w-auto text-chalk/[0.018]" />
      <div className="container-x relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark className="h-[18px]" withMark markClassName="h-7 w-auto" />
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-slate-light">
              Intelligent athletic performance technology. STRYVE reads your body in real time so you
              can act before the cramp.
            </p>
            <p className="mt-8 font-display text-lg uppercase tracking-tight text-chalk">
              Predict. <span className="text-pulse">Prevent.</span> Perform.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">Explore</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="text-sm text-chalk-dim transition-colors hover:text-pulse">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">Legal</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="text-sm text-chalk-dim transition-colors hover:text-pulse">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-chalk/[0.07] pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
            © {new Date().getFullYear()} STRYVE — All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate">Signal → Strategy</p>
        </div>
      </div>
    </footer>
  )
}
