import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll hook. Uses IntersectionObserver as a robust, broadly
 * supported baseline (scroll-driven CSS animations still lack Firefox
 * support, so we use the JS fallback path from the start here).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, visible }
}
