import { ArrowUp, ArrowUpRight, CalendarClock, Mail } from 'lucide-react'
import { NAV, SITE, SOCIALS } from '../data/site.js'
import { avatar } from '../data/images.js'
import { scrollToId, openContact } from '../hooks/useLenis.js'
import { GithubIcon, LinkedinIcon, YoutubeIcon, TelegramIcon, InstagramIcon } from './Icons.jsx'

const CONNECT = [
  { label: 'YouTube', sub: '@halchaltej', href: SOCIALS.youtube, Icon: YoutubeIcon },
  { label: 'GitHub', sub: 'dscoder1', href: SOCIALS.github, Icon: GithubIcon },
  { label: 'LinkedIn', sub: 'divyashakti510', href: SOCIALS.linkedin, Icon: LinkedinIcon },
  { label: 'Telegram', sub: 'HalChalTej', href: SOCIALS.telegram, Icon: TelegramIcon },
  { label: 'Instagram', sub: '@halchaltej', href: SOCIALS.instagram, Icon: InstagramIcon },
]
const WORK = [
  ['projects', 'Projects'],
  ['youtube', 'YouTube videos'],
  ['arsenal', 'Technical arsenal'],
  ['journey', 'Build log'],
  ['about', 'Achievements'],
]

export default function Footer() {
  const go = (e, id) => {
    e.preventDefault()
    scrollToId(id)
  }
  return (
    <footer className="footer" data-nav="contact">
      <div className="footer-ghost" aria-hidden="true">DIVYA</div>

      <div className="container">
        <div className="footer-cta">
          <div>
            <p className="footer-cta-title">Have an idea, a session or a collaboration in mind?</p>
            <p className="footer-cta-sub">It takes a minute — the form goes straight to my inbox.</p>
          </div>
          <button className="btn btn-primary" onClick={() => openContact('session')}>
            <CalendarClock size={18} aria-hidden="true" /> Book a Session
          </button>
        </div>

        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-id">
              <img src={avatar} alt="Divya Shakti" width="60" height="60" loading="lazy" />
              <div>
                <p className="footer-name">{SITE.name}</p>
                <p className="footer-role">Full Stack & AI Developer</p>
              </div>
            </div>
            <p className="footer-about">
              MERN developer, Agentic AI and n8n automation builder, and the creator behind the HalChal Tej YouTube channel.
            </p>
            <a className="footer-mail" href={SOCIALS.mail}>
              <Mail size={16} aria-hidden="true" /> {SITE.email}
            </a>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <h4>Navigate</h4>
            {NAV.map((n) => (
              <a key={n.id} className="flink" href={`#${n.id}`} onClick={(e) => go(e, n.id)}>{n.label}</a>
            ))}
          </nav>

          <div className="footer-col">
            <h4>Explore</h4>
            {WORK.map(([id, label]) => (
              <a key={id} className="flink" href={`#${id}`} onClick={(e) => go(e, id)}>{label}</a>
            ))}
            <a className="flink" href="/halchal-tej/">HalChal Tej channel page</a>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <button className="flink" onClick={() => openContact('hello')}>Say hello</button>
            <button className="flink" onClick={() => openContact('session')}>Book a session</button>
            <button className="flink" onClick={() => openContact('collab')}>Collaborate</button>
            <a className="flink" href={SOCIALS.mail}>Email me</a>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            {CONNECT.map(({ label, sub, href, Icon }) => (
              <a key={label} className="flink social-link" href={href} target="_blank" rel="noopener noreferrer">
                <Icon width={16} height={16} />
                <span>{label}</span>
                <small>{sub}</small>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {SITE.name}. Engineered with precision.</p>
        <p className="status">
          <span className="status-dot" aria-hidden="true" /> Open to collaborations
        </p>
        <button className="to-top" onClick={() => scrollToId('home')} aria-label="Back to top">
          Top <ArrowUp size={14} aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
