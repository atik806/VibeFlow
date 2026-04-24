import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'
import { testimonials } from '../../data/testimonials'
import { StarIcon } from '../../icons'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 12 },
  },
}

export function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="Testimonials"
            title="What Our Clients Say"
            subtitle="Don't just take our word for it."
            center
          />
        </motion.div>
        
        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {testimonials.map((t) => (
            <motion.article className="testimonial-card" key={t.name} variants={cardVariants}>
              <header className="testimonial-header">
                <div className="testimonial-avatar" aria-hidden="true" style={{ boxShadow: '0 5px 15px rgba(6, 182, 212, 0.3)' }}>{t.initials}</div>
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </header>
              <div className="testimonial-stars" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

