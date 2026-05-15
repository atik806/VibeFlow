import { Games } from '../components/sections/Games'
import { useSEO } from '../hooks/useSEO'

export default function GamesPage() {
  useSEO({
    title: 'AI Games',
    description: 'Play interactive AI-powered games.',
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>AI Games</h1>
        <p>Challenge yourself with AI-powered games. Test your luck, knowledge, and wit against intelligent opponents.</p>
      </div>
      <div className="container">
        <Games />
      </div>
    </div>
  )
}