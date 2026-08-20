import { useEffect, useRef, useState } from 'react'

export function ElevatorShaftOverlay() {
  const [isDropping, setIsDropping] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastY = window.scrollY
    let lastTime = performance.now()
    let currentVel = 0
    let animId: number
    let timeoutId: ReturnType<typeof setTimeout>

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const handleScroll = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastTime)
      const currentY = window.scrollY
      const dy = currentY - lastY

      const rawVel = (dy / dt) * 60 // pixels per frame approx
      currentVel = Math.min(45, Math.abs(rawVel))
      setVelocity(Math.round(currentVel))

      if (currentVel > 6) {
        setIsDropping(true)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setIsDropping(false)
          currentVel = 0
          setVelocity(0)
        }, 180)
      }

      lastY = currentY
      lastTime = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Speed lines generation
    interface SpeedLine {
      x: number
      y: number
      length: number
      speed: number
      side: 'left' | 'right'
      alpha: number
    }

    const lines: SpeedLine[] = []
    for (let i = 0; i < 35; i++) {
      lines.push({
        x: Math.random() * 40,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 80 + 30,
        speed: Math.random() * 18 + 12,
        side: i % 2 === 0 ? 'left' : 'right',
        alpha: Math.random() * 0.7 + 0.3,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (currentVel > 3) {
        const h = canvas.height
        const w = canvas.width

        lines.forEach((l) => {
          // Lines rush UPWARD as user drops DOWNWARD
          l.y -= l.speed * (currentVel / 8)
          if (l.y + l.length < 0) {
            l.y = h + Math.random() * 100
          }

          const drawX = l.side === 'left' ? l.x + 8 : w - l.x - 8
          ctx.strokeStyle = `rgba(0, 240, 255, ${l.alpha * Math.min(1, currentVel / 15)})`
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(drawX, l.y)
          ctx.lineTo(drawX, l.y + l.length)
          ctx.stroke()
        })
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animId)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden">
      {/* 2D Speed Laser Stream Canvas */}
      <canvas ref={canvasRef} className="h-full w-full opacity-80" />

      {/* Flashing Shaft Drop Indicators when plunging */}
      {isDropping && velocity > 12 && (
        <>
          {/* Left Flank Warning */}
          <div className="fixed left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded border border-amber/60 bg-amber/15 px-3 py-1 font-mono text-[10px] font-bold text-amber shadow-[0_0_15px_rgba(255,184,0,0.4)] animate-pulse">
            <span>▼ SHAFT DROP // -{velocity} m/s</span>
          </div>

          {/* Right Flank Warning */}
          <div className="fixed right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded border border-cyan/60 bg-cyan/15 px-3 py-1 font-mono text-[10px] font-bold text-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-pulse">
            <span>GRAVITY DIVE ACTIVE ▼</span>
          </div>
        </>
      )}
    </div>
  )
}
