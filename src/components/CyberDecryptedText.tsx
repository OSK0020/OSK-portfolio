import { useEffect, useState, useRef } from 'react'

interface Props {
  text: string
  className?: string
  characters?: string
  speed?: number
  decryptOnHover?: boolean
  highlightClass?: string
}

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>[]{}~/'

export function CyberDecryptedText({
  text,
  className = '',
  characters = CYBER_CHARS,
  speed = 35,
  decryptOnHover = true,
}: Props) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const hasAnimatedRef = useRef(false)

  const startDecryption = () => {
    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }

      iteration += 1 / 2
    }, speed)
  }

  useEffect(() => {
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true
      startDecryption()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text])

  const handleMouseEnter = () => {
    if (decryptOnHover && !isHovered) {
      setIsHovered(true)
      startDecryption()
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  )
}
