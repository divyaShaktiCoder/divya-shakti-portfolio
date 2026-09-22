import { useEffect, useState } from 'react'

/** Returns the nav id of the section currently in the middle of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-nav]')]
    if (!nodes.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.dataset.nav)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return active
}
