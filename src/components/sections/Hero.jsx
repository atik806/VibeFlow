import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 12 },
  },
}

export function Hero({ onPrimary }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="hero-badge-wrapper" style={{ marginBottom: 16 }}>
            <span className="badge badge-purple">
              <span className="badge-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block', marginRight: 6, animation: 'pulse 2s infinite' }} />
              Vibe Flow v2.0 is Live
            </span>
          </motion.div>
          <motion.h1 variants={itemVariants}>
            Tell Us What You Need. <br />
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We'll Handle the Rest.</span>
          </motion.h1>
          <motion.p variants={itemVariants}>
            Submit a request and the Vibe Flow expert team delivers. No browsing,
            no hiring, no headaches — just premium results delivered directly to you.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-buttons">
            <Button variant="primary" size="lg" onClick={onPrimary}>
              Submit a Request
            </Button>
            <Link to="/services" className="btn btn-ghost btn-lg">
              See What We Do
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
