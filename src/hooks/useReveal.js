import { useEffect, useRef } from 'react'

let observer
function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          observer.unobserve(e.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  )
  return observer
}

/** Adds `.is-in` once the element scrolls into view. Pair with the `.reveal` CSS class. */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const o = getObserver()
    o.observe(el)
    return () => o.unobserve(el)
  }, [])
  return ref
}
