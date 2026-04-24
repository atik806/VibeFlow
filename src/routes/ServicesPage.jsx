import { useOutletContext } from 'react-router-dom'
import { Services } from '../components/sections/Services'
import { CTA } from '../components/sections/CTA'
import { useSEO } from '../hooks/useSEO'

export default function ServicesPage() {
  const { openRequestModal } = useOutletContext()
  useSEO({
    title: 'Services',
    description:
      "Design, development, AI, writing, and more — the full Vibe Flow service catalogue, delivered by a vetted expert team.",
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Everything you need. One team.</h1>
        <p>
          Six categories. Thirty+ subcategories. All under the same simple
          brief-to-delivery workflow.
        </p>
      </div>
      <Services />
      <CTA onClick={openRequestModal} />
    </div>
  )
}
