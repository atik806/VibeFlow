import { SectionHeader } from '../ui/SectionHeader'
import { testimonials } from '../../data/testimonials'
import { StarIcon } from '../../icons'

export function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeader
          label="Testimonials"
          title="What Our Clients Say"
          subtitle="Don't just take our word for it."
          center
        />
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <article className="testimonial-card" key={t.name}>
              <header className="testimonial-header">
                <div className="testimonial-avatar" aria-hidden="true">{t.initials}</div>
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </header>
              <div className="testimonial-stars" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
