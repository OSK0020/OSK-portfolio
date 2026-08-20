import React, { useRef, useState } from 'react'
import { audio } from '../../utils/audioEngine'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  strength?: number // Magnetic pull strength (default 0.3)
  className?: string
  soundFrequency?: number
}

export function MagneticButton({
  children,
  strength = 0.35,
  className = '',
  soundFrequency = 1400,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength

    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeaveInner = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPosition({ x: 0, y: 0 })
    onMouseLeave?.(e)
  }

  const handleMouseEnterInner = (e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playHover()
    onMouseEnter?.(e)
  }

  const handleClickInner = (e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playClick(soundFrequency)
    onClick?.(e)
  }

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnterInner}
      onMouseLeave={handleMouseLeaveInner}
      onClick={handleClickInner}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)' : 'transform 0.1s ease-out',
      }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
