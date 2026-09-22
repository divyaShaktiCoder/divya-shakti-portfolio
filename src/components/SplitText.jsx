import { useEffect, useRef } from 'react'

/**
 * Word-by-word masked text reveal. Wrap a word in *asterisks* for the animated gradient.
 *   <SplitText as="h2" className="h2" text="Featured *Projects*" />
 * `immediate` starts as soon as the app is ready (used in the hero); otherwise on scroll-into-view.
 */
export default function SplitText({ text, as: Tag = 'span', className = '', delay = 0, immediate = false, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => el.classList.add('is-in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return show()
    if (immediate) {
      if (document.documentElement.classList.contains('is-ready')) show()
      else {
        window.addEventListener('app-ready', show, { once: true })
        return () => window.removeEventListener('app-ready', show)
      }
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          show()
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])

  return (
    <Tag ref={ref} className={`split ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {text.split(' ').map((w, i) => {
        const m = w.match(/^\*(.+)\*(.*)$/)
        return (
          <span key={i}>
            <span className="sw">
              <span className="sp" style={{ '--i': i }}>
                {m ? (
                  <>
                    <span className="grad shimmer">{m[1]}</span>
                    {m[2]}
                  </>
                ) : (
                  w
                )}
              </span>
            </span>{' '}
          </span>
        )
      })}
    </Tag>
  )
}
