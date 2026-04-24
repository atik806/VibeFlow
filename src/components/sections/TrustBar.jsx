const TRUST_LOGOS = ['Acme', 'Lumen', 'Northwind', 'Orbit', 'Helios', 'Quanta']

export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Trusted by">
      <div className="container">
        <p className="trust-bar-label">Trusted by teams at</p>
        <div className="trust-bar-logos">
          {TRUST_LOGOS.map((name) => (
            <span key={name} className="trust-bar-logo">{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
