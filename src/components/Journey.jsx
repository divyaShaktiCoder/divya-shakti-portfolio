import { Briefcase, GraduationCap } from 'lucide-react'
import { JOURNEY } from '../data/site.js'
import Reveal from './Reveal.jsx'
import SplitText from './SplitText.jsx'

export default function Journey() {
  return (
    <section id="journey" className="section" data-nav="about" aria-labelledby="journey-title">
      <div className="container">
        <Reveal className="center-head">
          <SplitText as="h2" id="journey-title" className="h2" text="The Build *Log*" />
          <p className="lead-muted">My journey through education, internships and content creation.</p>
        </Reveal>

        <ol className="timeline">
          {JOURNEY.map((j, i) => {
            const Icon = j.type === 'edu' ? GraduationCap : Briefcase
            return (
              <li key={j.title + j.period} className={`tl-item ${i % 2 ? 'is-left' : 'is-right'}`}>
                <span className={`tl-node ${j.now ? 'is-now' : ''}`} aria-hidden="true">
                  {j.now ? 'Now' : <Icon size={16} />}
                </span>
                <Reveal className="tl-card" delay={60}>
                  <p className="tl-period">{j.period}</p>
                  <h3>{j.title}</h3>
                  <p className="tl-role">{j.role}</p>
                  <p className="tl-text">{j.text}</p>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
