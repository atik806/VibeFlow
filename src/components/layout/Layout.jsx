import { Outlet, useLocation } from 'react-router-dom'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useCallback, useState } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RequestModal } from '../modals/RequestModal'
import { ScrollToTop } from './ScrollToTop'

// Shared application chrome: nav, footer, and the request-a-project modal
// is always mounted at the layout level and opened via context/outlet prop.
export function Layout() {
  const modal = useDisclosure(false)
  const { pathname } = useLocation()
  const hideFooter = pathname === '/login' || pathname === '/signup'
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRequestSubmitted = useCallback(() => {
    // Trigger a refresh by incrementing the key
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <Outlet context={{ openRequestModal: modal.open, refreshKey }} />
      </main>
      {!hideFooter && <Footer />}
      <RequestModal isOpen={modal.isOpen} onClose={modal.close} onSubmitted={handleRequestSubmitted} />
    </>
  )
}
