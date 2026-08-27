import { Link, useLocation } from 'react-router-dom'
import Wordmark from '../brand/Wordmark'
import Mark from '../brand/Mark'

const NAV = [
  { label: 'Performance', href: '#performance' },
  { label: 'Technology', href: '#technology' },
  { label: 'Cramp Detection', href: '#cramp' },
  { label: 'Science', href: '#science' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#join' },
]
const LEGAL = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

export default function Footer() {
  const { pathname } = useLocation()
  const to = (hash: string) => (pathname === '/' ? hash : `/${hash}`)
  return (
    <footer className="relative overflow-hidden border-t border-chalk/[0.09] bg-carbon-950">
      <Mark className="pointer-events-none absolute -right-[3%] -top-[40%] h-[240%] w-auto text-chalk/[0.015]" />
      <div className="container-x relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark className="h-[17px]" withMark markClassName="h-7 w-auto" />
            <p className="label mt-5">Athletics × Technology</p>
            <p className="mt-6 max-w-xs text-[13.5px] leading-[1.75] text-slate-light">
              STRYVE is the flagship product of PowerThru — performance intelligence for athletes who
              train near their limit.
            </p>
            <p className="mt-8 font-display text-[15px] uppercase tracking-tight text-chalk">
              Predict. <span className="text-pulse">Prevent.</span> Perform.
            </p>
            <Link to="/reserve" className="btn-primary lift mt-7 px-5 py-3 text-[10px]">
              Reserve STRYVE
            </Link>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <h3 className="label">Explore</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a href={to(n.href)} className="text-[13.5px] text-chalk-dim transition-colors hover:text-pulse">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="label">Legal</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL.map((n) => (
                <li key={n.label}>
                  <a href={to(n.href)} className="text-[13.5px] text-chalk-dim transition-colors hover:text-pulse">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-chalk/[0.08] pt-8 sm:flex-row sm:items-center">
          <p className="label">© {new Date().getFullYear()} PowerThru. All rights reserved.</p>
          <p className="label">Performance intelligence for athletes</p>
        </div>
      </div>
    </footer>
  )
}
