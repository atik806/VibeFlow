import { motion } from 'framer-motion'
import { stats } from '../../data/stats'
import { useCountUp } from '../../hooks/useCountUp'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 60, damping: 15 },
  },
}

function StatItem({ value, suffix, label }) {
  const { value: display, ref } = useCountUp({ end: value })
  return (
    <motion.div className="stat-item" ref={ref} variants={itemVariants}>
      <span className="stat-number">{display}{suffix}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="stats-section" aria-label="Key stats">
      <div className="container">
        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
