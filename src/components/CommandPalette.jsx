import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, Compass, FolderGit2, Mail, ExternalLink } from 'lucide-react'
import { NAV, SOCIALS } from '../data/site.js'
import { PROJECTS } from '../data/projects.js'
import { scrollToId, lockScroll, openContact } from '../hooks/useLenis.js'

const FORMS = [
  { id: 'hello', label: 'Say hello', hint: 'Send a quick message' },
  { id: 'session', label: 'Book an online session', hint: 'Session request form' },
  { id: 'collab', label: 'Collaborate / brand promotion', hint: 'Collaboration form' },
]

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const items = useMemo(() => {
    const all = [
      ...NAV.map((n) => ({ group: 'Go to', icon: Compass, label: n.label, hint: 'Section', run: () => scrollToId(n.id) })),
      ...PROJECTS.map((p) => ({
        group: 'Projects',
        icon: FolderGit2,
        label: p.title,
        hint: p.subtitle,
        run: () => window.dispatchEvent(new CustomEvent('open-project', { detail: p.id })),
      })),
      ...FORMS.map((f) => ({
        group: 'Contact',
        icon: Mail,
        label: f.label,
        hint: f.hint,
        run: () => openContact(f.id),
      })),
      { group: 'Links', icon: ExternalLink, label: 'YouTube — HalChal Tej', hint: 'youtube.com', run: () => window.open(SOCIALS.youtube, '_blank', 'noopener') },
      { group: 'Links', icon: ExternalLink, label: 'GitHub — dscoder1', hint: 'github.com', run: () => window.open(SOCIALS.github, '_blank', 'noopener') },
      { group: 'Links', icon: ExternalLink, label: 'LinkedIn', hint: 'linkedin.com', run: () => window.open(SOCIALS.linkedin, '_blank', 'noopener') },
    ]
    const s = q.trim().toLowerCase()
    return (s ? all.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(s)) : all).slice(0, 14)
  }, [q])

  useEffect(() => {
    if (!open) return
    setQ('')
    setIdx(0)
    lockScroll(true)
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      clearTimeout(t)
      lockScroll(false)
    }
  }, [open])

  useEffect(() => setIdx(0), [q])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  if (!open) return null

  const run = (item) => {
    onClose()
    setTimeout(() => item.run(), 60)
  }

  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(items.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && items[idx]) { e.preventDefault(); run(items[idx]) }
  }

  let lastGroup = ''
  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
        <div className="palette-input">
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sections, projects, forms…"
            aria-label="Search"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette-list" ref={listRef} role="listbox">
          {items.length === 0 && <li className="palette-empty">No results for “{q}”</li>}
          {items.map((it, i) => {
            const header = it.group !== lastGroup ? it.group : null
            lastGroup = it.group
            const Icon = it.icon
            return (
              <li key={`${it.group}-${it.label}`} role="presentation">
                {header && <div className="palette-group">{header}</div>}
                <button
                  role="option"
                  aria-selected={i === idx}
                  className={`palette-item ${i === idx ? 'is-sel' : ''}`}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => run(it)}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="pi-label">{it.label}</span>
                  <span className="pi-hint">{it.hint}</span>
                  {i === idx && <CornerDownLeft size={14} aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
