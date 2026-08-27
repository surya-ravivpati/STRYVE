import { lazy, Suspense } from 'react'
import Nav from './components/layout/Nav'
import Hero from './components/sections/Hero'
import ScrollStory from './components/sections/ScrollStory'

/* Everything past the 3D story is split out so the first screen stays light. */
const Performance = lazy(() => import('./components/sections/Performance'))
const CrampFlagship = lazy(() => import('./components/sections/CrampFlagship'))
const HowItWorks = lazy(() => import('./components/sections/HowItWorks'))
const Dashboard = lazy(() => import('./components/sections/Dashboard'))
const AthleticsXTech = lazy(() => import('./components/sections/AthleticsXTech'))
const Science = lazy(() => import('./components/sections/Science'))
const Sports = lazy(() => import('./components/sections/Sports'))
const Ecosystem = lazy(() => import('./components/sections/Ecosystem'))
const FinalCTA = lazy(() => import('./components/sections/FinalCTA'))
const Footer = lazy(() => import('./components/layout/Footer'))

export default function App() {
  return (
    <div className="relative min-h-screen bg-carbon text-chalk">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-pulse focus:px-4 focus:py-2 focus:text-carbon"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <ScrollStory />
        <Suspense fallback={<div className="h-[50vh] bg-carbon" aria-hidden />}>
          <Performance />
          <CrampFlagship />
          <HowItWorks />
          <Dashboard />
          <AthleticsXTech />
          <Science />
          <Sports />
          <Ecosystem />
          <FinalCTA />
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}
