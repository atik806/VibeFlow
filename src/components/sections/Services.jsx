import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'
import { services } from '../../data/services'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 14 },
  },
}

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="Services"
            title="What We Can Do For You"
            subtitle="Six core categories covering every creative and technical need — from pixels to production."
            center
          />
        </motion.div>
        
        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {services.map((s) => (
            <motion.article className="service-card" key={s.id} id={s.id} variants={cardVariants}>
              <div className="service-icon" style={{ boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)' }}>
                <s.icon size={24} strokeWidth={2} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="subcategories">
                {s.subcategories.map((sub) => (
                  <span key={sub} className="subcategory-tag">{sub}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
