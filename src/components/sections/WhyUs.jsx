import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'
import { features } from '../../data/features'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 14 },
  },
}

export function WhyUs() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="Why Vibe Flow"
            title="The Premium Service Experience"
            subtitle="We're not a marketplace. We're your dedicated team."
            center
          />
        </motion.div>
        
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((f) => (
            <motion.article className="feature-card" key={f.title} variants={cardVariants}>
              <div className="feature-icon" style={{ boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)' }}>
                <f.icon size={24} strokeWidth={2} aria-hidden="true" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

