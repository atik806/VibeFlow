import { SectionHeader } from '../ui/SectionHeader'
import { LightningIcon, Sparkles, Check } from '../../icons'
import { User } from 'lucide-react'

const VALUES = [
  {
    icon: LightningIcon,
    title: 'Quality First',
    body: 'We never compromise on the quality of our work. Every deliverable meets our high standards.',
  },
  {
    icon: Sparkles,
    title: 'Simplicity',
    body: 'We make things easy. No complex processes, just straightforward solutions.',
  },
  {
    icon: User,
    title: 'Partnership',
    body: 'We work with you as partners, not just vendors. Your success is our success.',
  },
  {
    icon: Check,
    title: 'Reliability',
    body: 'When we commit, we deliver. Count on us to meet deadlines and exceed expectations.',
  },
]

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader
          label="About Us"
          title="Built on Trust, Driven by Results"
        />

        <div className="about-content">
          <div className="about-text">
            <p className="about-lead">
              Vibe Flow was born from a simple idea: getting professional work
              done shouldn't be complicated.
            </p>
            <p>
              Founded in 2024, we set out to eliminate the friction of
              traditional freelance platforms. No more endless browsing,
              negotiating, or worrying about quality. Just tell us what you
              need, and our expert team delivers.
            </p>
            <p>
              We're a team of designers, developers, writers, and
              technologists who believe in the power of exceptional work.
              Every project is an opportunity to create something great.
            </p>
          </div>

          <div className="about-values">
            <h3>Our Values</h3>
            <div className="values-grid">
              {VALUES.map((v) => (
                <div className="value-card" key={v.title}>
                  <div className="value-icon">
                    <v.icon size={20} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h4>{v.title}</h4>
                  <p>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
