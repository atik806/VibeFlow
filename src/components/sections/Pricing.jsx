import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { pricingPlans } from '../../data/pricing'
import { Check } from '../../icons'

export function Pricing({ onSelect }) {
  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHeader
          label="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="Pick a plan that fits your pace. Upgrade, downgrade or cancel any time."
          center
        />
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
              {plan.tag && <span className="pricing-tag">{plan.tag}</span>}
              <p className="pricing-name">{plan.name}</p>
              <p className="pricing-price">
                ${plan.price.toLocaleString()}
                <span> {plan.period}</span>
              </p>
              <p className="pricing-desc">{plan.description}</p>
              <ul className="pricing-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={16} aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? 'primary' : 'ghost'}
                block
                onClick={() => onSelect?.(plan)}
              >
                {plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
