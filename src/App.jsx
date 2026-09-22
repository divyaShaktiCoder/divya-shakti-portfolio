import { useEffect, useState } from 'react'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Projects from './components/Projects.jsx'
import YouTube from './components/YouTube.jsx'
import Arsenal from './components/Arsenal.jsx'
import Journey from './components/Journey.jsx'
import About from './components/About.jsx'
import Contact, { ContactPopup } from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { useLenis } from './hooks/useLenis.js'
import { useActiveSection } from './hooks/useActiveSection.js'

/** Subtle 3D tilt for any element with data-tilt (mouse devices only). */
function useTilt() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cur = null
    const reset = (el) => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    const move = (e) => {
      const t = e.target.closest?.('[data-tilt]') || null
      if (cur && cur !== t) reset(cur)
      cur = t
      if (!t) return
      const r = t.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      t.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`)
      t.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
    }
    const leave = () => cur && reset(cur)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])
}

export default function App() {
  useLenis()
  useTilt()
  const active = useActiveSection()
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Land on the right section when the URL has a hash (e.g. /#projects)
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72 })
    }, 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <a className="skip-link" href="#projects">Skip to content</a>
      <ScrollProgress />
      <Cursor />
      <Header active={active} onSearch={() => setPalette(true)} />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <YouTube />
        <Arsenal />
        <Journey />
        <About />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <ContactPopup />
    </>
  )
}
