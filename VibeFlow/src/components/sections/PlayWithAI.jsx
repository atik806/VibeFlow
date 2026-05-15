import { useState } from 'react'
import { Eye, Gamepad2, FileText, ChevronRight, Wand2 } from '../../icons'
import { useNavigate, useLocation } from 'react-router-dom'

const categories = [
  {
    id: 'image-generator',
    icon: Wand2,
    title: 'Image Generator',
    description: 'Generate images from text using cutting-edge AI models',
    color: '#06b6d4',
    path: '/ai-generator',
  },
  {
    id: 'object-detection',
    icon: Eye,
    title: 'Object Detection',
    description: 'Real-time YOLOv8 object detection with your webcam',
    color: '#8b5cf6',
    path: '/object-detection',
  },
  {
    id: 'games',
    icon: Gamepad2,
    title: 'AI Games',
    description: 'Play interactive AI-powered games and challenges',
    color: '#ec4899',
    path: '/games',
  },
  {
    id: 'cv-ai',
    icon: FileText,
    title: 'CV with AI',
    description: 'Create, analyze, and improve your resume with AI',
    color: '#06b6d4',
    path: '/cv-with-ai',
  },
]

export function PlayWithAI() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="ai-categories-select">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <button
            key={cat.id}
            className="ai-category-card"
            onClick={() => navigate(cat.path)}
            style={{ '--cat-color': cat.color }}
          >
            <div className="ai-category-card-icon">
              <Icon size={32} strokeWidth={1.5} />
            </div>
            <div className="ai-category-card-content">
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
            <ChevronRight size={24} className="ai-category-card-arrow" />
          </button>
        )
      })}
    </div>
  )
}