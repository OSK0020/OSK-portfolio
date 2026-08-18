import { useEffect, useRef } from 'react'

interface TargetBlip {
  id: string
  label: string
  distance: number // 0 to 1
  angle: number // in radians
  type: 'AIR' | 'MARITIME' | 'SIGNAL'
  threat: 'CRITICAL' | 'MONITOR'
}

export function OsnRadarViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const targetsRef = useRef<TargetBlip[]>([
    { id: 'T-01', label: 'ISR-AIR-94', distance: 0.42, angle: 1.2, type: 'AIR', threat: 'MONITOR' },
    { id: 'T-02', label: 'REDSEA-VESSEL-88', distance: 0.78, angle: 3.4, type: 'MARITIME', threat: 'CRITICAL' },
    { id: 'T-03', label: 'TEH-UAV-CASCADE', distance: 0.61, angle: 5.1, type: 'AIR', threat: 'CRITICAL' },
    { id: 'T-04', label: 'SIGINT-INTERCEPT-09', distance: 0.28, angle: 0.4, type: 'SIGNAL', threat: 'MONITOR' },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const size = 300
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size / 2 - 16
    let sweepAngle = 0

    const render = () => {
      sweepAngle = (sweepAngle + 0.035) % (Math.PI * 2)

      ctx.clearRect(0, 0, size, size)

      // Radar Scope Background
      ctx.fillStyle = 'rgba(13, 20, 23, 0.95)'
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.fill()

      // Concentric Rings
      for (let i = 1; i <= 4; i++) {
        const ringR = (radius / 4) * i
        ctx.strokeStyle = i === 4 ? 'rgba(255, 75, 62, 0.4)' : 'rgba(255, 75, 62, 0.15)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(center, center, ringR, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Crosshairs
      ctx.strokeStyle = 'rgba(255, 75, 62, 0.2)'
      ctx.beginPath()
      ctx.moveTo(center - radius, center)
      ctx.lineTo(center + radius, center)
      ctx.moveTo(center, center - radius)
      ctx.lineTo(center, center + radius)
      ctx.stroke()

      // Sweeping Beam Gradient
      const beamGrad = ctx.createRadialGradient(center, center, 0, center, center, radius)
      beamGrad.addColorStop(0, 'rgba(255, 75, 62, 0.45)')
      beamGrad.addColorStop(1, 'rgba(255, 75, 62, 0.05)')

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, sweepAngle - 0.4, sweepAngle)
      ctx.closePath()
      ctx.fillStyle = beamGrad
      ctx.fill()
      ctx.restore()

      // Sweep Line
      ctx.strokeStyle = 'rgba(255, 75, 62, 0.9)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.lineTo(center + Math.cos(sweepAngle) * radius, center + Math.sin(sweepAngle) * radius)
      ctx.stroke()

      // Draw Blips
      targetsRef.current.forEach((blip) => {
        const bx = center + Math.cos(blip.angle) * (blip.distance * radius)
        const by = center + Math.sin(blip.angle) * (blip.distance * radius)

        const diff = (sweepAngle - blip.angle + Math.PI * 2) % (Math.PI * 2)
        if (diff < 0.6) {
          const alpha = 1 - diff / 0.6

          ctx.fillStyle = blip.threat === 'CRITICAL' ? `rgba(255, 75, 62, ${alpha})` : `rgba(61, 255, 160, ${alpha})`
          ctx.beginPath()
          ctx.arc(bx, by, 3.5, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = blip.threat === 'CRITICAL' ? `rgba(255, 75, 62, ${alpha * 0.6})` : `rgba(61, 255, 160, ${alpha * 0.6})`
          ctx.strokeRect(bx - 6, by - 6, 12, 12)

          ctx.font = '9px JetBrains Mono, monospace'
          ctx.fillText(blip.label, bx + 8, by + 3)
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <canvas ref={canvasRef} className="h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-red shadow-[0_0_10px_var(--color-red)]" />
        </div>
      </div>
      <span className="mt-3 font-mono text-[11px] uppercase tracking-widest text-text-faint">
        RADAR SWEEP // 360° SENSOR ARRAY
      </span>
    </div>
  )
}
