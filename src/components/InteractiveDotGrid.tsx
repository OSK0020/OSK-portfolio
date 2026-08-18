import { useEffect, useRef } from 'react'

export function InteractiveDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 160,
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX
        mouse.targetY = e.touches[0].clientY
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    interface Particle {
      originX: number
      originY: number
      x: number
      y: number
      vx: number
      vy: number
      size: number
      baseAlpha: number
    }

    let particles: Particle[] = []

    const spacing = 38
    function initParticles() {
      particles = []
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing
          const y = j * spacing
          particles.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size: 1.2,
            baseAlpha: 0.12,
          })
        }
      }
    }

    initParticles()

    const render = () => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.15
      mouse.y += (mouse.targetY - mouse.y) * 0.15

      ctx.clearRect(0, 0, width, height)

      const pLength = particles.length
      for (let i = 0; i < pLength; i++) {
        const p = particles[i]
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Cursor magnetic push/repulsion
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 8
          const angle = Math.atan2(dy, dx)
          p.vx -= Math.cos(angle) * force * 0.4
          p.vy -= Math.sin(angle) * force * 0.4
        }

        // Spring back to origin
        const homeDx = p.originX - p.x
        const homeDy = p.originY - p.y
        p.vx += homeDx * 0.08
        p.vy += homeDy * 0.08

        // Friction / Damping
        p.vx *= 0.82
        p.vy *= 0.82

        p.x += p.vx
        p.y += p.vy

        // Draw particle
        let alpha = p.baseAlpha
        let glowSize = p.size
        let color = 'rgba(61, 255, 160, ' // Green accent

        if (dist < mouse.radius) {
          const proximity = 1 - dist / mouse.radius
          alpha = p.baseAlpha + proximity * 0.65
          glowSize = p.size + proximity * 2
          color = 'rgba(95, 185, 255, ' // Shifts to cyan near cursor
        }

        ctx.fillStyle = `${color}${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
