import { useOutletContext } from 'react-router-dom'
import { Hero } from '../components/sections/Hero'
import { TrustBar } from '../components/sections/TrustBar'
import { Stats } from '../components/sections/Stats'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Services } from '../components/sections/Services'
import { ImageGeneratorSection } from '../components/sections/ImageGenerator'
import { WhyUs } from '../components/sections/WhyUs'
import { Testimonials } from '../components/sections/Testimonials'
import { FAQ } from '../components/sections/FAQ'
import { CTA } from '../components/sections/CTA'
import { useSEO } from '../hooks/useSEO'

export default function Home() {
  const { openRequestModal } = useOutletContext()
  useSEO({
    title: undefined,
    description:
      "Submit your request. Our expert team delivers design, development, AI, and writing work — no hiring, no marketplace friction, just results.",
  })

  return (
    <>
      <Hero onPrimary={openRequestModal} />
      <TrustBar />
      <HowItWorks />
      <Services />
      <ImageGeneratorSection />
      <Stats />
      <WhyUs />
      <Testimonials />
      <FAQ compact />
      <CTA onClick={openRequestModal} />
    </>
  )
}
