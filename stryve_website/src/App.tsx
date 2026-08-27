import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/layout/Nav'
import Home from './pages/Home'

const Reserve = lazy(() => import('./pages/Reserve'))
const Footer = lazy(() => import('./components/layout/Footer'))

/**
 * Restores sane scroll behaviour across route changes: jump to top on a new
 * route, but honour an anchor when one is present (e.g. /#science).
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
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
      <ScrollManager />
      <Nav />
      <main>
        <Suspense fallback={<div className="h-screen bg-carbon" aria-hidden />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
