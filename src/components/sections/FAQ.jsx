import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'
import { faq } from '../../data/faq'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 14 },
  },
}

export function FAQ({ compact = false }) {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before you hit submit."
            center
          />
        </motion.div>
        
        <motion.div
          className="faq-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {(compact ? faq.slice(0, 6) : faq).map((item, idx) => (
            <motion.details className="faq-item" key={item.q} open={idx === 0 && !compact} variants={itemVariants}>
              <summary className="faq-summary">{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
