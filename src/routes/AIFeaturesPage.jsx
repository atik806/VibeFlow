import { useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Wand2, FileText, Eye, Gamepad2, Sparkles } from 'lucide-react'

const aiFeatures = [
  {
    id: 'generator',
    title: 'AI Generator',
    description: 'Generate images from text using cutting-edge AI models',
    icon: Wand2,
    href: '/ai-generator',
    color: 'cyan',
  },
  {
    id: 'cv',
    title: 'CV with AI',
    description: 'Create professional ATS-friendly resumes with AI assistance',
    icon: FileText,
    href: '/cv-with-ai',
    color: 'purple',
  },
  {
    id: 'play',
    title: 'Play with AI',
    description: 'Interactive AI features and custom image generation',
    icon: Sparkles,
    href: '/play-with-ai',
    color: 'pink',
  },
  {
    id: 'detection',
    title: 'Object Detection',
    description: 'Detect and identify objects in images using AI',
    icon: Eye,
    href: '/object-detection',
    color: 'green',
  },
  {
    id: 'games',
    title: 'AI Games',
    description: 'Fun games powered by AI technology',
    icon: Gamepad2,
    href: '/games',
    color: 'orange',
  },
]

export default function AIFeaturesPage() {
  useSEO({
    title: 'AI Features',
    description: 'Explore our AI-powered tools and features',
  })
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <SectionHeader
        title="AI Features"
        subtitle="Explore our cutting-edge AI tools"
      />

      <div className="ai-features-grid">
        {aiFeatures.map((feature) => (
          <button
            key={feature.id}
            className={`ai-feature-card ${feature.color}`}
            onClick={() => navigate(feature.href)}
          >
            <div className="ai-feature-icon">
              <feature.icon size={32} />
            </div>
            <div className="ai-feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}