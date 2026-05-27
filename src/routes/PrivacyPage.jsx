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

        <Section title="Introduction">
          Vibe Flow ("we", "our", "us") operates the website at vibeflow.app.
          This Privacy Policy explains how we collect, store, use, and protect
          your personal data when you use our services. We are based in
          Bangladesh and comply with applicable data protection laws.
          By using Vibe Flow, you agree to the practices described in this policy.
        </Section>

        <Section title="What data we collect">
          We collect only the data necessary to provide our service:
        </Section>
        <SubList
          items={[
            'Name and email address — when you submit a project request, sign up for an account, or use the contact form.',
            'Project details — service category, subcategory, description, and budget range you provide in your request.',
            'Account credentials — if you register, we store your email and a securely hashed password via Supabase Auth.',
            'Contact messages — when you use the contact form, we store your name, email, subject, and message.',
            'Usage data — anonymised page view counts for aggregate analytics. No personal identifiers are tracked.',
          ]}
        />

        <Section title="How we collect your data">
          You provide data directly by filling in forms on our website
          (project request form, sign-up form, contact form). Usage
          analytics are collected automatically through our self-hosted
          tracking system — no third-party analytics scripts are used.
        </Section>

        <Section title="How we use your data">
          Your data is used exclusively to:
        </Section>
        <SubList
          items={[
            'Respond to your project requests and inquiries.',
            'Manage your account and provide access to authenticated features (dashboard, AI tools).',
            'Improve our services based on aggregate usage patterns.',
            'Communicate with you about your requests or account (we do not send marketing emails).',
          ]}
        />

        <Section title="Data sharing">
          We do not sell, rent, or trade your personal data. We share data
          only with trusted service providers who enable our core operations:
        </Section>
        <SubList
          items={[
            'Supabase — database hosting, authentication, and file storage. Data is stored on Supabase servers. See <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">Supabase Privacy Policy</a>.',
            'Vercel — hosting provider for the website. See <a href="https://vercel.com/legal/privacy" target="_blank" rel="noreferrer">Vercel Privacy Policy</a>.',
          ]}
        />

        <Section title="Data retention">
          We retain your personal data for as long as your account is active
          or as needed to provide our service. Project request records are
          kept for reference. If you delete your account, associated data
          is removed within 30 days. Contact form messages are retained
          until you request deletion.
        </Section>

        <Section title="Cookies" id="cookies">
          We use a minimal set of cookies to keep the service running:
        </Section>
        <SubList
          items={[
            'Session cookie — required to keep you logged in (expires on browser close).',
            'CSRF token — prevents cross-site request forgery attacks.',
            'No third-party tracking, advertising, or analytics cookies are used.',
            'You can disable cookies in your browser settings, but some features may not work correctly.',
          ]}
        />

        <Section title="Your rights">
          You have the right to:
        </Section>
        <SubList
          items={[
            'Access the personal data we hold about you.',
            'Request correction of inaccurate or incomplete data.',
            'Request deletion of your data (subject to legal obligations).',
            'Export your data in a portable format.',
            'Withdraw consent for data processing where applicable.',
          ]}
        />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8 }}>
          To exercise any of these rights, email{' '}
          <a href="mailto:privacy@vibeflow.app">privacy@vibeflow.app</a>.
          We will respond within 30 days.
        </p>

        <Section title="Security">
          We implement industry-standard security measures including
          encryption in transit (TLS), hashed password storage via Supabase
          Auth, and regular security reviews. However, no online service
          can guarantee absolute security.
        </Section>

        <Section title="Changes to this policy">
          We may update this Privacy Policy from time to time. Material
          changes will be notified via a notice on our website or by email.
          Continued use after changes constitutes acceptance of the
          updated policy.
        </Section>

        <Section title="Contact">
          For questions, concerns, or data requests, contact us at{' '}
          <a href="mailto:privacy@vibeflow.app">privacy@vibeflow.app</a>.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, id, children }) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
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
    <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  )
}
