import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Field'
import { useToast } from '../context/useToast'
import { env } from '../lib/env'
import { submitContactMessage } from '../lib/api/supabase'

export default function ContactPage() {
  const { openRequestModal } = useOutletContext()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  useSEO({
    title: 'Contact',
    description:
      'Get in touch with the Vibe Flow team. Email, phone, or submit a project brief directly.',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const id = await submitContactMessage(form)
    if (id) {
      toast.success('Message sent!', "We'll reach out within 24 hours.")
      setForm({ name: '', email: '', subject: '', message: '' })
    } else {
      toast.error('Failed to send', 'Please try again or email us directly.')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Let's talk.</h1>
        <p>Email us, call us, or submit a project brief — whichever feels right.</p>
      </div>

      <div className="container">
        <div className="contact-grid">
          <aside>
            <div className="contact-info">
              <h3>Reach out directly</h3>
              <p>
                We reply within 24 hours on business days. For urgent matters,
                mention "urgent" in the subject line.
              </p>

              <div className="contact-detail">
                <div className="contact-detail-icon"><Mail size={18} /></div>
                <div>
                  <h4>Email</h4>
                  <p><a href={`mailto:${env.VITE_CONTACT_EMAIL}`}>{env.VITE_CONTACT_EMAIL}</a></p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon"><Phone size={18} /></div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 010-0134</p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon"><MapPin size={18} /></div>
                <div>
                  <h4>Studio</h4>
                  <p>Remote-first · HQ in Austin, TX</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <Button variant="ghost" onClick={openRequestModal}>
                Or open the request modal →
              </Button>
            </div>
          </aside>

          <div className="card">
            <h3 style={{ marginBottom: 8 }}>Send us a message</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Fill in the form below and we'll get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                name="name"
                label="Your Name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="subject"
                label="Subject"
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                label="Message"
                placeholder="Tell us more about your inquiry…"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
              <Button variant="primary" block disabled={loading}>
                {loading ? <Loader size={16} className="spin" /> : <Send size={16} />}
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
