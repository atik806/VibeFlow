import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '../ui/Button'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { FileText, Settings, Clock } from 'lucide-react'

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

const typedStrings = [
  `<span style="color:#abb2bf">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:#dcdcaa">payments</span><span style="color:#abb2bf">:</span> <span style="color:#dcdcaa">true</span><span style="color:#abb2bf">,</span>`,
  `<span style="color:#abb2bf">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:#dcdcaa">analytics</span><span style="color:#abb2bf">:</span> <span style="color:#dcdcaa">true</span><span style="color:#abb2bf">,</span>`,
  `<span style="color:#abb2bf">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:#dcdcaa">multi-tenant</span><span style="color:#abb2bf">:</span> <span style="color:#dcdcaa">true</span><span style="color:#abb2bf">,</span>`,
  `<span style="color:#abb2bf">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:#dcdcaa">deploy</span><span style="color:#abb2bf">:</span> <span style="color:#6a9955">"vercel"</span><span style="color:#abb2bf">,</span>`,
]

function TerminalCard() {
  const typedRef = useRef(null)
  const codeRef = useRef(null)

  useEffect(() => {
    const el = codeRef.current
    if (!el) return
    const typed = new Typed('#typed-el', {
      strings: typedStrings,
      typeSpeed: 30,
      backSpeed: 20,
      backDelay: 1200,
      loop: true,
      cursorChar: '\u258A',
      contentType: 'html',
    })
    return () => typed.destroy()
  }, [])

  return (
    <div className="terminal-card">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
        </div>
        <div className="terminal-tabs">
          <div className="terminal-tab active">
            <FileText size={12} style={{marginRight:6}} />developer.tsx
          </div>
          <div className="terminal-tab">
            <Settings size={12} style={{marginRight:6}} />vibeflow.config.ts
          </div>
        </div>
      </div>
      <div className="terminal-body">
        <div className="terminal-line-numbers">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
        <div className="terminal-code" ref={codeRef}>
          <div className="line"><Syntax c="#c586c0">import</Syntax> <Syntax c="#569cd6">defineConfig</Syntax> <Syntax c="#c586c0">from</Syntax> <Syntax c="#6a9955">'vibeflow'</Syntax><Syntax c="#5c6370">;</Syntax></div>
          <div className="line"><Syntax c="#c586c0">import</Syntax> <Syntax c="#569cd6">type</Syntax> <Syntax c="#dcdcaa">{'{ Project }'}</Syntax> <Syntax c="#c586c0">from</Syntax> <Syntax c="#6a9955">'vibeflow/types'</Syntax><Syntax c="#5c6370">;</Syntax></div>
          <div className="line">&nbsp;</div>
          <div className="line"><Syntax c="#c586c0">const</Syntax> <Syntax c="#dcdcaa">config</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#569cd6">Project</Syntax> <Syntax c="#abb2bf">=</Syntax> <Syntax c="#c586c0">await</Syntax> <Syntax c="#dcdcaa">defineConfig</Syntax><Syntax c="#abb2bf">{'({'}</Syntax></div>
          <div className="line">&nbsp; <Syntax c="#dcdcaa">name</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#6a9955">"AI SaaS Platform"</Syntax><Syntax c="#abb2bf">,</Syntax></div>
          <div className="line">&nbsp; <Syntax c="#dcdcaa">stack</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#abb2bf">[</Syntax><Syntax c="#6a9955">"Next.js"</Syntax><Syntax c="#abb2bf">,</Syntax> <Syntax c="#6a9955">"Supabase"</Syntax><Syntax c="#abb2bf">,</Syntax> <Syntax c="#6a9955">"Tailwind"</Syntax><Syntax c="#abb2bf">],</Syntax></div>
          <div className="line">&nbsp; <Syntax c="#dcdcaa">ui</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#6a9955">"Premium"</Syntax><Syntax c="#abb2bf">,</Syntax></div>
          <div className="line">&nbsp; <Syntax c="#dcdcaa">features</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#abb2bf">{'{'}</Syntax></div>
          <div className="line">&nbsp;&nbsp;&nbsp;&nbsp;<Syntax c="#dcdcaa">auth</Syntax><Syntax c="#abb2bf">:</Syntax> <Syntax c="#dcdcaa">true</Syntax><Syntax c="#abb2bf">,</Syntax></div>
          <div className="line"><span id="typed-el" /></div>
          <div className="line"><Syntax c="#abb2bf">{'}'}</Syntax></div>
          <div className="line"><Syntax c="#abb2bf">{')'}</Syntax><Syntax c="#5c6370">;</Syntax></div>
        </div>
      </div>
      <div className="terminal-status">
        <div className="terminal-status-left">
          <div className="terminal-status-dot" />
          <span>Build ready <Syntax c="#e5c07b" bold>0</Syntax> <Syntax c="#abb2bf">errors</Syntax></span>
        </div>
        <div className="terminal-status-right">
          <span><Clock size={12} style={{marginRight:4}} /> 2.4s</span>
          <span>v2.0.1</span>
        </div>
      </div>
    </div>
  )
}

function Syntax({ c, bold, children }) {
  return <span style={{color: c, fontWeight: bold ? 700 : undefined}}>{children}</span>
}

export function Hero({ onPrimary }) {
  const shouldReduceMotion = useReducedMotion()

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
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
        >
          <motion.div variants={itemVariants} className="hero-badge-wrapper">
            <span className="badge badge-purple">
              <span className="badge-pulse" />
              VibeFlow v2.0 is Live
            </span>
          </motion.div>
          <motion.h1 variants={itemVariants}>
            Tell Us What You Need. <br />
            <span className="gradient-text">We'll Handle the Rest.</span>
          </motion.h1>
          <motion.p variants={itemVariants}>
            Submit a request and the VibeFlow expert team delivers. No browsing,
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
          className="hero-terminal-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 40 }}
        >
          <div className="hero-terminal">
            <div className="hero-terminal-glow" aria-hidden="true" />
            <TerminalCard />
            <div className="hero-stats-badge">
              <div className="hero-stats-badge-label">AI Performance</div>
              <div className="hero-stats-badge-value">+248%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
