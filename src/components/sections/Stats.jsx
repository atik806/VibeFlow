import { stats } from '../../data/stats'
import { useCountUp } from '../../hooks/useCountUp'

function StatItem({ value, suffix, label }) {
  const { value: display, ref } = useCountUp({ end: value })
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{display}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function Stats() {
  return (
    <section className="stats-section" aria-label="Key stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
