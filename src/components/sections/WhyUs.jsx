import { SectionHeader } from '../ui/SectionHeader'
import { features } from '../../data/features'

export function WhyUs() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <div className="container">
        <SectionHeader
          label="Why Vibe Flow"
          title="The Premium Service Experience"
          subtitle="We're not a marketplace. We're your dedicated team."
          center
        />
        <div className="features-grid">
          {features.map((f) => (
            <article className="feature-card" key={f.title}>
              <div className="feature-icon">
                <f.icon size={24} strokeWidth={2} aria-hidden="true" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
