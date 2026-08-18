import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

export function CountUp({
  to,
  suffix = '',
  duration = 1200,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  const { ref, visible } = useReveal<HTMLSpanElement>(0.6)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!visible || started.current) return
    started.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }

    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [visible, to, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
