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

        <Section title="Introduction">
          These Terms of Service ("Terms") govern your use of the Vibe Flow
          website and services. Vibe Flow ("we", "our", "us") is operated
          from Bangladesh. By accessing our website or submitting a project
          request, you agree to be bound by these Terms. If you do not
          agree, please do not use our services.
        </Section>

        <Section title="Services description">
          Vibe Flow is a platform that connects clients with our in-house
          team for design, development, AI, and writing services. We accept
          project requests through our website, provide estimates, and
          deliver completed work as agreed in writing with each client.
          We also provide AI-powered tools that are available to registered
          users.
        </Section>

        <Section title="Account registration">
          When you create an account, you must provide accurate and complete
          information. You are responsible for maintaining the
          confidentiality of your login credentials. You must notify us
          immediately of any unauthorised use of your account. We reserve
          the right to suspend or terminate accounts for violations of
          these Terms.
        </Section>

        <Section title="Project requests and quotes">
          Submitting a project request does not constitute a binding
          agreement. We will review your request and provide a quote and
          timeline. Work begins only after you accept the quote in writing.
          We reserve the right to decline any project request.
        </Section>

        <Section title="Payment terms">
          All prices are quoted in Bangladeshi Taka (BDT) unless otherwise
          stated. Payment terms (deposit, milestones, or full payment) are
          agreed in writing before work begins. Invoices are due within
          14 days of receipt unless otherwise agreed. Late payments may
          result in work being paused until full payment is received.
        </Section>

        <Section title="Intellectual property">
          Upon full payment, you receive full ownership of all final
          deliverables produced specifically for your project, including
          source files, design assets, and code. We retain the right to
          display completed work in our portfolio unless agreed otherwise
          in writing. Pre-existing tools, libraries, and frameworks used
          in your project remain under their original licenses.
        </Section>

        <Section title="Revisions and refunds">
          Each engagement includes the number of revisions specified in
          the agreed scope. If a final deliverable does not materially
          conform to the agreed scope, we will revise it at no additional
          cost. If we cannot resolve the issue after reasonable attempts,
          we will refund the amount paid for that deliverable. Refunds
          exclude deposit amounts already spent on third-party services
          or assets.
        </Section>

        <Section title="Confidentiality">
          We treat all project briefs, source materials, communications,
          and deliverables as confidential by default. We will not share
          your project details with third parties except as necessary to
          deliver the service (e.g., hosting providers) or as required by
          law. This obligation survives termination of our engagement.
        </Section>

        <Section title="User conduct">
          You agree not to:
        </Section>
        <SubList
          items={[
            'Submit false, misleading, or unlawful project requests.',
            'Attempt to gain unauthorised access to other accounts or our systems.',
            'Use our AI tools for generating harmful, illegal, or abusive content.',
            'Reverse-engineer, scrape, or disrupt our website or services.',
          ]}
        />

        <Section title="Limitation of liability">
          Vibe Flow's total liability for any claim arising from or related
          to our services is limited to the amount paid by you for the
          specific engagement giving rise to the claim. In no event shall
          we be liable for indirect, incidental, or consequential damages,
          including loss of profits or business interruption.
        </Section>

        <Section title="Termination">
          Either party may terminate a project engagement as specified in
          the agreed scope. We may suspend or terminate your access to
          our website and account if you violate these Terms. Upon
          termination, you must pay for all work completed up to the
          date of termination.
        </Section>

        <Section title="Governing law">
          These Terms are governed by the laws of Bangladesh. Any disputes
          shall be resolved through good-faith negotiations first. If
          mediation fails, disputes shall be resolved in the courts of
          Dhaka, Bangladesh.
        </Section>

        <Section title="Changes to these terms">
          We may update these Terms from time to time. Material changes
          will be communicated via our website or by email. Continued
          use of our services after changes take effect constitutes
          acceptance of the updated Terms.
        </Section>

        <Section title="Contact">
          For questions about these Terms, contact us at{' '}
          <a href="mailto:legal@vibeflow.app">legal@vibeflow.app</a>.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{title}</h2>
      {typeof children === 'string' ? (
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</p>
      ) : (
        children
      )}
    </section>
  )
}

function SubList({ items }) {
  return (
    <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 20, margin: '0 0 32px 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}
