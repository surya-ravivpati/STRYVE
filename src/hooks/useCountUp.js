import { useEffect, useRef, useState } from 'react'

/**
 * Counts a value up from 0 -> target when the element scrolls into view.
 * Respects prefers-reduced-motion by snapping to the target value.
 */
export function useCountUp(target, { duration = 1400, decimals = 0, start = 0 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(start)
  const played = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (played.current) return
      played.current = true
      if (reduce) {
        setValue(target)
        return
      }
      const startTime = performance.now()
      const tick = (now) => {
        const t = Math.min((now - startTime) / duration, 1)
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        const current = start + (target - start) * eased
        setValue(Number(current.toFixed(decimals)))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) run()
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration, decimals, start])

  return [ref, value]
}
