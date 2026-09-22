import { useEffect, useRef, useState } from 'react'
import {
  MessageSquare, CalendarClock, Handshake, Send, Loader2, CheckCircle2, AlertCircle, Copy, Check, Mail, X, ArrowUpRight,
} from 'lucide-react'
import { SITE, SOCIALS } from '../data/site.js'
import { sendForm } from '../lib/sendForm.js'
import { lockScroll, openContact } from '../hooks/useLenis.js'
import { GithubIcon, LinkedinIcon, YoutubeIcon, TelegramIcon, InstagramIcon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import SplitText from './SplitText.jsx'

/**
 * Three separate forms, each opened in its own popup with only the basics.
 * Every submission is delivered as a structured email (see src/lib/sendForm.js).
 */
export const FORMS = {
  hello: {
    tab: 'Say hello',
    short: 'Hello',
    icon: MessageSquare,
    title: 'Say hello',
    desc: 'A quick message — questions, ideas or opportunities.',
    kind: 'General message',
    submit: 'Send message',
    fields: [
      { label: 'Name', type: 'text', required: true, autoComplete: 'name', half: true },
      { label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
      { label: 'Message', type: 'textarea', required: true, rows: 4, placeholder: 'How can I help?' },
    ],
  },
  session: {
    tab: 'Book a session',
    short: 'Session',
    icon: CalendarClock,
    title: 'Book an online session',
    desc: 'Tell me what you need and when. I’ll reply on email with the next steps.',
    kind: 'Online session request',
    submit: 'Request session',
    fields: [
      { label: 'Name', type: 'text', required: true, autoComplete: 'name', half: true },
      { label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
      { label: 'Phone / WhatsApp', type: 'tel', autoComplete: 'tel', half: true, optional: true },
      {
        label: 'Topic', type: 'select', required: true, half: true,
        options: [
          'Career guidance (BCA → MCA / TCS)',
          'n8n & Agentic AI automation',
          'MERN / full-stack development',
          'AI Agent', 'n8n Automation', 'Agentic AI', 'AI Application', 'API Automation', 'Startup MVP',
  'Consulting', 'Automation Optimization', 'AI Maintenance', 'Product Promotion', 'AI Session','Project Guidance', 'Agency Partnership',
          'Something else',
        ],
      },
      { label: 'Preferred date', type: 'date', required: true, half: true, min: 'today' },
      {
        label: 'Preferred time', type: 'select', required: true, half: true,
        options: ['Morning (9 AM – 12 PM)', 'Afternoon (12 PM – 4 PM)', 'Evening (4 PM – 9 PM)'],
      },
      { label: 'Anything I should know?', type: 'textarea', rows: 3, optional: true },
    ],
  },
  collab: {
    tab: 'Collaborate',
    short: 'Collab',
    icon: Handshake,
    title: 'Collaborate / brand promotion',
    desc: 'Brand deals, sponsored content, joint videos or an AI-automation project.',
    kind: 'Collaboration / brand promotion enquiry',
    submit: 'Send enquiry',
    fields: [
      { label: 'Name', type: 'text', required: true, autoComplete: 'name', half: true },
      { label: 'Email', type: 'email', required: true, autoComplete: 'email', half: true },
      { label: 'Brand / channel', type: 'text', required: true, autoComplete: 'organization' },
      {
        label: 'Enquiry type', type: 'select', required: true,
        options: [
          'Brand collaboration',
          'Product promotion',
          'Sponsored content',
          'YouTube collab / joint video',
          'Tech content for my channel',
          'AI agent / automation project',
          'Something else',
        ],
      },
      { label: 'Details', type: 'textarea', required: true, rows: 4, placeholder: 'What would you like to do together?' },
    ],
  },
}
const ORDER = ['hello', 'session', 'collab']
const todayISO = () => new Date().toISOString().slice(0, 10)
const idOf = (k, label) => `${k}-${label.toLowerCase().replace(/\W+/g, '-')}`

function Field({ f, id }) {
  const common = { id, name: f.label, required: f.required, placeholder: f.placeholder, autoComplete: f.autoComplete }
  return (
    <div className={`field ${f.half ? 'is-half' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <span aria-hidden="true"> *</span>}
        {f.optional && <em> (optional)</em>}
      </label>
      {f.type === 'select' ? (
        <select {...common} defaultValue="">
          <option value="" disabled>Select…</option>
          {f.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea {...common} rows={f.rows || 4} />
      ) : (
        <input {...common} type={f.type} min={f.min === 'today' ? todayISO() : undefined} />
      )}
    </div>
  )
}

function ContactModal({ kind, onClose, onSwitch }) {
  const cfg = FORMS[kind]
  const Icon = cfg.icon
  const [state, setState] = useState('idle') // idle | sending | done | error
  const [err, setErr] = useState('')
  const [fallback, setFallback] = useState('')
  const firstRef = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    lockScroll(true)
    const t = setTimeout(() => firstRef.current?.querySelector('input,select,textarea')?.focus(), 120)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      prev?.focus?.()
    }
  }, [onClose])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (fd.get('_honey')) return setState('done') // bot trap
    const fields = []
    for (const f of cfg.fields) {
      const v = String(fd.get(f.label) || '').trim()
      if (v) fields.push([f.label, v])
    }
    setState('sending')
    setErr('')
    try {
      await sendForm(cfg.kind, fields)
      setState('done')
    } catch (ex) {
      const body = fields.map(([k, v]) => `${k}: ${v}`).join('\n')
      setFallback(`mailto:${SITE.email}?subject=${encodeURIComponent(cfg.kind)}&body=${encodeURIComponent(body)}`)
      setErr(ex.message || 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel form-modal" role="dialog" aria-modal="true" aria-label={cfg.title} data-lenis-prevent>
        <button className="modal-close" onClick={onClose} aria-label="Close form">
          <X size={20} />
        </button>

        <div className="fm-switch" role="tablist" aria-label="Choose a form">
          {ORDER.map((k) => (
            <button key={k} role="tab" aria-selected={k === kind} className={k === kind ? 'is-on' : ''} onClick={() => onSwitch(k)}>
              {FORMS[k].short}
            </button>
          ))}
        </div>

        {state === 'done' ? (
          <div className="form-done" role="status">
            <svg className="tick" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="23" />
              <path d="M15 27l8 8 15-16" />
            </svg>
            <h4>Sent — thank you!</h4>
            <p>Your details are in my inbox. I’ll reply to the email you provided.</p>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="form" aria-label={cfg.title} ref={firstRef}>
            <header className="fm-head">
              <span className="fm-icon"><Icon size={22} aria-hidden="true" /></span>
              <div>
                <h3>{cfg.title}</h3>
                <p>{cfg.desc}</p>
              </div>
            </header>
            <div className="form-grid">
              {cfg.fields.map((f) => (
                <Field key={f.label} f={f} id={idOf(kind, f.label)} />
              ))}
            </div>
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
            <div className="form-foot">
              <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? (
                  <><Loader2 size={18} className="spin" aria-hidden="true" /> Sending…</>
                ) : (
                  <>{cfg.submit} <Send size={17} aria-hidden="true" /></>
                )}
              </button>
              <p className="form-note">Delivered straight to my inbox.</p>
            </div>
            {state === 'error' && (
              <div className="form-error" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <p>
                  {err} You can also <a href={fallback}>send it from your email app</a> or write to{' '}
                  <a href={SOCIALS.mail}>{SITE.email}</a>.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

/** Mounted once in <App/>: listens for `open-contact` events and shows the popup. */
export function ContactPopup() {
  const [kind, setKind] = useState(null)
  useEffect(() => {
    const h = (e) => FORMS[e.detail] && setKind(e.detail)
    window.addEventListener('open-contact', h)
    return () => window.removeEventListener('open-contact', h)
  }, [])
  if (!kind) return null
  return <ContactModal key={kind} kind={kind} onClose={() => setKind(null)} onSwitch={setKind} />
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = SOCIALS.mail
    }
  }

  return (
    <section id="contact" className="section contact" data-nav="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="center-head">
          <Reveal>
            <span className="pill-label">
              <Mail size={14} aria-hidden="true" /> Contact
            </span>
          </Reveal>
          <SplitText as="h2" id="contact-title" className="h2" text="Let’s build something *great*." />
          <Reveal as="p" className="lead-muted" delay={120}>
            Choose what you need — each option opens a short form that lands straight in my inbox.
          </Reveal>
        </div>

        <div className="contact-cards">
          {ORDER.map((k, i) => {
            const f = FORMS[k]
            const Icon = f.icon
            return (
              <Reveal key={k} delay={i * 90} className={`contact-card ${k === 'session' ? 'is-featured' : ''}`} data-tilt>
                <button onClick={() => openContact(k)} className="cc-hit" aria-label={`Open form: ${f.title}`}>
                  <span className="cc-icon"><Icon size={24} aria-hidden="true" /></span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className="cc-go">
                    Open form <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="direct" delay={100}>
          <div className="direct-left">
            <p className="direct-label">Prefer email?</p>
            <button className="email-copy" onClick={copy} aria-label="Copy email address">
              <span>{SITE.email}</span>
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            </button>
          </div>
          <div className="social-row">
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
            <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon /></a>
            <a href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><TelegramIcon /></a>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
