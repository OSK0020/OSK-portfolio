import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement | null
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('clickable')
        setIsPointer(!!isClickable)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (isTouch) return null

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Tactical Center Reticle */}
      <div
        className={`relative flex items-center justify-center transition-all duration-200 ${
          isPointer ? 'h-9 w-9 rotate-45' : 'h-6 w-6 rotate-0'
        }`}
      >
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-150 ${
            isPointer
              ? 'border-green bg-green/10 shadow-[0_0_12px_var(--color-green)]'
              : 'border-green/40'
          }`}
        />

        {/* Crosshair ticks */}
        <div className="absolute h-full w-[1px] bg-green/60" />
        <div className="absolute h-[1px] w-full bg-green/60" />

        {/* Center Target Dot */}
        <div className="h-1 w-1 rounded-full bg-green shadow-[0_0_6px_var(--color-green)]" />
      </div>
    </div>
  )
}
