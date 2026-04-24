import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCountUp({ end, duration = 1600, start = 0, decimals = 0 }) {
  // Initialize to `end` directly when reduced-motion is requested so we
  // never animate — and never call setState synchronously from an effect.
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : start))
  const ref = useRef(null)
  const startedRef = useRef(prefersReducedMotion())

  useEffect(() => {
    const target = ref.current
    if (!target || startedRef.current) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return
          startedRef.current = true
          const startTime = performance.now()
          const loop = (now) => {
            const progress = Math.min(1, (now - startTime) / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = start + (end - start) * eased
            setValue(
              decimals > 0
                ? Number(current.toFixed(decimals))
                : Math.round(current)
            )
            if (progress < 1) requestAnimationFrame(loop)
          }
          requestAnimationFrame(loop)
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [end, duration, start, decimals])

  return { value, ref }
}
