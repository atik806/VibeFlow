import { useSEO } from '../hooks/useSEO'

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service',
    description: 'The terms under which Vibe Flow delivers services.',
  })

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 780 }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <Section title="Agreement">
          By submitting a request, you agree to these terms. Vibe Flow will
          deliver the work agreed in writing within the timeline we confirm
          upon accepting the project.
        </Section>

        <Section title="Payment and invoicing">
          Payment terms are shared before any work begins. Invoices are due
          within 14 days unless otherwise agreed in writing.
        </Section>

        <Section title="Intellectual property">
          Upon full payment, you receive full ownership of all final
          deliverables produced for you, including source files.
        </Section>

        <Section title="Revisions and refunds">
          Each plan includes the revisions described on the pricing page.
          If a final deliverable does not match the agreed scope we will
          either revise it or refund the engagement.
        </Section>

        <Section title="Confidentiality">
          We treat all briefs, source material, and deliverables as
          confidential by default.
        </Section>

        <Section title="Limitation of liability">
          Vibe Flow's liability is limited to the amount paid for the
          engagement in question.
        </Section>

        <Section title="Contact">
          Questions? Email <a href="mailto:legal@vibeflow.app">legal@vibeflow.app</a>.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</p>
    </section>
  )
}
