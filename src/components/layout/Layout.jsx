import { Outlet } from 'react-router-dom'
import { useDisclosure } from '../../hooks/useDisclosure'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RequestModal } from '../modals/RequestModal'
import { ScrollToTop } from './ScrollToTop'

// Shared application chrome: nav, footer, and the request-a-project modal
// is always mounted at the layout level and opened via context/outlet prop.
export function Layout() {
  const modal = useDisclosure(false)

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Navbar onOpenRequestModal={modal.open} />
      <main id="main-content">
        <Outlet context={{ openRequestModal: modal.open }} />
      </main>
      <Footer />
      <RequestModal isOpen={modal.isOpen} onClose={modal.close} />
    </>
  )
}
