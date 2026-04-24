import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

export default function NotFoundPage() {
  useSEO({
    title: 'Page not found',
    description: 'This page does not exist.',
    noIndex: true,
  })

  return (
    <div className="not-found">
      <div>
        <h1>404</h1>
        <p>This page has wandered off. Let's get you back.</p>
        <Link to="/" className="btn btn-primary">Return home</Link>
      </div>
    </div>
  )
}
