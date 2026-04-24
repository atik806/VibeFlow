import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette,
  Code2,
  FileText,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Calendar,
  Gauge,
  Phone,
  Info,
} from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

const TYPES = [
  { id: 'design', label: 'Design', icon: Palette, range: [300, 2000] },
  { id: 'development', label: 'Development', icon: Code2, range: [800, 8000] },
  { id: 'writing', label: 'Writing', icon: FileText, range: [150, 1500] },
  { id: 'tech', label: 'AI & Tech', icon: BrainCircuit, range: [1000, 15000] },
  { id: 'other', label: 'Other', icon: Sparkles, range: [200, 3000] },
]

const COMPLEXITY = [
  { id: 'simple', label: 'Simple', desc: 'Single deliverable', mult: 1.0 },
  { id: 'moderate', label: 'Moderate', desc: 'Multi-component', mult: 1.6 },
  { id: 'complex', label: 'Complex', desc: 'Multi-phase build', mult: 2.5 },
  { id: 'enterprise', label: 'Enterprise', desc: 'Strategic engagement', mult: 4.0 },
]

const TIMELINE = [
  { id: 'rush', label: 'Rush', sub: 'Under 1 week', mult: 1.5 },
  { id: 'standard', label: 'Standard', sub: '2 – 4 weeks', mult: 1.0 },
  { id: 'flexible', label: 'Flexible', sub: 'No hard deadline', mult: 0.85 },
]

function snap(n) {
  // Round to nearest $50 for clean display
  return Math.round(n / 50) * 50
}

function format(n) {
  return '$' + n.toLocaleString('en-US')
}

function OptionGroup({ label, icon: Icon, options, value, onChange, renderOption }) {
  return (
    <div className="estimator-group">
      <div className="estimator-group-label">
        <Icon size={14} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="estimator-options">
        {options.map((opt) => {
          const active = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={`estimator-option ${active ? 'is-active' : ''}`}
            >
              {renderOption(opt, active)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProjectEstimator({ onRequestQuote }) {
  const [typeId, setTypeId] = useState('development')
  const [complexityId, setComplexityId] = useState('moderate')
  const [timelineId, setTimelineId] = useState('standard')

  const { type, complexity, timeline, minPrice, maxPrice } = useMemo(() => {
    const t = TYPES.find((x) => x.id === typeId) || TYPES[0]
    const c = COMPLEXITY.find((x) => x.id === complexityId) || COMPLEXITY[0]
    const tl = TIMELINE.find((x) => x.id === timelineId) || TIMELINE[0]
    return {
      type: t,
      complexity: c,
      timeline: tl,
      minPrice: snap(t.range[0] * c.mult * tl.mult),
      maxPrice: snap(t.range[1] * c.mult * tl.mult),
    }
  }, [typeId, complexityId, timelineId])

  return (
    <section className="estimator" id="estimator" aria-labelledby="estimator-title">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="Project Estimator"
            title="Get a ballpark in seconds."
            subtitle="Every project is priced individually after a discovery call — this estimator gives you an honest starting range so you know what to expect."
            center
          />
        </motion.div>

        <motion.div
          className="estimator-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="estimator-bg" aria-hidden="true" />

          <div className="estimator-grid">
            <div className="estimator-controls" role="group" aria-labelledby="estimator-title">
              <h3 id="estimator-title" className="sr-only">
                Configure your project
              </h3>

              <OptionGroup
                label="Project Type"
                icon={Sparkles}
                options={TYPES}
                value={typeId}
                onChange={setTypeId}
                renderOption={(opt) => (
                  <>
                    <opt.icon size={18} aria-hidden="true" />
                    <span>{opt.label}</span>
                  </>
                )}
              />

              <OptionGroup
                label="Scope & Complexity"
                icon={Gauge}
                options={COMPLEXITY}
                value={complexityId}
                onChange={setComplexityId}
                renderOption={(opt) => (
                  <div className="estimator-option-stack">
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                  </div>
                )}
              />

              <OptionGroup
                label="Timeline"
                icon={Calendar}
                options={TIMELINE}
                value={timelineId}
                onChange={setTimelineId}
                renderOption={(opt) => (
                  <div className="estimator-option-stack">
                    <strong>{opt.label}</strong>
                    <span>{opt.sub}</span>
                  </div>
                )}
              />
            </div>

            <div className="estimator-quote">
              <p className="estimator-quote-label">Estimated range</p>

              <div className="estimator-quote-price" aria-live="polite">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={`${minPrice}-${maxPrice}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.35 }}
                    className="estimator-price-range"
                  >
                    {format(minPrice)}
                    <em>–</em>
                    {format(maxPrice)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <ul className="estimator-summary">
                <li>
                  <span>Type</span>
                  <strong>{type.label}</strong>
                </li>
                <li>
                  <span>Scope</span>
                  <strong>{complexity.label}</strong>
                </li>
                <li>
                  <span>Timeline</span>
                  <strong>{timeline.label}</strong>
                </li>
              </ul>

              <div className="estimator-disclaimer">
                <Info size={14} aria-hidden="true" />
                <p>
                  Estimates only. Your final quote is fixed after a free
                  15-minute discovery call — no obligation.
                </p>
              </div>

              <div className="estimator-actions">
                <Button
                  variant="primary"
                  block
                  onClick={() => onRequestQuote?.({ type, complexity, timeline })}
                >
                  Get Exact Quote
                  <ArrowRight size={16} style={{ marginLeft: 6 }} />
                </Button>
                <a
                  href="/contact"
                  className="btn btn-ghost btn-block estimator-call-link"
                >
                  <Phone size={15} aria-hidden="true" />
                  <span>Book a Discovery Call</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
