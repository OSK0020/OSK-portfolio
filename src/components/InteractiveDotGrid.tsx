import { useEffect, useRef } from 'react'

interface Star3D {
  x: number
  y: number
  z: number
  pz: number
  color: string
  size: number
}

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

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    }

    let speed = 1.6
    let targetSpeed = 1.6
    const STAR_COUNT = 380
    const stars: Star3D[] = []

    const colors = [
      'rgba(0, 255, 157, ', // Green
      'rgba(0, 240, 255, ', // Cyan
      'rgba(255, 0, 85, ',  // Red
      'rgba(255, 184, 0, ', // Amber
    ]

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: width,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.5 + 0.8,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX - width / 2) * 0.4
      mouse.targetY = (e.clientY - height / 2) * 0.4
    }

    const handleMouseDown = () => {
      targetSpeed = 9.0 // Hyperspace warp boost on click
    }

    const handleMouseUp = () => {
      targetSpeed = 1.6
    }

    const handleWarpBurst = () => {
      targetSpeed = 14.0
      setTimeout(() => {
        targetSpeed = 1.6
      }, 1600)
    }

    let lastScrollY = window.scrollY
    const handleScrollVelocity = () => {
      const currentScrollY = window.scrollY
      const delta = Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY
      targetSpeed = Math.min(12.0, 1.6 + delta * 0.08)
      setTimeout(() => {
        targetSpeed = 1.6
      }, 200)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('scroll', handleScrollVelocity, { passive: true })
    window.addEventListener('osk:warp-burst', handleWarpBurst)

    const cx = width / 2
    const cy = height / 2

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08
      speed += (targetSpeed - speed) * 0.08

      ctx.clearRect(0, 0, width, height)

      const screenPositions: { sx: number; sy: number; color: string }[] = []

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        star.pz = star.z
        star.z -= speed

        if (star.z <= 0) {
          star.z = width
          star.pz = width
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
        }

        const k = 280 / star.z
        const px = (star.x + mouse.x) * k + cx
        const py = (star.y + mouse.y) * k + cy

        const prevK = 280 / star.pz
        const ppx = (star.x + mouse.x) * prevK + cx
        const ppy = (star.y + mouse.y) * prevK + cy

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(0.85, Math.max(0.08, (1 - star.z / width) * 1.1))
          const currentSize = star.size * (1 - star.z / width) * 2.2

          // Draw Warp Streak Line if moving fast
          if (speed > 3) {
            ctx.beginPath()
            ctx.moveTo(ppx, ppy)
            ctx.lineTo(px, py)
            ctx.strokeStyle = `${star.color}${depthAlpha})`
            ctx.lineWidth = Math.max(1, currentSize * 0.8)
            ctx.stroke()
          } else {
            // Draw Star Glow Node
            ctx.fillStyle = `${star.color}${depthAlpha})`
            ctx.beginPath()
            ctx.arc(px, py, Math.max(0.6, currentSize), 0, Math.PI * 2)
            ctx.fill()
          }

          if (i % 3 === 0) {
            screenPositions.push({ sx: px, sy: py, color: star.color })
          }
        }
      }

      // Draw Constellation / Neural Laser Connections between close particles
      const posLen = screenPositions.length
      for (let i = 0; i < posLen; i++) {
        for (let j = i + 1; j < posLen; j++) {
          const p1 = screenPositions[i]
          const p2 = screenPositions[j]
          const dx = p1.sx - p2.sx
          const dy = p1.sy - p2.sy
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 65) {
            const lineAlpha = (1 - dist / 65) * 0.18
            ctx.strokeStyle = `rgba(0, 255, 157, ${lineAlpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p1.sx, p1.sy)
            ctx.lineTo(p2.sx, p2.sy)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('osk:warp-burst', handleWarpBurst)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65 select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
