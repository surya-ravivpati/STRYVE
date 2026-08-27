import { lazy, Suspense } from 'react'
import Hero from '../components/sections/Hero'
import ScrollStory from '../components/sections/ScrollStory'

/* Everything past the 3D story is split out so the first screen stays light. */
const Performance = lazy(() => import('../components/sections/Performance'))
const CrampFlagship = lazy(() => import('../components/sections/CrampFlagship'))
const HowItWorks = lazy(() => import('../components/sections/HowItWorks'))
const Dashboard = lazy(() => import('../components/sections/Dashboard'))
const AthleticsXTech = lazy(() => import('../components/sections/AthleticsXTech'))
const Science = lazy(() => import('../components/sections/Science'))
const Sports = lazy(() => import('../components/sections/Sports'))
const Ecosystem = lazy(() => import('../components/sections/Ecosystem'))
const FinalCTA = lazy(() => import('../components/sections/FinalCTA'))

export default function Home() {
  return (
    <>
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
      </Suspense>
    </>
  )
}
