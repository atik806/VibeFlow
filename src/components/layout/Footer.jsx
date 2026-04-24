import { Link } from 'react-router-dom'
import { LightningIcon, TwitterIcon, GithubIcon, LinkedInIcon } from '../../icons'
import { footerNav } from '../../data/nav'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <div className="logo-icon"><LightningIcon size={18} /></div>
              <span>Vibe Flow</span>
            </Link>
            <p>Your request. Our expertise. Perfect flow.</p>
            <div className="footer-social">
              <a
                href="https://twitter.com/"
                aria-label="Vibe Flow on X (Twitter)"
                className="social-link"
                rel="noreferrer"
                target="_blank"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://github.com/"
                aria-label="Vibe Flow on GitHub"
                className="social-link"
                rel="noreferrer"
                target="_blank"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com/"
                aria-label="Vibe Flow on LinkedIn"
                className="social-link"
                rel="noreferrer"
                target="_blank"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <FooterColumn title="Services" items={footerNav.services} />
          <FooterColumn title="Company" items={footerNav.company} />
          <FooterColumn title="Legal" items={footerNav.legal} />
        </div>
        <div className="footer-bottom">
          <p>© {year} Vibe Flow. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy#cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul>
        {items.map((it) => (
          <li key={it.href}>
            {it.href.startsWith('/') ? (
              <Link to={it.href}>{it.label}</Link>
            ) : (
              <a href={it.href}>{it.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
