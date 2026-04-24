import { motion } from 'framer-motion'

export function CTA({ onClick }) {
  return (
    <section className="cta-banner" aria-label="Call to action">
      <motion.div 
        className="cta-content"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
      >
        <h2>Got Something in Mind? Just Ask.</h2>
        <p>Tell us what you need and watch it come to life.</p>
        <button className="cta-button" onClick={onClick} type="button">
          Submit Your Request
        </button>
      </motion.div>
    </section>
  )
}
