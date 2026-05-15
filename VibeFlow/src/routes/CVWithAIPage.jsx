import { CVWithAI } from '../components/sections/CVWithAI'
import { useSEO } from '../hooks/useSEO'

export default function CVWithAIPage() {
  useSEO({
    title: 'CV with AI',
    description: 'Create and improve your resume with AI assistance.',
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>CV with AI</h1>
        <p>Create a professional resume with AI assistance. Fill in your details and generate a polished CV in seconds.</p>
      </div>
      <div className="container">
        <CVWithAI />
      </div>
    </div>
  )
}