import { useEffect } from 'react'
import Lenis from 'lenis'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smooth scrolling (Lenis). Skipped for reduced-motion users and touch-native scroll stays native. */
export function useLenis() {
  useEffect(() => {
    if (reduced()) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: true,
    })
    window.__lenis = lenis
    return () => {
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}

/** Scroll to a section id (works with or without Lenis). */
export function scrollToId(id, offset = -72) {
  const el = document.getElementById(id)
  if (!el) return
  const l = window.__lenis
  if (l) l.scrollTo(el, { offset, duration: 1.3 })
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: id === 'home' ? 0 : y, behavior: reduced() ? 'auto' : 'smooth' })
  }
  history.replaceState(null, '', id === 'home' ? '#' : `#${id}`)
}

export function lockScroll(lock) {
  const l = window.__lenis
  if (lock) {
    l && l.stop()
    document.documentElement.style.overflow = 'hidden'
  } else {
    l && l.start()
    document.documentElement.style.overflow = ''
  }
}

/** Open one of the contact forms in a popup: 'hello' | 'session' | 'collab'. */
export function openContact(tab) {
  window.dispatchEvent(new CustomEvent('open-contact', { detail: tab }))
}
