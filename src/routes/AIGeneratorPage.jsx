import { ImageGeneratorSection } from '../components/sections/ImageGenerator'
import { useSEO } from '../hooks/useSEO'

export default function AIGeneratorPage() {
  useSEO({
    title: 'AI Image Generator',
    description:
      "Generate stunning images instantly with a free AI-powered tool. Describe a scene and get a cinematic render in seconds.",
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>AI Image Generator</h1>
        <p>Free, fast, and private. Describe anything — get a rendered image in seconds.</p>
      </div>
      <ImageGeneratorSection />
    </div>
  )
}
