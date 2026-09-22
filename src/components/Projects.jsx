import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Gamepad2, ArrowUpRight, X, ChevronLeft, ChevronRight, ExternalLink, Check,
  Sparkles, Store, Sprout, MapPinned, HeartHandshake, FileSearch, School, Workflow, Send, Bot, BookOpen,
} from 'lucide-react'
import { FILTERS, PROJECTS } from '../data/projects.js'
import { projectImage } from '../data/images.js'
import { lockScroll } from '../hooks/useLenis.js'
import { GithubIcon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import Carousel from './Carousel.jsx'
import SplitText from './SplitText.jsx'

const ICONS = { Sparkles, Store, Sprout, MapPinned, HeartHandshake, FileSearch, School, Workflow, Send, Bot, BookOpen }
const FEATURED_COUNT = 6

function ArtCover({ p, large = false }) {
  const Icon = ICONS[p.icon] || Sparkles
  const word = p.title.split(/[\s—:–-]/)[0].toUpperCase()
  return (
    <div className={`art-cover ${large ? 'is-large' : ''}`} style={{ '--h': p.hue ?? 268 }} aria-hidden="true">
      <span className="art-ghost">{word}</span>
      <span className="art-icon">
        <Icon size={large ? 64 : 46} strokeWidth={1.3} />
      </span>
    </div>
  )
}

function LinkButtons({ links, className = '' }) {
  if (!links?.length) return null
  return (
    <div className={`project-links ${className}`}>
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-chip">
          {l.kind === 'github' ? <GithubIcon width={14} height={14} /> : <ExternalLink size={14} aria-hidden="true" />}
          {l.label}
        </a>
      ))}
    </div>
  )
}

function ProjectCard({ p, onOpen, delay }) {
  const cover = p.images?.[0] ? projectImage(p.images[0]) : null
  return (
    <Reveal as="article" delay={delay} className="project-card" data-tilt>
      <div className="project-cover">
        {cover ? (
          <img src={cover} alt={`${p.title} screenshot`} width="1100" height="520" loading="lazy" decoding="async" />
        ) : (
          <ArtCover p={p} />
        )}
      </div>
      <div className="project-body">
        <p className="project-label">
          <span className={`dot ${p.win ? 'is-win' : ''}`} aria-hidden="true" />
          {p.label}
        </p>
        <h3 className="project-title">
          <button className="stretched" onClick={() => onOpen(p.id)} aria-label={`View details: ${p.title}`}>
            {p.title}
          </button>
        </h3>
        <p className="project-summary">{p.summary}</p>
        <ul className="tags" aria-label="Technologies">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="project-foot">
          <LinkButtons links={p.links} />
          <span className="project-more" aria-hidden="true">
            Details <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Reveal>
  )
}

function ProjectModal({ project, onClose }) {
  const [i, setI] = useState(0)
  const closeRef = useRef(null)
  const imgs = (project.images || []).map(projectImage)
  const many = imgs.length > 1

  useEffect(() => {
    const prev = document.activeElement
    lockScroll(true)
    closeRef.current?.focus()
    return () => {
      lockScroll(false)
      prev?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (many && e.key === 'ArrowRight') setI((n) => (n + 1) % imgs.length)
      if (many && e.key === 'ArrowLeft') setI((n) => (n - 1 + imgs.length) % imgs.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [many, imgs.length, onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label={project.title} data-lenis-prevent>
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close project details">
          <X size={20} />
        </button>

        <div className="modal-media">
          {imgs.length ? (
            <>
              <div className="modal-stage">
                <img key={i} src={imgs[i]} alt={`${project.title} — screenshot ${i + 1}`} width="1100" height="520" />
                {many && (
                  <>
                    <button className="stage-btn prev" onClick={() => setI((n) => (n - 1 + imgs.length) % imgs.length)} aria-label="Previous screenshot">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="stage-btn next" onClick={() => setI((n) => (n + 1) % imgs.length)} aria-label="Next screenshot">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {many && (
                <div className="modal-thumbs">
                  {imgs.map((src, n) => (
                    <button key={src} className={n === i ? 'is-on' : ''} onClick={() => setI(n)} aria-label={`Show screenshot ${n + 1}`}>
                      <img src={src} alt="" width="110" height="52" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <ArtCover p={project} large />
          )}
        </div>

        <div className="modal-info">
          <p className="project-label">
            <span className={`dot ${project.win ? 'is-win' : ''}`} aria-hidden="true" />
            {project.label}
          </p>
          <h3>{project.title}</h3>
          <p className="modal-sub">{project.subtitle}</p>
          {project.note && <p className="modal-note">{project.note}</p>}
          <p className="modal-summary">{project.summary}</p>
          <ul className="modal-list">
            {project.highlights.map((h) => (
              <li key={h}>
                <Check size={16} aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <ul className="tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {project.links?.length > 0 && (
            <div className="modal-actions">
              {project.links.map((l, n) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${n === 0 ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                >
                  {l.kind === 'github' ? <GithubIcon width={16} height={16} /> : <ExternalLink size={16} aria-hidden="true" />}
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [openId, setOpenId] = useState(null)

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.groups.includes(filter))),
    [filter]
  )
  const collapsible = filter === 'all' && filtered.length > FEATURED_COUNT
  const visible = collapsible && !showAll ? filtered.slice(0, FEATURED_COUNT) : filtered
  const open = PROJECTS.find((p) => p.id === openId)

  useEffect(() => {
    const h = (e) => setOpenId(e.detail)
    window.addEventListener('open-project', h)
    return () => window.removeEventListener('open-project', h)
  }, [])

  return (
    <section id="projects" className="section" data-nav="projects" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="pill-label">
              <Gamepad2 size={14} aria-hidden="true" /> Showcase
            </span>
            <SplitText as="h2" id="projects-title" className="h2" text="Featured *Projects*" />
          </div>
          {collapsible && (
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
              {showAll ? 'Show Featured' : `View All ${filtered.length} Projects`}
            </button>
          )}
        </Reveal>

        <Reveal className="filters" role="tablist" aria-label="Filter projects" delay={80}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`filter ${filter === f.id ? 'is-on' : ''}`}
              onClick={() => { setFilter(f.id); setShowAll(false) }}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <Carousel key={filter} className="project-grid" label="project">
          {visible.map((p, n) => (
            <ProjectCard key={p.id} p={p} onOpen={setOpenId} delay={(n % 3) * 90} />
          ))}
        </Carousel>
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpenId(null)} />}
    </section>
  )
}
