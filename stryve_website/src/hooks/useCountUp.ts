import { useEffect, useRef, useState } from 'react'

/** Counts up to `target` once the element scrolls into view. */
export function useCountUp(target: number, { duration = 1500, decimals = 0 } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const played = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (played.current) return
      played.current = true
      if (reduce) return setValue(target)
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1)
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        setValue(Number((target * eased).toFixed(decimals)))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && run()), {
      threshold: 0.4,
    })
    io.observe(node)
    return () => io.disconnect()
  }, [target, duration, decimals])

  return [ref, value] as const
}
