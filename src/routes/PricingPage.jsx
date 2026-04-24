import { useOutletContext } from 'react-router-dom'
import { Pricing } from '../components/sections/Pricing'
import { FAQ } from '../components/sections/FAQ'
import { CTA } from '../components/sections/CTA'
import { useSEO } from '../hooks/useSEO'

export default function PricingPage() {
  const { openRequestModal } = useOutletContext()
  useSEO({
    title: 'Pricing',
    description:
      "Simple, transparent pricing for Vibe Flow. Starter projects, Pro and Agency subscriptions. Cancel anytime.",
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Pricing that matches your pace</h1>
        <p>One-off projects, unlimited subscriptions, or white-label agency plans.</p>
      </div>
      <Pricing onSelect={() => openRequestModal()} />
      <FAQ compact />
      <CTA onClick={openRequestModal} />
    </div>
  )
}
