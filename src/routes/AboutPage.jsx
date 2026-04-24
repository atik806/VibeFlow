import { useOutletContext } from 'react-router-dom'
import { AboutSection } from '../components/sections/AboutSection'
import { Stats } from '../components/sections/Stats'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'
import { useSEO } from '../hooks/useSEO'

export default function AboutPage() {
  const { openRequestModal } = useOutletContext()
  useSEO({
    title: 'About',
    description:
      "Meet the team behind Vibe Flow. Designers, developers, and writers on a mission to make professional work frictionless.",
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>About Vibe Flow</h1>
        <p>We're a dedicated expert team — not a marketplace.</p>
      </div>
      <AboutSection />
      <Stats />
      <Testimonials />
      <CTA onClick={openRequestModal} />
    </div>
  )
}
