import { useEffect, useState, useRef } from 'react'
import { audio } from '../utils/audioEngine'

export function TacticalHUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [timeUtc, setTimeUtc] = useState('')
  const [timeGlobal, setTimeGlobal] = useState('')
  const [isMuted, setIsMuted] = useState(audio.getMuted())
  const [isAmbientOn, setIsAmbientOn] = useState(audio.getIsAmbientPlaying())
  const [fps, setFps] = useState(60)
  const [depth, setDepth] = useState(0)
  const [bunkerLevel, setBunkerLevel] = useState(0)
  const [velocity, setVelocity] = useState(0)

  const fpsFramesRef = useRef(0)
  const lastFpsTimeRef = useRef(performance.now())
  const lastScrollYRef = useRef(0)
  const lastScrollTimeRef = useRef(performance.now())
  const velTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const levelNames = [
    'L-0: SURFACE GATE',
    'L-1: SITUATION ROOM',
    'L-2: WAR ROOM',
    'L-3: ARSENAL & DOSSIER',
    'L-4: AI R&D CHAMBER',
    'L-5: DEEP VAULT',
  ]

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeUtc(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      )
      setTimeGlobal(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/Zurich',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' CET'
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastScrollTimeRef.current)
      const currentScrollY = window.scrollY
      const dy = currentScrollY - lastScrollYRef.current

      // Calculate shaft descent velocity
      const vel = Math.round(Math.min(50, (Math.abs(dy) / dt) * 45))
      setVelocity(vel)

      if (velTimeoutRef.current) clearTimeout(velTimeoutRef.current)
      velTimeoutRef.current = setTimeout(() => {
        setVelocity(0)
      }, 150)

      lastScrollYRef.current = currentScrollY
      lastScrollTimeRef.current = now

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        const ratio = Math.min(1, Math.max(0, currentScrollY / totalScroll))
        const currentDepth = Math.round(ratio * 1200)
        setDepth(currentDepth)
        const lvl = Math.min(5, Math.floor(ratio * 5.99))
        setBunkerLevel(lvl)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Real-time FPS calculation
    let animId: number
    const calcFps = (now: number) => {
      fpsFramesRef.current++
      if (now - lastFpsTimeRef.current >= 1000) {
        setFps(Math.min(60, fpsFramesRef.current))
        fpsFramesRef.current = 0
        lastFpsTimeRef.current = now
      }
      animId = requestAnimationFrame(calcFps)
    }
    animId = requestAnimationFrame(calcFps)

    return () => {
      clearInterval(timer)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animId)
      if (velTimeoutRef.current) clearTimeout(velTimeoutRef.current)
    }
  }, [])

  const handleToggleSound = () => {
    const newMute = audio.toggleMute()
    setIsMuted(newMute)
  }

  const handleToggleAmbient = () => {
    const newState = audio.toggleAmbient()
    setIsAmbientOn(newState)
  }

  const cabinPressure = (1.0 + (depth / 1200) * 1.4).toFixed(2)

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* Top Left Corner: System ID & Bunker Level Elevator */}
      <div className="absolute top-3 left-3 flex items-start gap-2 font-mono text-[10.5px] text-text-faint sm:top-5 sm:left-5">
        <div className="h-4 w-4 border-t-2 border-l-2 border-green/60" />
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-green font-bold">OSK//SYS.v6.4</span>
            <span className="text-text-faint">|</span>
            <span className="text-cyan font-bold">{fps} FPS</span>
            <span className="text-text-faint">|</span>
            <span className="text-amber font-bold">{levelNames[bunkerLevel]}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-text-dim mt-0.5">
            <span>DEPTH: <strong className="text-cyan font-bold">-{depth}m</strong></span>
            <span className="text-text-faint">|</span>
            <span>
              VELOCITY:{' '}
              <strong className={velocity > 0 ? 'text-amber font-bold animate-pulse' : 'text-green'}>
                {velocity > 0 ? `-${velocity} m/s [PLUNGING]` : '0.0 m/s [LOCKED]'}
              </strong>
            </span>
            <span className="text-text-faint">|</span>
            <span>PRESSURE: <strong className="text-text font-bold">{cabinPressure} ATM</strong></span>
          </div>
        </div>
      </div>

      {/* Vertical Laser Depth Meter on Left Edge */}
      <div className="hidden lg:flex fixed left-3 top-1/2 -translate-y-1/2 flex-col items-center gap-1 font-mono text-[9px] text-text-faint">
        <span className="text-cyan font-bold rotate-180 [writing-mode:vertical-lr]">
          BUNKER DEPTH
        </span>
        <div className="h-28 w-1.5 rounded-full bg-bg-panel-alt border border-line relative overflow-hidden my-1">
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan via-green to-amber shadow-[0_0_8px_var(--color-cyan)] transition-all duration-150"
            style={{ height: `${(depth / 1200) * 100}%` }}
          />
        </div>
        <span className="text-green font-bold">-{depth}m</span>
      </div>

      {/* Top Right Corner Controls */}
      <div className="pointer-events-auto absolute top-3 right-3 flex items-center gap-2 font-mono text-[11px] sm:top-5 sm:right-5">
        {/* Replay Intro */}
        <button
          onClick={() => {
            audio.playClick(1500)
            window.dispatchEvent(new CustomEvent('osk:replay-boot'))
          }}
          onMouseEnter={() => audio.playHover()}
          className="hidden md:flex items-center gap-1.5 rounded border border-line bg-bg-panel/90 px-2.5 py-1.5 text-text-dim hover:border-cyan hover:text-cyan transition-all cursor-pointer shadow-sm"
          title="Replay Cinematic 3D Sequence"
        >
          <span>⟳ INTRO</span>
        </button>

        {/* Ambient Sci-Fi Drone Toggle */}
        <button
          onClick={handleToggleAmbient}
          onMouseEnter={() => audio.playHover()}
          className={`hidden sm:flex items-center gap-1.5 rounded border px-2.5 py-1.5 transition-all cursor-pointer ${
            isAmbientOn
              ? 'border-amber/60 bg-amber/15 text-amber shadow-[0_0_12px_rgba(255,184,0,0.3)]'
              : 'border-line bg-bg-panel/90 text-text-faint hover:text-text-dim'
          }`}
          title="Toggle Continuous Sci-Fi Ambient Drone"
        >
          <span className="relative flex h-2 w-2">
            {isAmbientOn && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
            )}
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                isAmbientOn ? 'bg-amber' : 'bg-text-faint'
              }`}
            />
          </span>
          <span className="font-bold tracking-wide">
            AMBIENT: {isAmbientOn ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Master Sound Synth Toggle */}
        <button
          onClick={handleToggleSound}
          onMouseEnter={() => audio.playHover()}
          className={`flex items-center gap-2 rounded border px-3 py-1.5 transition-all cursor-pointer ${
            !isMuted
              ? 'border-green/60 bg-green/15 text-green shadow-[0_0_12px_rgba(0,255,157,0.25)]'
              : 'border-line bg-bg-panel/90 text-text-faint hover:text-text-dim'
          }`}
          title="Toggle Synthesized Audio Feedback"
        >
          {/* Animated Equalizer Wave Bars */}
          {!isMuted ? (
            <div className="flex items-end gap-[2.5px] h-3.5 mr-0.5">
              <span className="w-[2.5px] bg-green rounded-full animate-eq-1 shadow-[0_0_4px_var(--color-green)]" />
              <span className="w-[2.5px] bg-green rounded-full animate-eq-2 shadow-[0_0_4px_var(--color-green)]" />
              <span className="w-[2.5px] bg-green rounded-full animate-eq-3 shadow-[0_0_4px_var(--color-green)]" />
            </div>
          ) : (
            <span className="inline-flex h-2 w-2 rounded-full bg-text-faint" />
          )}
          <span className="font-bold tracking-wide">
            AUDIO: {isMuted ? 'MUTED' : 'LIVE'}
          </span>
        </button>

        <div className="h-4 w-4 border-t-2 border-r-2 border-green/60" />
      </div>

      {/* Bottom Left Corner Bracket & Live Coordinates */}
      <div className="absolute bottom-3 left-3 flex items-end gap-2 font-mono text-[10.5px] text-text-faint sm:bottom-5 sm:left-5">
        <div className="h-4 w-4 border-b-2 border-l-2 border-green/60" />
        <div className="hidden md:block">
          <span className="text-text-dim">COORD: </span>
          <span className="text-green">
            X:{coords.x} Y:{coords.y}
          </span>
          <span className="mx-2 text-text-faint">|</span>
          <span className="text-text-dim">GRID: </span>
          <span>47.37°N 8.54°E</span>
        </div>
      </div>

      {/* Bottom Right Corner Bracket & Live Dual Clock */}
      <div className="absolute bottom-3 right-3 flex items-end gap-2 font-mono text-[10.5px] text-text-faint sm:bottom-5 sm:right-5">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-cyan font-bold">{timeGlobal}</span>
          <span>//</span>
          <span>{timeUtc}</span>
        </div>
        <div className="h-4 w-4 border-b-2 border-r-2 border-green/60" />
      </div>
    </div>
  )
}
