import { useEffect } from 'react'

const DEFAULTS = {
  title: 'Vibe Flow — Premium On-Demand Service',
  description:
    "Submit your request. Our expert team handles design, development, writing, AI and more. No hiring hassle, just results.",
  image: '/og-image.png',
}

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    Object.entries(attrs.create || {}).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  if (attrs.content !== undefined) el.setAttribute('content', attrs.content)
}

// Lightweight SEO hook — updates document.title and meta tags on mount.
export function useSEO({ title, description, image, noIndex } = {}) {
  useEffect(() => {
    const resolvedTitle = title ? `${title} · Vibe Flow` : DEFAULTS.title
    const resolvedDesc = description || DEFAULTS.description
    const resolvedImage = image || DEFAULTS.image

    const previousTitle = document.title
    document.title = resolvedTitle

    upsertMeta('meta[name="description"]', {
      create: { name: 'description' },
      content: resolvedDesc,
    })
    upsertMeta('meta[property="og:title"]', {
      create: { property: 'og:title' },
      content: resolvedTitle,
    })
    upsertMeta('meta[property="og:description"]', {
      create: { property: 'og:description' },
      content: resolvedDesc,
    })
    upsertMeta('meta[property="og:image"]', {
      create: { property: 'og:image' },
      content: resolvedImage,
    })
    upsertMeta('meta[property="og:type"]', {
      create: { property: 'og:type' },
      content: 'website',
    })
    upsertMeta('meta[name="twitter:card"]', {
      create: { name: 'twitter:card' },
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', {
      create: { name: 'twitter:title' },
      content: resolvedTitle,
    })
    upsertMeta('meta[name="twitter:description"]', {
      create: { name: 'twitter:description' },
      content: resolvedDesc,
    })
    upsertMeta('meta[name="robots"]', {
      create: { name: 'robots' },
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    })

    return () => {
      document.title = previousTitle
    }
  }, [title, description, image, noIndex])
}
