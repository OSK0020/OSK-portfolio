import { useEffect, useRef, useState } from 'react'
import { tacticalAudio } from '../utils/tacticalAudio'

interface MilitaryDiveSplashProps {
  onSequenceComplete?: () => void
}

export function MilitaryDiveSplash({
  onSequenceComplete,
}: MilitaryDiveSplashProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [depthMeters, setDepthMeters] = useState(0)
  const [securityLayer, setSecurityLayer] = useState('ORBITAL RECON')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const stateRef = useRef({
    lastScrollY: 0,
    lastScrollTime: performance.now(),
    currentVelocity: 0,
    smoothVelocity: 0,
    animId: 0,
    hasCompleted: false,
  })

  // 1. Audio Interaction Trigger
  const handleInteraction = () => {
    tacticalAudio.init()
  }

  // 2. Procedural 120-Frame Military Dive Canvas Renderer
  const renderCanvasFrame = (
    ctx: CanvasRenderingContext2D,
    prog: number,
    w: number,
    h: number
  ) => {
    const cx = w / 2
    const cy = h / 2
    const baseR = Math.min(w, h) * 0.42

    ctx.clearRect(0, 0, w, h)

    // Deep Dark Ambient Backdrop
    ctx.fillStyle = '#05080e'
    ctx.fillRect(0, 0, w, h)

    // ==========================================
    // STAGE 1: 0% - 33% // SATELLITE RECON & MOUNTAIN TOPOGRAPHY
    // ==========================================
    if (prog < 0.33) {
      const p1 = prog / 0.33

      // Topographic Contour Lines
      ctx.lineWidth = 1.3
      const count = 10
      for (let i = 0; i < count; i++) {
        const yBase = cy + 40 + i * 20 - p1 * 50
        const alpha = 0.15 + (i / count) * 0.6
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`

        ctx.beginPath()
        for (let x = 0; x <= w; x += 16) {
          const nx = (x - cx) / (110 + p1 * 70)
          const elevation = Math.exp(-nx * nx) * (130 - i * 8) * (1 + p1 * 0.4)
          const py = yBase - elevation + Math.sin(x * 0.05 + i) * 5
          if (x === 0) ctx.moveTo(x, py)
          else ctx.lineTo(x, py)
        }
        ctx.stroke()
      }

      // Orbital Reticle Zoom
      const reticleR = baseR * (1 - p1 * 0.65)
      ctx.save()
      ctx.translate(cx, cy - 20)
      ctx.rotate(p1 * Math.PI * 2)

      ctx.strokeStyle = 'rgba(255, 0, 85, 0.85)'
      ctx.lineWidth = 1.6
      ctx.setLineDash([14, 10])
      ctx.beginPath()
      ctx.arc(0, 0, reticleR, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    // ==========================================
    // STAGE 2: 33% - 66% // BEDROCK SHAFT DIVE & BLAST AIRLOCK
    // ==========================================
    else if (prog < 0.66) {
      const p2 = (prog - 0.33) / 0.33

      // Subterranean Tunnel Speed Rays
      const rays = 32
      for (let i = 0; i < rays; i++) {
        const angle = (i * Math.PI * 2) / rays + p2 * 2
        const r1 = 25 + p2 * 50
        const r2 = baseR * (1.2 + (i % 3) * 0.25)
        const x1 = cx + Math.cos(angle) * r1
        const y1 = cy + Math.sin(angle) * r1
        const x2 = cx + Math.cos(angle) * r2
        const y2 = cy + Math.sin(angle) * r2

        ctx.strokeStyle = `rgba(255, 184, 0, ${0.2 + (i % 3) * 0.2})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Heavy Hexagonal Blast Shutter
      const iris = Math.min(1, p2 * 1.35)
      const rInner = baseR * 0.7 * iris
      const rOuter = baseR * 0.95

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-p2 * Math.PI)

      for (let h = 0; h < 6; h++) {
        const ha = (h * Math.PI) / 3
        ctx.fillStyle = 'rgba(16, 24, 38, 0.95)'
        ctx.strokeStyle = '#ffb800'
        ctx.lineWidth = 2

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
    }

    // ==========================================
    // STAGE 3: 66% - 100% // QUANTUM REACTOR CORE & MATRIX DISSOLVE
    // ==========================================
    else {
      const p3 = (prog - 0.66) / 0.34

      // Centrifuge Magnetic Rings
      const rings = 5
      for (let r = 0; r < rings; r++) {
        const rad = (baseR * 0.35 + r * 28) * (1 + p3 * 0.4)
        const rot = p3 * Math.PI * (r % 2 === 0 ? 3 : -3)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)

        ctx.strokeStyle = r % 2 === 0 ? 'rgba(0, 255, 157, 0.75)' : 'rgba(0, 240, 255, 0.65)'
        ctx.lineWidth = 1.6
        ctx.setLineDash([16, 10, 4, 10])
        ctx.beginPath()
        ctx.arc(0, 0, rad, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }

      // Expanding Plasma Breach Glow
      const plasmaR = baseR * 1.6 * Math.pow(p3, 1.2)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, plasmaR))
      grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, 0.95 * p3 * 1.5)})`)
      grad.addColorStop(0.3, `rgba(0, 255, 157, ${0.75 * p3})`)
      grad.addColorStop(0.7, `rgba(0, 240, 255, ${0.45 * p3})`)
      grad.addColorStop(1, 'transparent')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, plasmaR, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 3. Scroll Tracking & Velocity DSP Loop
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const totalScrollable = container.scrollHeight - window.innerHeight
      const currentScrolled = -rect.top

      const prog = Math.min(1, Math.max(0, currentScrolled / totalScrollable))
      setScrollProgress(prog)

      // Velocity calculation
      const now = performance.now()
      const dt = Math.max(1, now - stateRef.current.lastScrollTime)
      const dy = window.scrollY - stateRef.current.lastScrollY
      const rawVel = (dy / dt) * 45
      stateRef.current.currentVelocity = Math.abs(rawVel)

      stateRef.current.lastScrollY = window.scrollY
      stateRef.current.lastScrollTime = now

      // Depth & Security Layer HUD updates
      const depth = prog * -140
      setDepthMeters(depth)

      if (prog < 0.35) setSecurityLayer('ORBITAL RECON')
      else if (prog < 0.7) setSecurityLayer('FACILITY BREACH')
      else setSecurityLayer('DEEP CORE ACCESS')

      tacticalAudio.triggerMilestone(prog)

      if (prog >= 0.96 && !stateRef.current.hasCompleted) {
        stateRef.current.hasCompleted = true
        onSequenceComplete?.()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onSequenceComplete])

  // 4. Smooth Animation Frame Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const render = () => {
      // Smooth velocity interpolation for audio DSP
      stateRef.current.smoothVelocity +=
        (stateRef.current.currentVelocity - stateRef.current.smoothVelocity) * 0.15
      tacticalAudio.updateVelocity(stateRef.current.smoothVelocity)

      // Decay velocity
      stateRef.current.currentVelocity *= 0.92

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.save()
      ctx.scale(dpr, dpr)
      renderCanvasFrame(
        ctx,
        scrollProgress,
        canvas.width / dpr,
        canvas.height / dpr
      )
      ctx.restore()

      stateRef.current.animId = requestAnimationFrame(render)
    }

    stateRef.current.animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(stateRef.current.animId)
    }
  }, [scrollProgress])

  // Auto-Play Feature
  const handleAutoPlay = () => {
    tacticalAudio.init()
    setIsAutoPlaying(true)
    const container = containerRef.current
    if (!container) return

    const startY = window.scrollY
    const targetY = container.offsetTop + container.scrollHeight - window.innerHeight
    const duration = 5500
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      window.scrollTo(0, startY + (targetY - startY) * ease)

      if (t < 1) {
        requestAnimationFrame(step)
      } else {
        setIsAutoPlaying(false)
      }
    }
    requestAnimationFrame(step)
  }

  const handleSkip = () => {
    tacticalAudio.init()
    tacticalAudio.playAirlockClank()
    const container = containerRef.current
    if (container) {
      const targetY = container.offsetTop + container.scrollHeight - window.innerHeight + 10
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
    onSequenceComplete?.()
  }

  const fadeOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.1))

  return (
    <div
      ref={containerRef}
      onClick={handleInteraction}
      onWheel={handleInteraction}
      onTouchStart={handleInteraction}
      className="relative h-[380vh] w-full bg-black cursor-crosshair select-none"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 2D Viewport Canvas */}
        <canvas ref={canvasRef} className="h-full w-full object-cover" />

        {/* Military OSINT HUD Layer */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-10 font-mono text-[11px] md:text-xs text-green/90 z-20">
          {/* Top Bar */}
          <div className="flex justify-between items-start border-b border-green/20 pb-4 backdrop-blur-[2px]">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green animate-ping" />
                <p className="font-bold tracking-wider text-green">
                  OSINT SURVEILLANCE FEED // ACTIVE
                </p>
              </div>
              <p className="text-text-dim mt-1">
                GRID: 34°53'05"N 50°59'45"E [FORDO MOUNTAIN SECTOR]
              </p>
            </div>
            <div className="text-right">
              <p className="text-green font-bold">
                DEPTH: <span>{depthMeters.toFixed(1)}m</span>
              </p>
              <p className="text-cyan mt-1">
                LAYER: <span>{securityLayer}</span>
              </p>
            </div>
          </div>

          {/* Center Tactical Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-45 pointer-events-none">
            <div className="h-28 w-28 border border-green/40 rounded-full border-dashed animate-[spin_30s_linear_infinite]" />
            <div className="absolute h-12 w-12 border border-cyan/60" />
            <div className="absolute h-1.5 w-1.5 bg-red rounded-full" />
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-green/20 pt-4 backdrop-blur-[2px] gap-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-green animate-pulse tracking-wide font-bold">
                  ▼ SCROLL TO INITIATE PENETRATION DIVE
                </p>
                <p className="text-text-faint text-[10px] mt-0.5">
                  AUDIO SYNTH: DYNAMIC VELOCITY DSP ENGINE
                </p>
              </div>

              {/* Quick Play Controls */}
              <div className="pointer-events-auto flex items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={handleAutoPlay}
                  disabled={isAutoPlaying}
                  className="rounded border border-cyan/50 bg-cyan/15 px-3 py-1 text-[10.5px] font-bold text-cyan hover:bg-cyan hover:text-black transition-all cursor-pointer shadow-sm"
                >
                  {isAutoPlaying ? 'DIVING...' : '▶ AUTO DIVE'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded border border-line bg-bg-panel/80 px-3 py-1 text-[10.5px] text-text-dim hover:text-green hover:border-green transition-all cursor-pointer"
                >
                  SKIP INTRO ↵
                </button>
              </div>
            </div>

            <div className="text-right text-[10px] text-text-dim">
              <p>SECURITY CLEARANCE: TOP SECRET // LEVEL-5</p>
              <p className="text-green font-bold">"FROM SIGNAL → TO SYSTEM"</p>
            </div>
          </div>
        </div>

        {/* Seamless Fade-to-Black into Main Portfolio */}
        <div
          style={{ opacity: fadeOpacity }}
          className="pointer-events-none absolute inset-0 bg-bg z-30 transition-opacity duration-150"
        />
      </div>
    </div>
  )
}
