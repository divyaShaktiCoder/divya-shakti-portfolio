import { useEffect, useState } from 'react'
import { Search, Menu, X, CalendarClock, Mail } from 'lucide-react'
import { NAV, SITE, SOCIALS } from '../data/site.js'
import { scrollToId, lockScroll, openContact } from '../hooks/useLenis.js'
import { GithubIcon, LinkedinIcon, YoutubeIcon, TelegramIcon, InstagramIcon } from './Icons.jsx'

export default function Header({ active, onSearch }) {
  const [open, setOpen] = useState(false)
  const [mac, setMac] = useState(true)

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent))
  }, [])

  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    const wasOpen = open
    setOpen(false)
    setTimeout(() => scrollToId(id), wasOpen ? 80 : 0)
  }
  const book = () => {
    setOpen(false)
    setTimeout(() => openContact('session'), open ? 80 : 0)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="logo" onClick={(e) => go(e, 'home')} aria-label={`${SITE.name} — home`}>
          {SITE.short}.
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? 'is-active' : ''}
              aria-current={active === n.id ? 'true' : undefined}
              onClick={(e) => go(e, n.id)}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="search-btn" onClick={onSearch} aria-label="Search the site">
            <Search size={18} aria-hidden="true" />
            <span className="search-text">Search…</span>
            <kbd>{mac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <button className="btn btn-primary btn-sm header-cta" onClick={book}>
            <CalendarClock size={16} aria-hidden="true" /> Book a Session
          </button>
          <button
            className="burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              style={{ '--i': i }}
              className={active === n.id ? 'is-active' : ''}
              tabIndex={open ? 0 : -1}
              onClick={(e) => go(e, n.id)}
            >
              <span className="mn-index">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mobile-nav-foot" style={{ '--i': NAV.length }}>
          <button className="btn btn-primary" tabIndex={open ? 0 : -1} onClick={book}>
            <CalendarClock size={18} aria-hidden="true" /> Book a Session
          </button>
          <a className="mn-mail" href={SOCIALS.mail} tabIndex={open ? 0 : -1}>
            <Mail size={16} aria-hidden="true" /> {SITE.email}
          </a>
          <div className="social-row">
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" tabIndex={open ? 0 : -1}><GithubIcon /></a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" tabIndex={open ? 0 : -1}><LinkedinIcon /></a>
            <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" tabIndex={open ? 0 : -1}><YoutubeIcon /></a>
            <a href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" tabIndex={open ? 0 : -1}><TelegramIcon /></a>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" tabIndex={open ? 0 : -1}><InstagramIcon /></a>
          </div>
        </div>
      </div>
    </header>
  )
}
