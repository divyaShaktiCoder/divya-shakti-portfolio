import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import 'lenis/dist/lenis.css'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

/* ── Preloader hand-off ─────────────────────────────────────
   The spinner lives in index.html so it shows instantly. Once React has painted,
   the hero image and fonts are ready, we fade it out and start the entrance animations. */
const boot = document.getElementById('boot')
const t0 = performance.now()
let finished = false

const finish = () => {
  if (finished) return
  finished = true
  const wait = Math.max(0, 900 - (performance.now() - t0)) // show the loader at least ~0.9s so it never flashes
  setTimeout(() => {
    document.documentElement.classList.add('is-ready')
    window.dispatchEvent(new Event('app-ready'))
    boot?.classList.add('boot-out')
    setTimeout(() => boot?.remove(), 900)
  }, wait)
}

const ready = async () => {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  const img = document.querySelector('.hero-figure img')
  if (img && !img.complete) await new Promise((r) => { img.onload = img.onerror = r })
  if (document.fonts?.ready) await document.fonts.ready
}
Promise.race([ready(), new Promise((r) => setTimeout(r, 3500))]).then(finish)
setTimeout(finish, 5000) // absolute safety net
