import { useSEO } from '../hooks/useSEO'

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy',
    description: 'How Vibe Flow collects, stores, and protects your data.',
  })

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 780 }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <Section title="Overview">
          Vibe Flow is committed to protecting your privacy. This policy
          explains what information we collect, how we use it, and your rights
          regarding your data.
        </Section>

        <Section title="Data we collect">
          We collect only what is necessary to run our service: your name,
          email address, and the contents of any project brief you submit.
          We do not collect sensitive personal information.
        </Section>

        <Section title="How we use your data">
          Submissions are used exclusively to respond to your request. We do
          not sell or share your data with third parties for marketing.
        </Section>

        <Section title="Analytics">
          We use privacy-friendly analytics (no cookies, no personal data) to
          understand aggregate usage patterns.
        </Section>

        <Section title="Cookies" id="cookies">
          We use a minimal set of first-party cookies required for the
          service to function (session, CSRF). We do not use third-party
          tracking cookies.
        </Section>

        <Section title="Your rights">
          You can request deletion, correction, or export of your data at
          any time by emailing <a href="mailto:privacy@vibeflow.app">privacy@vibeflow.app</a>.
        </Section>

        <Section title="Contact">
          Questions? Email <a href="mailto:privacy@vibeflow.app">privacy@vibeflow.app</a>.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, id, children }) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</p>
    </section>
  )
}
