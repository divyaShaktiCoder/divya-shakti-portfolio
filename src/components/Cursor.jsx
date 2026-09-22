import { useEffect, useRef } from 'react'

/**
 * Custom "focus reticle" cursor: four corner brackets + a centre dot.
 * Trails the pointer smoothly, tilts with horizontal speed, expands over links/buttons,
 * shrinks over form fields. Only mounted for real mouse/trackpad devices.
 */
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const el = ref.current
    const root = document.documentElement
    root.classList.add('has-cursor')

    let x = -100, y = -100, tx = -100, ty = -100, rot = 0, raf = 0, shown = false
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

    const loop = () => {
      const dx = tx - x
      const dy = ty - y
      x += dx * 0.24
      y += dy * 0.24
      rot += (clamp(dx * 0.8, -28, 28) - rot) * 0.14
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot.toFixed(2)}deg)`
      raf = Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08 || Math.abs(rot) > 0.08 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!shown) {
        shown = true
        x = tx
        y = ty
        el.classList.add('is-on')
      }
      const t = e.target
      const field = t.closest && t.closest('input, textarea, select')
      const link = t.closest && t.closest('a, button, [role="button"], summary, label, [data-cursor]')
      el.classList.toggle('is-field', !!field)
      el.classList.toggle('is-link', !!link && !field)
      kick()
    }
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => { shown = false; el.classList.remove('is-on') }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor-frame">
        <i /><i /><i /><i />
      </span>
      <span className="cursor-dot" />
    </div>
  )
}
