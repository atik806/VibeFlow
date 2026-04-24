export function SectionHeader({ label, title, subtitle, center = false, className = '' }) {
  return (
    <header className={`section-header ${center ? 'center' : ''} ${className}`}>
      {label && <span className="section-label">{label}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </header>
  )
}
