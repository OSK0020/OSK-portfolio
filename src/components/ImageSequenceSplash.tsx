import { useEffect, useRef, useState } from 'react'
import { audio } from '../utils/audioEngine'

interface Props {
  onComplete?: () => void
}

export function ImageSequenceSplash({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [progress, setProgress] = useState(0) // 0 to 100
  const [isCompleted, setIsCompleted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const stateRef = useRef({
    currentProgress: 0,
    animId: 0,
    startTime: 0,
    glitchActive: false,
    signalLost: false,
  })

  // Draw 5-Phase Cinematic Intelligence Canvas
  const renderCanvas = (
    ctx: CanvasRenderingContext2D,
    prog: number,
    width: number,
    height: number
  ) => {
    const cx = width / 2
    const cy = height / 2
    const baseRadius = Math.min(width, height) * 0.42

    ctx.clearRect(0, 0, width, height)

    // CRT Scanlines & Background Darkness
    ctx.fillStyle = '#05080e'
    ctx.fillRect(0, 0, width, height)

    // =========================================================================
    // PHASE 1 (0% - 20%): RECONNAISSANCE INITIALIZATION & HUD CALIBRATION
    // =========================================================================
    if (prog < 20) {
      const p1 = prog / 20

      // CRT Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)'
      ctx.lineWidth = 1
      const gridSize = 32
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Corner Brackets
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.6)'
      ctx.lineWidth = 2
      const bLen = 24
      // TL
      ctx.strokeRect(30, 30, bLen, 2)
      ctx.strokeRect(30, 30, 2, bLen)
      // TR
      ctx.strokeRect(width - 30 - bLen, 30, bLen, 2)
      ctx.strokeRect(width - 30, 30, 2, bLen)
      // BL
      ctx.strokeRect(30, height - 30, bLen, 2)
      ctx.strokeRect(30, height - 30 - bLen, 2, bLen)
      // BR
      ctx.strokeRect(width - 30 - bLen, height - 30, bLen, 2)
      ctx.strokeRect(width - 30, height - 30 - bLen, 2, bLen)

      // Center Calibration Crosshair
      const crossSize = 40 * (1 + (1 - p1) * 1.5)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
      ctx.beginPath()
      ctx.moveTo(cx - crossSize, cy)
      ctx.lineTo(cx + crossSize, cy)
      ctx.moveTo(cx, cy - crossSize)
      ctx.lineTo(cx, cy + crossSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, 20 + p1 * 30, 0, Math.PI * 2)
      ctx.stroke()
    }

    // =========================================================================
    // PHASE 2 (20% - 45%): ORBITAL SATELLITE ZOOM ➔ MOUNTAIN TERRAIN
    // =========================================================================
    else if (prog < 45) {
      const p2 = (prog - 20) / 25
      const altitude = Math.round(35000 * (1 - p2))

      // 3D Topographic Wireframe Mountain Ridge
      ctx.lineWidth = 1.4
      const ridgeCount = 10
      for (let r = 0; r < ridgeCount; r++) {
        const yBase = cy + 30 + r * 22 - p2 * 60
        const depthAlpha = 0.15 + (r / ridgeCount) * 0.65
        ctx.strokeStyle = `rgba(0, 240, 255, ${depthAlpha})`

        ctx.beginPath()
        for (let x = 0; x <= width; x += 16) {
          const nx = (x - cx) / (100 + p2 * 80)
          const elevation = Math.exp(-nx * nx) * (140 - r * 8) * (1 + p2 * 0.5)
          const py = yBase - elevation + Math.sin(x * 0.05 + r) * 6
          if (x === 0) ctx.moveTo(x, py)
          else ctx.lineTo(x, py)
        }
        ctx.stroke()
      }

      // Orbital Tracking Reticle zooming in
      const reticleR = baseRadius * (1 - p2 * 0.7)
      ctx.save()
      ctx.translate(cx, cy - 20)
      ctx.rotate(p2 * Math.PI * 2)

      ctx.strokeStyle = 'rgba(255, 0, 85, 0.85)'
      ctx.lineWidth = 1.8
      ctx.setLineDash([14, 10])
      ctx.beginPath()
      ctx.arc(0, 0, reticleR, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Altitude HUD Overlay
      ctx.font = '11px JetBrains Mono, monospace'
      ctx.fillStyle = '#00f0ff'
      ctx.fillText(`ORBITAL SATELLITE RECON // ZOOM RATIO: ${(1 + p2 * 8).toFixed(1)}X`, 40, 60)
      ctx.fillStyle = '#ff0055'
      ctx.fillText(`ALTITUDE: -${altitude}m ➔ FORDO MOUNTAIN BEDROCK`, 40, 78)
    }

    // =========================================================================
    // PHASE 3 (45% - 70%): SUBTERRANEAN SHAFT DIVE & BLAST ROCK PENETRATION
    // =========================================================================
    else if (prog < 70) {
      const p3 = (prog - 45) / 25
      const depthMeters = Math.round(p3 * 850)

      // Speed Tunnel Particles (Plunging Downwards)
      const rayCount = 36
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * Math.PI * 2) / rayCount + p3 * 2
        const rStart = 20 + p3 * 60
        const rEnd = baseRadius * (1.2 + (i % 3) * 0.3)
        const x1 = cx + Math.cos(angle) * rStart
        const y1 = cy + Math.sin(angle) * rStart
        const x2 = cx + Math.cos(angle) * rEnd
        const y2 = cy + Math.sin(angle) * rEnd

        ctx.strokeStyle = `rgba(255, 184, 0, ${0.2 + (i % 4) * 0.2})`
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Massive Hexagonal Blast Air-Lock Door Opening
      const iris = Math.min(1, p3 * 1.3)
      const rInner = baseRadius * 0.7 * iris
      const rOuter = baseRadius * 0.95

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-p3 * Math.PI)

      for (let h = 0; h < 6; h++) {
        const ha = (h * Math.PI) / 3
        ctx.fillStyle = 'rgba(16, 24, 38, 0.95)'
        ctx.strokeStyle = '#ffb800'
        ctx.lineWidth = 2.2

        ctx.beginPath()
        ctx.moveTo(Math.cos(ha) * rInner, Math.sin(ha) * rInner)
        ctx.lineTo(Math.cos(ha) * rOuter, Math.sin(ha) * rOuter)
        ctx.lineTo(Math.cos(ha + Math.PI / 3) * rOuter, Math.sin(ha + Math.PI / 3) * rOuter)
        ctx.lineTo(Math.cos(ha + Math.PI / 3) * rInner, Math.sin(ha + Math.PI / 3) * rInner)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      ctx.restore()

      ctx.font = '11px JetBrains Mono, monospace'
      ctx.fillStyle = '#ffb800'
      ctx.fillText(`SUBTERRANEAN AIRLOCK BREACH // HYDRAULIC PRESSURE: 420 BAR`, 40, 60)
      ctx.fillStyle = '#00ff9d'
      ctx.fillText(`BUNKER SHAFT DESCENT // CURRENT DEPTH: -${depthMeters}m`, 40, 78)
    }

    // =========================================================================
    // PHASE 4 (70% - 88%): SIGNAL INTERRUPT ➔ DIGITAL MATRIX DISSOLVE
    // =========================================================================
    else if (prog < 88) {
      const p4 = (prog - 70) / 18

      if (p4 < 0.35) {
        // Blackout Glitch: SIGNAL LOST
        ctx.fillStyle = '#020408'
        ctx.fillRect(0, 0, width, height)

        // Glitch Scan Noise
        for (let i = 0; i < 15; i++) {
          const gy = Math.random() * height
          ctx.fillStyle = `rgba(255, 0, 85, ${Math.random() * 0.3})`
          ctx.fillRect(0, gy, width, Math.random() * 6 + 2)
        }

        ctx.font = 'bold 18px JetBrains Mono, monospace'
        ctx.fillStyle = '#ff0055'
        ctx.textAlign = 'center'
        ctx.fillText(`⚠ SIGNAL LOST...`, cx, cy - 10)
        ctx.font = '11px JetBrains Mono, monospace'
        ctx.fillStyle = '#7a92a5'
        ctx.fillText(`RE-ESTABLISHING ENCRYPTED QUANTUM LINK`, cx, cy + 20)
        ctx.textAlign = 'left'
      } else {
        // SIGNAL RESTORED ➔ Walls dissolve into code matrix particles
        const restoreP = (p4 - 0.35) / 0.65

        // Expanding Quantum Plasma Core
        const plasmaR = baseRadius * 1.5 * restoreP
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, plasmaR))
        grad.addColorStop(0, 'rgba(0, 255, 157, 0.4)')
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.25)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, plasmaR, 0, Math.PI * 2)
        ctx.fill()

        // Binary/Matrix Particle Stream Disintegrating Outward
        const pCount = 48
        for (let i = 0; i < pCount; i++) {
          const angle = (i * Math.PI * 2) / pCount
          const dist = baseRadius * restoreP * (0.8 + (i % 5) * 0.2)
          const px = cx + Math.cos(angle) * dist
          const py = cy + Math.sin(angle) * dist

          ctx.fillStyle = i % 2 === 0 ? '#00ff9d' : '#00f0ff'
          ctx.font = '10px JetBrains Mono, monospace'
          ctx.fillText((i % 2).toString(), px, py)
        }

        ctx.font = 'bold 16px JetBrains Mono, monospace'
        ctx.fillStyle = '#00ff9d'
        ctx.textAlign = 'center'
        ctx.fillText(`✓ SIGNAL RESTORED // PHYSICAL DISSOLVING INTO SYSTEM`, cx, cy - 20)
        ctx.font = '12px JetBrains Mono, monospace'
        ctx.fillStyle = '#00f0ff'
        ctx.fillText(`FROM SIGNAL ➔ TO SYSTEM`, cx, cy + 15)
        ctx.textAlign = 'left'
      }
    }

    // =========================================================================
    // PHASE 5 (88% - 100%): PORTFOLIO IDENTITY & SYSTEM REVEAL
    // =========================================================================
    else {
      const p5 = (prog - 88) / 12

      // Blinding flash beam dissolving outward
      const flashAlpha = Math.min(1, p5 * 1.8)
      ctx.fillStyle = `rgba(0, 255, 157, ${flashAlpha * 0.35})`
      ctx.fillRect(0, 0, width, height)

      // Laser Cross Grid
      ctx.strokeStyle = `rgba(255, 255, 255, ${flashAlpha})`
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(width, cy)
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, height)
      ctx.stroke()
    }
  }

  // Playback Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = Math.min(window.innerWidth * 0.95, 780)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    renderCanvas(ctx, stateRef.current.currentProgress, size, size)

    if (hasStarted) {
      const DURATION = 6500 // Total 6.5s movie sequence
      stateRef.current.startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - stateRef.current.startTime
        const p = Math.min(100, (elapsed / DURATION) * 100)
        stateRef.current.currentProgress = p
        setProgress(p)

        // Phase tracking
        if (p < 20) setPhase(1)
        else if (p < 45) setPhase(2)
        else if (p < 70) setPhase(3)
        else if (p < 88) setPhase(4)
        else setPhase(5)

        // Sound triggers based on key phases
        if (p >= 20 && p < 22 && !stateRef.current.glitchActive) {
          stateRef.current.glitchActive = true
          audio.playRadarSweep()
        }
        if (p >= 45 && p < 47) {
          audio.playAirlockDecompress()
        }
        if (p >= 70 && p < 72 && !stateRef.current.signalLost) {
          stateRef.current.signalLost = true
          audio.playGlitchFX()
        }
        if (p >= 76 && p < 78) {
          audio.playElevatorDrop()
        }

        renderCanvas(ctx, p, size, size)

        if (p >= 100) {
          audio.playAccessGranted()
          setTimeout(() => {
            setIsCompleted(true)
            onComplete?.()
          }, 500)
          return
        }

        stateRef.current.animId = requestAnimationFrame(animate)
      }

      stateRef.current.animId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(stateRef.current.animId)
    }
  }, [hasStarted])

  const startSequence = () => {
    audio.unlock()
    audio.playBootChord()
    setHasStarted(true)
  }

  const handleSkip = () => {
    audio.unlock()
    audio.playClick(1400)
    setIsCompleted(true)
    onComplete?.()
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!hasStarted) startSequence()
        else handleSkip()
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted])

  // Custom Event for Replay
  useEffect(() => {
    const handleReplay = () => {
      setIsCompleted(false)
      setHasStarted(false)
      stateRef.current.currentProgress = 0
      stateRef.current.glitchActive = false
      stateRef.current.signalLost = false
      setProgress(0)
      setPhase(1)
    }
    window.addEventListener('osk:replay-boot', handleReplay)
    return () => window.removeEventListener('osk:replay-boot', handleReplay)
  }, [])

  if (isCompleted) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03060a] p-4 sm:p-6 font-mono select-none overflow-hidden transition-opacity duration-700">
      {/* Background CRT Scanlines & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-75" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      {/* Cyber Ambient Spotlights */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan/15 blur-[200px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-green/15 blur-[200px]" />

      {/* Main Terminal Frame Box */}
      <div className="relative max-w-[800px] w-full rounded-2xl border-2 border-cyan/40 bg-bg-panel/95 p-6 sm:p-8 shadow-[0_0_100px_rgba(0,240,255,0.25)] backdrop-blur-2xl animate-fadeIn flex flex-col items-center text-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between border-b border-line pb-3 text-xs text-text-faint">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan animate-ping" />
            <span className="text-cyan font-bold tracking-widest uppercase">
              OSN // CINEMATIC INTELLIGENCE SEQUENCE
            </span>
          </div>
          <span className="text-green font-bold">
            PHASE [0{phase}/05] // {Math.round(progress)}%
          </span>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative my-3 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="h-[270px] w-[270px] sm:h-[360px] sm:w-[360px] max-w-full rounded-xl border border-line-soft shadow-[0_0_35px_rgba(0,240,255,0.25)]"
          />
        </div>

        {/* Phase Description & Live Telemetry Story */}
        <div className="w-full space-y-2.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-text truncate mr-2">
              {phase === 1 && 'INITIALIZING RECONNAISSANCE INTERFACE... [DATA LINK: ESTABLISHED]'}
              {phase === 2 && 'ORBITAL SATELLITE ZOOM ➔ MOUNTAIN BEDROCK TARGET LOCK'}
              {phase === 3 && 'DIVING INTO MOUNTAIN SHAFT // HYDRAULIC BLAST AIRLOCK BREACH'}
              {phase === 4 && 'SIGNAL RESTORED // PHYSICAL CAVERN DISSOLVING INTO CODE MATRIX'}
              {phase === 5 && 'PORTFOLIO ACCESS GRANTED // FROM SIGNAL → TO SYSTEM'}
            </span>
            <span className="text-cyan shrink-0">{Math.round(progress)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-bg-panel-alt overflow-hidden border border-line">
            <div
              className="h-full bg-gradient-to-r from-cyan via-green to-amber transition-all duration-75 shadow-[0_0_15px_var(--color-green)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dossier Credo Banner */}
          <div className="text-[11px] text-text-dim flex items-center justify-center gap-3 pt-1">
            <span className="text-green font-bold">IDENTITY: OSK0020</span>
            <span className="text-text-faint">|</span>
            <span className="text-cyan font-bold">"FROM SIGNAL → TO SYSTEM"</span>
            <span className="text-text-faint">|</span>
            <span>CLEARANCE: LEVEL-5</span>
          </div>
        </div>

        {/* Bottom CTA Controls */}
        <div className="mt-5 w-full flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
          {!hasStarted ? (
            <button
              onClick={startSequence}
              onMouseEnter={() => audio.playHover()}
              className="w-full rounded-xl border-2 border-cyan bg-cyan/20 py-3.5 text-xs font-extrabold uppercase tracking-widest text-text hover:bg-cyan hover:text-[#05080e] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
            >
              ▶ INITIALIZE INTELLIGENCE SEQUENCE [ENTER]
            </button>
          ) : (
            <div className="w-full flex items-center justify-between text-xs">
              <span className="text-text-faint">CINEMATIC SEQUENCE RUNNING</span>
              <button
                onClick={handleSkip}
                className="rounded border border-line bg-bg-panel-alt px-4 py-1.5 text-text-dim hover:border-green hover:text-green transition-all cursor-pointer"
              >
                SKIP INTRO [ESC] ↵
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
