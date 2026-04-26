import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to the top (or to a hash target) on route change.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const targetId = hash.slice(1)
      const scrollToHashTarget = () => {
        const el = document.getElementById(targetId)
        if (!el) return false
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }

      if (scrollToHashTarget()) return

      const rafId = requestAnimationFrame(() => {
        if (scrollToHashTarget()) return
        setTimeout(scrollToHashTarget, 80)
      })

      return () => cancelAnimationFrame(rafId)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
