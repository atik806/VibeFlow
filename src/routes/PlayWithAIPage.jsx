import { PlayWithAI } from '../components/sections/PlayWithAI'
import { useSEO } from '../hooks/useSEO'

export default function PlayWithAIPage() {
  useSEO({
    title: 'Play with AI',
    description: 'Experience real-time AI features including object detection, games, and CV creation.',
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Play with AI</h1>
        <p>Explore AI-powered experiences. Play games, detect objects, and create professional resumes with cutting-edge AI technology.</p>
      </div>
      <div className="container">
        <PlayWithAI />
      </div>
    </div>
  )
}