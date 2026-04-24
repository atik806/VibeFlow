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

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <SectionHeader
          label="How It Works"
          title="Simple. Seamless. Stress-Free."
          subtitle="Three easy steps to get your project done. Just tell us what you need."
          center
        />
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.n} className="step">
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
