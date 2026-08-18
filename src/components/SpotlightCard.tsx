import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from 'react'

/**
 * Card with a pointer-following spotlight reveal, built with CSS masks +
 * registered custom properties per modern-web-guidance (interactive-content-reveal).
 * The spotlight is a non-essential visual enhancement layered with pointer-events:none,
 * so keyboard/assistive-tech users get full access to the underlying content regardless.
 */
export function SpotlightCard({
  children,
  className = '',
  color = 'var(--color-green)',
}: {
  children: ReactNode
  className?: string
  color?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--spot-x', `${x}%`)
    el.style.setProperty('--spot-y', `${y}%`)
    el.style.setProperty('--spot-size', '220px')
  }

  function handlePointerLeave() {
    ref.current?.style.setProperty('--spot-size', '0%')
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ '--spot-color': color } as CSSProperties}
      className={`spotlight ${className}`}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
