import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { HERO, SITE, STATS } from '../data/site.js'
import { profile } from '../data/images.js'
import { scrollToId, openContact } from '../hooks/useLenis.js'
import { YoutubeIcon } from './Icons.jsx'
import Counter from './Counter.jsx'
import SplitText from './SplitText.jsx'

const HeroScene = lazy(() => import('./HeroScene.jsx'))

const ROLES = ['Full Stack (MERN) Developer', 'Agentic AI & n8n Automation Builder', 'Tech Educator · HalChal Tej']

/** Types a role, holds, erases, moves to the next. Static for reduced-motion users. */
function useTypewriter(words) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, c = words[0].length, dir = -1, t
    const tick = () => {
      const word = words[w]
      c += dir
      setText(word.slice(0, c))
      if (dir === 1 && c === word.length) { dir = -1; t = setTimeout(tick, 1700); return }
      if (dir === -1 && c === 0) { w = (w + 1) % words.length; dir = 1; t = setTimeout(tick, 350); return }
      t = setTimeout(tick, dir === 1 ? 55 : 26)
    }
    t = setTimeout(tick, 2200)
    return () => clearTimeout(t)
  }, [words])
  return text
}

export default function Hero() {
  const [scene, setScene] = useState(false)
  const role = useTypewriter(ROLES)

  // Mount the 3D scene only after the page is interactive (keeps first paint fast).
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData
    if (calm) return
    const go = () => setScene(true)
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1600 }) : setTimeout(go, 800)
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  return (
    <section id="home" className="hero" data-nav="home">
      <div className="hero-glow" aria-hidden="true" />
      {scene && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}
      <div className="hero-ghost" aria-hidden="true">
        {HERO.ghost.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>

      <div className="container hero-inner">
        <p className="hero-eyebrow">Hi, I’m</p>
        <h1 className="hero-name">
          <SplitText text="*Divya* Shakti" immediate />
          <span className="sr-only"> — Portfolio | HalChal Tej: MERN Developer &amp; Agentic AI Builder</span>
        </h1>
        <p className="hero-role" aria-label="Full Stack (MERN) Developer, Agentic AI and n8n Automation Builder, Tech Educator">
          <span aria-hidden="true">{role}</span>
          <i className="caret" aria-hidden="true" />
        </p>
        <p className="sr-only">{SITE.tagline}</p>

        <div className="hero-figure">
          <img
            src={profile}
            alt="Divya Shakti"
            width="720"
            height="747"
            fetchpriority="high"
            decoding="async"
          />
        </div>

        <ul className="hero-pills">
          {HERO.pills.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToId('projects') }}>
            View Projects <ArrowRight size={18} aria-hidden="true" />
          </a>
          <button className="btn btn-ghost" onClick={() => openContact('session')}>
            <CalendarClock size={18} aria-hidden="true" /> Book a Session
          </button>
          <a href="#youtube" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); scrollToId('youtube') }}>
            <YoutubeIcon width={18} height={18} /> YouTube
          </a>
        </div>

        <dl className="hero-stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <dt className="stat-value">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </dt>
              <dd className="stat-label">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
