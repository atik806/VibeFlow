import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Hero({ onPrimary }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Tell Us What You Need. We'll Handle the Rest.</h1>
          <p>
            Submit a request and the Vibe Flow expert team delivers. No browsing,
            no hiring, no headaches — just results delivered to your inbox.
          </p>
          <div className="hero-buttons">
            <Button variant="primary" size="lg" onClick={onPrimary}>
              Submit a Request
            </Button>
            <Link to="/services" className="btn btn-ghost btn-lg">
              See What We Do
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glow-ring" aria-hidden="true" />
          <div className="mockup-card" aria-hidden="true">
            <div className="mockup-header">
              <div className="mockup-dot red" />
              <div className="mockup-dot yellow" />
              <div className="mockup-dot green" />
              <span className="mockup-title">New Request</span>
            </div>
            <div className="mockup-form">
              <input className="mockup-input" placeholder="Your name" readOnly />
              <input className="mockup-input" placeholder="Email address" readOnly />
              <textarea className="mockup-textarea" placeholder="Describe what you need…" readOnly />
              <button className="mockup-submit" type="button" tabIndex={-1}>
                Submit Request
              </button>
            </div>
            <div className="mockup-status">
              <span className="status-dot" />
              Team is working on it…
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
