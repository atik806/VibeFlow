import { useEffect } from 'react'

// Locks body scroll while a modal or drawer is open. Applies a class so
// stacked open/close calls remain safe (the class only toggles when no
// consumer is active).
let lockCount = 0

export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined
    lockCount += 1
    document.body.classList.add('is-scroll-locked')
    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.classList.remove('is-scroll-locked')
      }
    }
  }, [locked])
}
