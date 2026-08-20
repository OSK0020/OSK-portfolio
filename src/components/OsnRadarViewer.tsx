import { useEffect, useRef, useState } from 'react'
import { audio } from '../utils/audioEngine'

interface TargetBlip {
  id: string
  label: string
  distance: number // 0 to 1
  angle: number // in radians
  type: 'AIR' | 'MARITIME' | 'SIGNAL'
  threat: 'CRITICAL' | 'MONITOR'
  speed: string
  altitude: string
  bearing: string
}

export function OsnRadarViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedBlip, setSelectedBlip] = useState<TargetBlip | null>(null)

  const targetsRef = useRef<TargetBlip[]>([
    {
      id: 'T-01',
      label: 'RECON-AIR-94',
      distance: 0.42,
      angle: 1.2,
      type: 'AIR',
      threat: 'MONITOR',
      speed: 'Mach 1.4',
      altitude: '34,000 ft',
      bearing: '068° ENE',
    },
    {
      id: 'T-02',
      label: 'MARITIME-VESSEL-88',
      distance: 0.78,
      angle: 3.4,
      type: 'MARITIME',
      threat: 'CRITICAL',
      speed: '28 Knots',
      altitude: 'Sea Level',
      bearing: '194° SSW',
    },
    {
      id: 'T-03',
      label: 'DEFENSE-UAV-CASCADE',
      distance: 0.61,
      angle: 5.1,
      type: 'AIR',
      threat: 'CRITICAL',
      speed: '220 km/h',
      altitude: '18,500 ft',
      bearing: '312° NW',
    },
    {
      id: 'T-04',
      label: 'SIGINT-INTERCEPT-09',
      distance: 0.28,
      angle: 0.4,
      type: 'SIGNAL',
      threat: 'MONITOR',
      speed: 'Light-speed (RF)',
      altitude: 'LEO Orbit',
      bearing: '022° NNE',
    },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const size = 320
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size / 2 - 18
    let sweepAngle = 0

    const render = () => {
      sweepAngle = (sweepAngle + 0.032) % (Math.PI * 2)

      ctx.clearRect(0, 0, size, size)

      // Radar Scope Background
      ctx.fillStyle = 'rgba(11, 16, 23, 0.96)'
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.fill()

      // Concentric Distance Rings
      for (let i = 1; i <= 4; i++) {
        const ringR = (radius / 4) * i
        ctx.strokeStyle =
          i === 4 ? 'rgba(255, 0, 85, 0.45)' : 'rgba(255, 0, 85, 0.16)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(center, center, ringR, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Crosshairs with Milliradian ticks
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.22)'
      ctx.beginPath()
      ctx.moveTo(center - radius, center)
      ctx.lineTo(center + radius, center)
      ctx.moveTo(center, center - radius)
      ctx.lineTo(center, center + radius)
      ctx.stroke()

      // Sweeping Beam Gradient
      const beamGrad = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        radius
      )
      beamGrad.addColorStop(0, 'rgba(255, 0, 85, 0.45)')
      beamGrad.addColorStop(1, 'rgba(255, 0, 85, 0.03)')

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, sweepAngle - 0.45, sweepAngle)
      ctx.closePath()
      ctx.fillStyle = beamGrad
      ctx.fill()
      ctx.restore()

      // Sweep Line
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.9)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.lineTo(
        center + Math.cos(sweepAngle) * radius,
        center + Math.sin(sweepAngle) * radius
      )
      ctx.stroke()

      // Draw Blips
      targetsRef.current.forEach((blip) => {
        const bx = center + Math.cos(blip.angle) * (blip.distance * radius)
        const by = center + Math.sin(blip.angle) * (blip.distance * radius)

        const diff = (sweepAngle - blip.angle + Math.PI * 2) % (Math.PI * 2)
        const isTargetLocked = selectedBlip?.id === blip.id

        if (diff < 0.65 || isTargetLocked) {
          const alpha = isTargetLocked ? 1 : Math.max(0.2, 1 - diff / 0.65)

          ctx.fillStyle =
            blip.threat === 'CRITICAL'
              ? `rgba(255, 0, 85, ${alpha})`
              : `rgba(0, 255, 157, ${alpha})`
          ctx.beginPath()
          ctx.arc(bx, by, isTargetLocked ? 5 : 3.5, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle =
            blip.threat === 'CRITICAL'
              ? `rgba(255, 0, 85, ${alpha * 0.8})`
              : `rgba(0, 255, 157, ${alpha * 0.8})`
          ctx.strokeRect(bx - 7, by - 7, 14, 14)

          if (isTargetLocked) {
            ctx.beginPath()
            ctx.arc(bx, by, 12, 0, Math.PI * 2)
            ctx.setLineDash([2, 4])
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)'
            ctx.stroke()
            ctx.setLineDash([])
          }

          ctx.font = '10px JetBrains Mono, monospace'
          ctx.fillStyle = isTargetLocked ? '#00f0ff' : '#e6efec'
          ctx.fillText(`[${blip.label}]`, bx + 10, by + 3)
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [selectedBlip])

  const selectBlip = (blip: TargetBlip) => {
    setSelectedBlip(blip)
    audio.playSonarPing(blip.threat === 'CRITICAL' ? 1450 : 980)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 360 Radar Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] rounded-full border border-red/40 shadow-[0_0_30px_rgba(255,0,85,0.25)]"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-red shadow-[0_0_12px_var(--color-red)] animate-ping" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-widest text-text-faint">
        <span className="h-2 w-2 rounded-full bg-red animate-pulse" />
        <span>RADAR SWEEP // CLICK BLIP TO LOCK TARGET</span>
      </div>

      {/* Target Selector Buttons */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5 font-mono text-[10.5px]">
        {targetsRef.current.map((blip) => {
          const isLocked = selectedBlip?.id === blip.id
          return (
            <button
              key={blip.id}
              onClick={() => selectBlip(blip)}
              onMouseEnter={() => audio.playHover()}
              className={`rounded border px-2.5 py-1 transition-all cursor-pointer ${
                isLocked
                  ? 'border-cyan bg-cyan/20 text-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : blip.threat === 'CRITICAL'
                  ? 'border-red/40 bg-red/10 text-red hover:bg-red/20'
                  : 'border-line bg-bg-panel text-text-dim hover:text-text'
              }`}
            >
              {blip.id}: {blip.label}
            </button>
          )
        })}
      </div>

      {/* Selected Target HUD Telemetry Box */}
      {selectedBlip && (
        <div className="mt-3 w-full max-w-[300px] rounded-xl border border-cyan/40 bg-bg-panel-alt p-3 font-mono text-xs shadow-neon-cyan/20 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-line pb-1.5 mb-2">
            <span className="font-bold text-cyan">TARGET: {selectedBlip.label}</span>
            <span
              className={`text-[10px] font-bold ${
                selectedBlip.threat === 'CRITICAL' ? 'text-red' : 'text-green'
              }`}
            >
              [{selectedBlip.threat}]
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10.5px] text-text-dim">
            <div>
              <span className="text-text-faint">SPEED: </span>
              <span className="text-text font-bold">{selectedBlip.speed}</span>
            </div>
            <div>
              <span className="text-text-faint">ALT: </span>
              <span className="text-text font-bold">{selectedBlip.altitude}</span>
            </div>
            <div>
              <span className="text-text-faint">TYPE: </span>
              <span className="text-cyan font-bold">{selectedBlip.type}</span>
            </div>
            <div>
              <span className="text-text-faint">BEARING: </span>
              <span className="text-green font-bold">{selectedBlip.bearing}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
