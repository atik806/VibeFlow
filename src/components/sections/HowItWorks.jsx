import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/SectionHeader'

const STEPS = [
  {
    n: 1,
    title: 'Submit Your Request',
    body: 'Tell us what you need through our simple form. No browsing or hiring required.',
  },
  {
    n: 2,
    title: 'We Assign the Expert',
    body: 'Our team selects the right professional for your task and gets to work immediately.',
  },
  {
    n: 3,
    title: 'You Receive the Result',
    body: "Get your completed project delivered to your inbox. That's all there is to it.",
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  },
}

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="How It Works"
            title="Simple. Seamless. Stress-Free."
            subtitle="Three easy steps to get your project done. Just tell us what you need."
            center
          />
        </motion.div>
        
        <motion.div
          className="steps"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {STEPS.map((s) => (
            <motion.div key={s.n} className="step" variants={itemVariants}>
              <div className="step-number" style={{ boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)' }}>{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

