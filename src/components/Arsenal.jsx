import { Code2 } from 'lucide-react'
import { ARSENAL } from '../data/site.js'
import { PROJECTS } from '../data/projects.js'
import Reveal from './Reveal.jsx'
import SplitText from './SplitText.jsx'

const nexora = PROJECTS.find((p) => p.id === 'nexora')

export default function Arsenal() {
  return (
    <section id="arsenal" className="section" data-nav="about" aria-labelledby="arsenal-title">
      <div className="container arsenal">
        <div className="arsenal-left">
          <Reveal>
            <span className="pill-label">
              <Code2 size={14} aria-hidden="true" /> Capabilities
            </span>
            <SplitText as="h2" id="arsenal-title" className="h2" text="Technical *Arsenal*" />
            <p className="lead-muted">
              My actively used skill set — full-stack MERN engineering combined with Agentic AI, Generative AI and workflow
              automation.
            </p>
          </Reveal>
          <ul className="chips" aria-label="Skills">
            {ARSENAL.map((s, i) => (
              <Reveal as="li" key={s} delay={(i % 6) * 40} className="chip">
                <span className="chip-dot" aria-hidden="true" />
                {s}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="feature-panel" delay={120}>
          <span className="status-pill">
            <span className="dot is-win" aria-hidden="true" /> Featured build
          </span>
          <h3>{nexora.title}</h3>
          <p>{nexora.summary}</p>
          <ul className="bars">
            {nexora.tags.slice(0, 3).map((t) => (
              <li key={t}>
                <div className="bar-row">
                  <span>{t}</span>
                  <span>In use</span>
                </div>
                <div className="bar">
                  <i />
                </div>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => window.dispatchEvent(new CustomEvent('open-project', { detail: 'nexora' }))}
          >
            View Project Details
          </button>
        </Reveal>
      </div>
    </section>
  )
}
