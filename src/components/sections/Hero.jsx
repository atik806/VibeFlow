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

const floatingMockupVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
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
        
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          <div className="glow-ring" aria-hidden="true" />
          <motion.div
            className="mockup-card"
            aria-hidden="true"
            variants={floatingMockupVariants}
            initial="initial"
            animate="animate"
            style={{ 
              background: 'rgba(18, 18, 26, 0.4)', 
              backdropFilter: 'blur(24px)', 
              WebkitBackdropFilter: 'blur(24px)', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="mockup-header">
              <div className="mockup-dot red" />
              <div className="mockup-dot yellow" />
              <div className="mockup-dot green" />
              <span className="mockup-title">New Request</span>
            </div>
            <div className="mockup-form">
              <input className="mockup-input" placeholder="Your name" readOnly style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }} />
              <input className="mockup-input" placeholder="Email address" readOnly style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }} />
              <textarea className="mockup-textarea" placeholder="Describe what you need…" readOnly style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }} />
              <button className="mockup-submit" type="button" tabIndex={-1}>
                Submit Request
              </button>
            </div>
            <div className="mockup-status">
              <span className="status-dot" />
              Team is working on it…
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
