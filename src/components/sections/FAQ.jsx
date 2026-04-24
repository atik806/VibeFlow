import { SectionHeader } from '../ui/SectionHeader'
import { faq } from '../../data/faq'

export function FAQ({ compact = false }) {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you hit submit."
          center
        />
        <div className="faq-list">
          {(compact ? faq.slice(0, 6) : faq).map((item, idx) => (
            <details className="faq-item" key={item.q} open={idx === 0 && !compact}>
              <summary className="faq-summary">{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
