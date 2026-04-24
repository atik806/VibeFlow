import { SectionHeader } from '../ui/SectionHeader'
import { services } from '../../data/services'

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <SectionHeader
          label="Services"
          title="What We Can Do For You"
          subtitle="Six core categories covering every creative and technical need — from pixels to production."
          center
        />
        <div className="services-grid">
          {services.map((s) => (
            <article className="service-card" key={s.id} id={s.id}>
              <div className="service-icon">
                <s.icon size={24} strokeWidth={2} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="subcategories">
                {s.subcategories.map((sub) => (
                  <span key={sub} className="subcategory-tag">{sub}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
