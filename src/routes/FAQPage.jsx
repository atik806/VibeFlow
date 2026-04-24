import { useOutletContext } from 'react-router-dom'
import { FAQ } from '../components/sections/FAQ'
import { CTA } from '../components/sections/CTA'
import { useSEO } from '../hooks/useSEO'

export default function FAQPage() {
  const { openRequestModal } = useOutletContext()
  useSEO({
    title: 'FAQ',
    description:
      'Answers to the most common questions about Vibe Flow timelines, quotes, revisions, IP, and more.',
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Questions, answered.</h1>
        <p>Everything you need to know before submitting your first request.</p>
      </div>
      <FAQ />
      <CTA onClick={openRequestModal} />
    </div>
  )
}
