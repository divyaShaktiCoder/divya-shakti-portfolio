import { Monitor, Code2, Trophy, GraduationCap, Layers, Bot, Clapperboard } from 'lucide-react'
import { ABOUT, ACHIEVEMENTS, EDUCATION, TOOLKIT } from '../data/site.js'
import { profile } from '../data/images.js'
import Reveal from './Reveal.jsx'
import Counter from './Counter.jsx'
import Carousel from './Carousel.jsx'
import SplitText from './SplitText.jsx'
import { useMedia } from '../hooks/useMedia.js'

const ICONS = { Layers, Bot, Clapperboard }

function Para({ parts }) {
  return (
    <p>
      {parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : <strong key={i}>{p.b}</strong>))}
    </p>
  )
}

function chunk(list, size) {
  const out = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

export default function About() {
  const phone = useMedia('(max-width: 760px)')
  const pages = chunk(ACHIEVEMENTS, phone ? 1 : 3)
  return (
    <section id="about" className="about" data-nav="about" aria-labelledby="about-title">
      <div className="about-hero">
        <div className="hero-ghost about-ghost" aria-hidden="true">
          <span>BEHIND</span>
          <span>THE BUILD</span>
        </div>
        <div className="container center-head">
          <Reveal>
            <span className="pill-label">
              <Monitor size={14} aria-hidden="true" /> {ABOUT.eyebrow}
            </span>
          </Reveal>
          <SplitText as="h2" id="about-title" className="about-name" text="About *Divya* Shakti" />
        </div>
      </div>

      <div className="container">
        <div className="bento">
          <Reveal className="bento-photo" data-tilt>
            <img src={profile} alt="Divya Shakti" width="720" height="747" loading="lazy" decoding="async" />
            {ABOUT.badges.map((b, i) => (
              <span key={b} className={`float-badge fb-${i + 1}`}>
                {b}
              </span>
            ))}
          </Reveal>

          <Reveal className="bento-intro card" delay={80}>
            <p className="about-lead">{ABOUT.lead}</p>
            {ABOUT.paragraphs.map((p, i) => (
              <Para key={i} parts={p} />
            ))}
          </Reveal>

          <div className="bento-tiles">
            {ABOUT.tiles.map((t, i) => (
              <Reveal key={t.label} delay={i * 70} className="tile">
                <strong>
                  <Counter value={t.value} suffix={t.suffix} decimals={t.decimals || 0} />
                </strong>
                <span>{t.label}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <Carousel className="focus-grid" label="focus area">
          {ABOUT.focus.map((f, i) => {
            const Icon = ICONS[f.icon]
            return (
              <Reveal key={f.title} delay={i * 90} className="focus-card" data-tilt>
                <span className="focus-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            )
          })}
        </Carousel>

        <div className="about-grid">
          <div>
            <Reveal as="h3" className="col-title">
              <Code2 size={22} aria-hidden="true" /> The Toolkit
            </Reveal>
            <Reveal className="card toolkit" delay={80}>
              <div className="toolkit-list">
                {TOOLKIT.map((g) => (
                  <div className="tool-group" key={g.group}>
                    <h4>{g.group}</h4>
                    <ul>
                      {g.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal as="h3" className="col-title">
              <Trophy size={22} aria-hidden="true" /> Achievements
            </Reveal>
            <Carousel always className="ach-pages" label="achievements">
              {pages.map((page, n) => (
                <div className="ach-page" key={n}>
                  {page.map((a) => (
                    <div className="card ach" key={a.title}>
                      <div>
                        <h4>{a.title}</h4>
                        <p>{a.org}</p>
                      </div>
                      <span className="badge">{a.badge}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <Reveal as="h3" className="col-title edu-title">
          <GraduationCap size={22} aria-hidden="true" /> Education
        </Reveal>
        <div className="edu-grid">
          {EDUCATION.map((e, i) => (
            <Reveal key={e.school} delay={i * 90} className="card edu">
              <p className="edu-period">{e.period}</p>
              <h4>{e.degree}</h4>
              <p className="edu-school">{e.school}</p>
              <p className="edu-note">{e.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
