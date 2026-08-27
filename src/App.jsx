import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/sections/Hero.jsx'
import Problem from './components/sections/Problem.jsx'
import HowItWorks from './components/sections/HowItWorks.jsx'
import Technology from './components/sections/Technology.jsx'

// Below-the-fold sections are lazily loaded to keep the initial paint fast.
const Dashboard = lazy(() => import('./components/sections/Dashboard.jsx'))
const BuiltForMoment = lazy(() => import('./components/sections/BuiltForMoment.jsx'))
const UseCases = lazy(() => import('./components/sections/UseCases.jsx'))
const Philosophy = lazy(() => import('./components/sections/Philosophy.jsx'))
const Product = lazy(() => import('./components/sections/Product.jsx'))
const CTA = lazy(() => import('./components/sections/CTA.jsx'))
const Footer = lazy(() => import('./components/sections/Footer.jsx'))

function SectionFallback() {
  return <div className="h-[60vh] w-full bg-carbon" aria-hidden />
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-carbon text-chalk">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-pulse focus:px-4 focus:py-2 focus:text-carbon"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Technology />
        <Suspense fallback={<SectionFallback />}>
          <Dashboard />
          <BuiltForMoment />
          <UseCases />
          <Philosophy />
          <Product />
          <CTA />
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}
