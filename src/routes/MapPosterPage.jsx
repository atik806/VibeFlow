import { useEffect } from 'react'
import { AppProviders } from '@/map-poster/core/AppProviders'
import AppShell from '@/map-poster/shared/ui/AppShell'
import { useAuth } from '../hooks/useAuth'
import { useSEO } from '../hooks/useSEO'

// Dynamic import of poster styles to avoid global conflicts
let stylesLoaded = false
function loadPosterStyles() {
  if (stylesLoaded) return
  stylesLoaded = true
  import('@/map-poster/styles/index.css')
}

export default function MapPosterPage() {
  const { user } = useAuth()
  useSEO({ title: 'Map Poster Generator' })

  useEffect(() => {
    loadPosterStyles()
  }, [])

  return (
    <div className="map-poster-root">
      <AppProviders>
        <AppShell />
      </AppProviders>
    </div>
  )
}
