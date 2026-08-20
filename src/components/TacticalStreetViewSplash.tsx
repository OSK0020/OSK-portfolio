import { useEffect, useRef, useState } from 'react'
import { tacticalAudio } from '../utils/tacticalAudio'

const STATION_URLS = [
  '/stations/station_01.jpg', // Outer Checkpoint Gate
  '/stations/station_02.jpg', // Mountain Approach Road
  '/stations/station_03.jpg', // Mountain Tunnel Portal
  '/stations/station_04.jpg', // Subterranean Concrete Tunnel
  '/stations/station_05.jpg', // Vault Blast Doors
]

const ZONES = [
  'OUTER PERIMETER // CHECKPOINT 01',
  'APPROACH ROAD // MOUNTAIN CLIFF SECTOR',
  'MOUNTAIN PORTAL // FORTIFIED ENTRANCE',
  'SUBTERRANEAN TUNNEL // DESCENT SHAFT',
  'COMMAND CORE // AIRLOCK BLAST DOORS',
]

interface Props {
  onSequenceComplete?: () => void
}

export function TacticalStreetViewSplash({ onSequenceComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAutoDriving, setIsAutoDriving] = useState(false)

  const stateRef = useRef({
    lastScrollY: 0,
    lastTime: performance.now(),
    currentVel: 0,
    smoothVel: 0,
    smoothProg: 0,
    animId: 0,
    hasCompleted: false,
  })

  // 1. Load Photorealistic Keyframe Station Images
  useEffect(() => {
    let count = 0
    const loadedImages: HTMLImageElement[] = []

    STATION_URLS.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        count++
        setLoadProgress(Math.round((count / STATION_URLS.length) * 100))
        if (count === STATION_URLS.length) {
          setImages(loadedImages)
          setIsLoaded(true)
        }
      }
      img.onerror = () => {
        count++
        setLoadProgress(Math.round((count / STATION_URLS.length) * 100))
      }
      loadedImages.push(img)
    })
  }, [])

  // 2. Audio Interaction Trigger
  const handleInteraction = () => {
    tacticalAudio.init()
  }

  // 3. Scroll Listener & Velocity DSP Engine
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const totalScrollable = container.scrollHeight - window.innerHeight
      const currentScrolled = -rect.top

      const prog = Math.min(1, Math.max(0, currentScrolled / totalScrollable))
      setScrollProgress(prog)

      const now = performance.now()
      const dt = Math.max(1, now - stateRef.current.lastTime)
      const dy = window.scrollY - stateRef.current.lastScrollY
      const rawVel = (dy / dt) * 45
      stateRef.current.currentVel = Math.abs(rawVel)

      stateRef.current.lastScrollY = window.scrollY
      stateRef.current.lastTime = now

      tacticalAudio.triggerMilestone(prog)

      if (prog >= 0.96 && !stateRef.current.hasCompleted) {
        stateRef.current.hasCompleted = true
        onSequenceComplete?.()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onSequenceComplete])

  // 4. Optical Forward Push (Street-View Zoom & Motion Interpolation) Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isLoaded || images.length === 0) return
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
      // Lerp smooth progress and velocity for buttery 60 FPS motion
      stateRef.current.smoothProg += (scrollProgress - stateRef.current.smoothProg) * 0.12
      stateRef.current.smoothVel += (stateRef.current.currentVel - stateRef.current.smoothVel) * 0.15
      stateRef.current.currentVel *= 0.92

      tacticalAudio.updateVelocity(stateRef.current.smoothVel)

      const p = stateRef.current.smoothProg
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      // Calculate active station index and subframe optical push fraction
      const totalStations = images.length
      const rawIndex = p * (totalStations - 1)
      const currentIndex = Math.min(totalStations - 1, Math.max(0, Math.floor(rawIndex)))
      const nextIndex = Math.min(totalStations - 1, currentIndex + 1)
      const subFraction = rawIndex - currentIndex // 0.0 to 1.0 between stations

      const currentImg = images[currentIndex]
      const nextImg = images[nextIndex]

      if (currentImg && currentImg.complete) {
        // Draw Current Image with Optical Forward Push Zoom
        const hRatio = w / currentImg.width
        const vRatio = h / currentImg.height
        const baseRatio = Math.max(hRatio, vRatio)

        // Optical Forward Push scale: 1.00 ➔ 1.22
        const pushScale = 1 + subFraction * 0.22
        const renderW = currentImg.width * baseRatio * pushScale
        const renderH = currentImg.height * baseRatio * pushScale
        const shiftX = (w - renderW) / 2
        const shiftY = (h - renderH) / 2

        ctx.globalAlpha = 1
        ctx.drawImage(currentImg, 0, 0, currentImg.width, currentImg.height, shiftX, shiftY, renderW, renderH)

        // Cross-Dissolve into Next Image
        if (nextImg && nextImg.complete && currentIndex !== nextIndex && subFraction > 0.05) {
          const crossAlpha = Math.min(1, (subFraction - 0.05) / 0.9)
          const nextHRatio = w / nextImg.width
          const nextVRatio = h / nextImg.height
          const nextBaseRatio = Math.max(nextHRatio, nextVRatio)

          const nextPushScale = 0.92 + subFraction * 0.1
          const nextW = nextImg.width * nextBaseRatio * nextPushScale
          const nextH = nextImg.height * nextBaseRatio * nextPushScale
          const nextShiftX = (w - nextW) / 2
          const nextShiftY = (h - nextH) / 2

          ctx.globalAlpha = crossAlpha
          ctx.drawImage(nextImg, 0, 0, nextImg.width, nextImg.height, nextShiftX, nextShiftY, nextW, nextH)
        }
      }

      // Tactical Vignette & HUD Scanline Filter
      ctx.globalAlpha = 0.25
      ctx.fillStyle = '#05080e'
      ctx.fillRect(0, 0, w, h)

      ctx.restore()

      stateRef.current.animId = requestAnimationFrame(render)
    }

    stateRef.current.animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(stateRef.current.animId)
    }
  }, [isLoaded, images, scrollProgress])

  // Auto Drive
  const handleAutoDrive = () => {
    tacticalAudio.init()
    setIsAutoDriving(true)
    const container = containerRef.current
    if (!container) return

    const startY = window.scrollY
    const targetY = container.offsetTop + container.scrollHeight - window.innerHeight
    const duration = 6500
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      window.scrollTo(0, startY + (targetY - startY) * ease)

      if (t < 1) {
        requestAnimationFrame(step)
      } else {
        setIsAutoDriving(false)
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

  // Range and Zone calculations
  const distanceToTarget = Math.round(450 * (1 - scrollProgress))
  const zoneIndex = Math.min(ZONES.length - 1, Math.floor(scrollProgress * ZONES.length))
  const activeZone = ZONES[zoneIndex]
  const fadeOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.1))

  return (
    <div
      ref={containerRef}
      onClick={handleInteraction}
      onWheel={handleInteraction}
      onTouchStart={handleInteraction}
      className="relative h-[420vh] bg-black select-none cursor-crosshair"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Preloader Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono text-green">
            <div className="h-1.5 w-64 bg-bg-panel-alt overflow-hidden mb-3 border border-green/40 rounded">
              <div
                className="h-full bg-green transition-all duration-150 shadow-[0_0_12px_var(--color-green)]"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-xs tracking-widest animate-pulse font-bold">
              SYNCING PHOTOREALISTIC RECON OPTICS // {loadProgress}%
            </p>
          </div>
        )}

        {/* 2D Photorealistic Viewport Canvas */}
        <canvas ref={canvasRef} className="h-full w-full object-cover" />

        {/* Tactical Street-View HUD Layer */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-8 font-mono text-xs text-green z-20">
          {/* Header Bar */}
          <div className="flex justify-between items-start border-b border-green/30 pb-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg">
            <div>
              <p className="font-bold flex items-center gap-2 text-sm text-green tracking-wide">
                <span className="h-2.5 w-2.5 rounded-full bg-green animate-ping" />
                TACTICAL STREET-VIEW // FORWARD POV HYPERLAPSE
              </p>
              <p className="text-text-dim text-[11px] mt-1">
                SECTOR: <span className="text-cyan font-bold">{activeZone}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-green font-bold text-sm">
                RANGE TO CORE: <span className="text-text font-bold">{distanceToTarget}m</span>
              </p>
              <p className="text-text-faint text-[10px] mt-0.5">BEARING: 042° NE // GPS LOCK: ACTIVE</p>
            </div>
          </div>

          {/* Center Street-View Forward Vector Reticle */}
          <div className="self-center flex flex-col items-center opacity-75 pointer-events-none">
            <div className="w-16 h-16 border-2 border-green/40 rounded-full flex items-center justify-center border-dashed animate-[spin_25s_linear_infinite] shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              <div className="w-3 h-3 bg-cyan rounded-full animate-ping" />
            </div>
            <p className="text-[10px] text-cyan font-bold mt-2 tracking-widest bg-black/70 px-3 py-0.5 rounded border border-cyan/30">
              FORWARD VECTOR
            </p>
          </div>

          {/* Footer Bar & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-green/30 pt-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div>
                <p className="animate-pulse font-bold text-green tracking-wide">
                  ▼ SCROLL TO DRIVE FORWARD
                </p>
                <p className="text-text-faint text-[10px] mt-0.5">
                  OPTICAL FORWARD PUSH // AUDIO: DYNAMIC DSP ENGINE
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pointer-events-auto flex items-center gap-2 ml-3">
                <button
                  type="button"
                  onClick={handleAutoDrive}
                  disabled={isAutoDriving}
                  className="rounded border border-cyan/60 bg-cyan/20 px-3 py-1.5 text-[11px] font-bold text-cyan hover:bg-cyan hover:text-black transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  {isAutoDriving ? 'DRIVING...' : '▶ AUTO DRIVE'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded border border-line bg-bg-panel/90 px-3 py-1.5 text-[11px] text-text-dim hover:text-green hover:border-green transition-all cursor-pointer"
                >
                  SKIP TO PORTFOLIO ↵
                </button>
              </div>
            </div>

            <div className="text-right text-[10px] text-text-dim">
              <p>SECURITY LEVEL: COSMIC TOP SECRET</p>
              <p className="text-green font-bold">"FROM SIGNAL → TO SYSTEM"</p>
            </div>
          </div>
        </div>

        {/* Seamless Fade-to-Black Transition into Portfolio Hero */}
        <div
          style={{ opacity: fadeOpacity }}
          className="pointer-events-none absolute inset-0 bg-bg z-30 transition-opacity duration-150"
        />
      </div>
    </div>
  )
}
