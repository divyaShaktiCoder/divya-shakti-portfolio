import { Children, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * On desktop: renders `className` (a grid) as-is.
 * On phones: becomes a one-card-at-a-time carousel driven by previous / next icon buttons.
 */
export default function Carousel({ className = '', label = 'items', always = false, children }) {
  const track = useRef(null)
  const [i, setI] = useState(0)
  const count = Children.toArray(children).length

  useEffect(() => {
    setI(0)
    if (track.current) track.current.scrollLeft = 0
  }, [count])

  const goTo = (n) => {
    const el = track.current
    if (!el) return
    const k = Math.max(0, Math.min(count - 1, n))
    el.scrollTo({ left: (el.scrollWidth / count) * k, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (!el) return
    setI(Math.round(el.scrollLeft / (el.scrollWidth / count)))
  }

  return (
    <div className={`carousel ${always ? 'is-always' : ''}`}>
      <div ref={track} className={`carousel-track ${className}`} onScroll={onScroll}>
        {children}
      </div>
      {count > 1 && (
        <div className="carousel-nav" role="group" aria-label={`Browse ${label}`}>
          <button onClick={() => goTo(i - 1)} disabled={i <= 0} aria-label={`Previous ${label}`}>
            <ChevronLeft size={22} />
          </button>
          <span className="carousel-count" aria-live="polite">
            {Math.min(i + 1, count)} / {count}
          </span>
          <button onClick={() => goTo(i + 1)} disabled={i >= count - 1} aria-label={`Next ${label}`}>
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  )
}
