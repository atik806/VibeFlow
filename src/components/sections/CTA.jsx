export function CTA({ onClick }) {
  return (
    <section className="cta-banner" aria-label="Call to action">
      <div className="cta-content">
        <h2>Got Something in Mind? Just Ask.</h2>
        <p>Tell us what you need and watch it come to life.</p>
        <button className="cta-button" onClick={onClick} type="button">
          Submit Your Request
        </button>
      </div>
    </section>
  )
}
