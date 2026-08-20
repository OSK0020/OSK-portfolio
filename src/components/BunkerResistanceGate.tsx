import React, { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, useSpring, motion } from 'framer-motion'
import { tacticalAudio } from '../utils/tacticalAudio'

interface BunkerResistanceGateProps {
  gateId: string
  levelName: string
  fromDepth: number
  toDepth: number
  radiationUSv?: number // Radiation level in micro-Sieverts per hour
  doorType?: 'blast' | 'iris' | 'reactor'
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
}

export const BunkerResistanceGate: React.FC<BunkerResistanceGateProps> = ({
  gateId,
  levelName,
  fromDepth,
  toDepth,
  radiationUSv = 1.4,
  doorType = 'blast',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const [isBreached, setIsBreached] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 22,
    stiffness: 110,
    mass: 0.9,
  })

  const pressurePercent = useTransform(smoothProgress, [0, 0.7], [0, 100])
  const currentDepth = useTransform(smoothProgress, [0, 1], [fromDepth, toDepth])

  // Screen shake / vibration
  const shakeX = useTransform(smoothProgress, (p) => {
    if (p > 0.25 && p < 0.7) {
      return (Math.random() - 0.5) * (p * 22)
    }
    return 0
  })

  const shakeY = useTransform(smoothProgress, (p) => {
    if (p > 0.25 && p < 0.7) {
      return (Math.random() - 0.5) * (p * 14)
    }
    return 0
  })

  // RGB Chromatic Aberration Displacement under high tension
  const rgbShift = useTransform(smoothProgress, (p) => {
    if (p > 0.3 && p < 0.7) {
      const dist = ((p - 0.3) / 0.4) * 6
      return `${-dist}px 0px 0px rgba(239, 68, 68, 0.8), ${dist}px 0px 0px rgba(6, 182, 212, 0.8)`
    }
    return 'none'
  })

  // Door kinematics
  const leftDoorX = useTransform(smoothProgress, [0.65, 0.96], ['0%', '-100%'])
  const rightDoorX = useTransform(smoothProgress, [0.65, 0.96], ['0%', '100%'])
  const irisRotation = useTransform(smoothProgress, [0.65, 0.96], [0, 180])
  const irisScale = useTransform(smoothProgress, [0.65, 0.96], [1, 3.2])
  const irisOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0])

  // Breach flash
  const flashOpacity = useTransform(smoothProgress, [0.68, 0.74, 0.88], [0, 1, 0])
  const emergencyRedOpacity = useTransform(smoothProgress, [0.2, 0.68, 0.88], [0, 0.4, 0])
  const hudOpacity = useTransform(smoothProgress, [0.05, 0.22, 0.66, 0.85], [0, 1, 1, 0])
  const hudScale = useTransform(smoothProgress, [0, 0.68], [0.95, 1.06])

  // Spark & Steam Particle Generator
  const spawnBreachParticles = () => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const count = 120
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < count; i++) {
      const isSpark = Math.random() > 0.4
      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 300,
        vx: (Math.random() - 0.5) * (isSpark ? 18 : 8),
        vy: (Math.random() - 0.5) * (isSpark ? 18 : 6),
        size: isSpark ? Math.random() * 3 + 1 : Math.random() * 25 + 10,
        alpha: 1,
        color: isSpark ? (Math.random() > 0.5 ? '#fbbf24' : '#f97316') : '#10b981',
        life: isSpark ? Math.random() * 40 + 20 : Math.random() * 60 + 40,
      })
    }
  }

  // Particle Canvas Render Loop
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 1 / p.life
        p.vx *= 0.96
        p.vy *= 0.96

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1)
        }
      })

      animId = requestAnimationFrame(updateParticles)
    }

    updateParticles()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Audio, Haptic & Geiger Radiation Synchronization
  useEffect(() => {
    let lastGeigerTime = 0

    const unsub = smoothProgress.on('change', (p) => {
      // 1. Hydraulic Tension Sound & Geiger Clicks
      if (p > 0.25 && p < 0.68) {
        tacticalAudio.playHydraulicBuildup(p / 0.68)

        const now = Date.now()
        const geigerInterval = Math.max(70, 400 - radiationUSv * 25 - p * 200)
        if (now - lastGeigerTime > geigerInterval) {
          tacticalAudio.triggerGeigerClick(radiationUSv)
          lastGeigerTime = now
        }
      }

      // 2. Iris Servo Movement
      if (doorType === 'iris' && p >= 0.65 && p < 0.95) {
        tacticalAudio.playIrisServo(p)
      }

      // 3. Blast Breach Trigger (Sparks, Steam, Seismic Clank, Haptics)
      if (p >= 0.68 && !isBreached) {
        setIsBreached(true)
        tacticalAudio.playBlastBreach()
        spawnBreachParticles()

        // Haptic Vibration for Mobile Devices
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 150, 80, 400])
          } catch {
            // Ignored
          }
        }
      } else if (p < 0.65 && isBreached) {
        setIsBreached(false)
      }
    })

    return () => unsub()
  }, [smoothProgress, isBreached, radiationUSv, doorType])

  return (
    <div
      ref={containerRef}
      className="relative h-[270vh] w-full bg-black z-30 select-none overflow-clip"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Spark and Steam Particles Canvas */}
        <canvas ref={particleCanvasRef} className="absolute inset-0 z-30 pointer-events-none" />

        {/* Emergency Red Lighting Overlay */}
        <motion.div
          style={{ opacity: emergencyRedOpacity }}
          className="absolute inset-0 bg-red-600/30 mix-blend-color-dodge pointer-events-none z-10"
        />

        {/* Breach Light Flash */}
        <motion.div
          style={{ opacity: flashOpacity }}
          className="absolute inset-0 bg-emerald-400 mix-blend-screen pointer-events-none z-40"
        />

        {/* Blast Doors */}
        {doorType === 'blast' && (
          <motion.div
            style={{ x: shakeX, y: shakeY }}
            className="absolute inset-0 flex z-20 pointer-events-none"
          >
            {/* Left Wing */}
            <motion.div
              style={{ x: leftDoorX }}
              className="w-1/2 h-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-r-4 border-emerald-500/50 relative flex items-center justify-end p-8 shadow-[15px_0_60px_rgba(0,0,0,0.95)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="w-14 h-3/4 border-r-2 border-dashed border-amber-500/40 mr-8 flex flex-col justify-between py-10">
                <span className="text-[11px] text-amber-500/70 font-mono tracking-widest -rotate-90 font-bold">
                  HEAVY SECTOR SEAL
                </span>
                <span className="text-[11px] text-amber-500/70 font-mono tracking-widest -rotate-90 font-bold">
                  PRESSURE BARRIER
                </span>
              </div>
              <div className="w-3 h-64 bg-emerald-500/30 rounded-full animate-pulse mr-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </motion.div>

            {/* Right Wing */}
            <motion.div
              style={{ x: rightDoorX }}
              className="w-1/2 h-full bg-gradient-to-l from-zinc-950 via-zinc-900 to-zinc-950 border-l-4 border-emerald-500/50 relative flex items-center justify-start p-8 shadow-[-15px_0_60px_rgba(0,0,0,0.95)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="w-3 h-64 bg-emerald-500/30 rounded-full animate-pulse ml-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <div className="w-14 h-3/4 border-l-2 border-dashed border-amber-500/40 ml-8 flex flex-col justify-between py-10">
                <span className="text-[11px] text-amber-500/70 font-mono tracking-widest rotate-90 font-bold">
                  {gateId}
                </span>
                <span className="text-[11px] text-amber-500/70 font-mono tracking-widest rotate-90 font-bold">
                  PNEUMATIC LOCK
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Iris Vault Door */}
        {doorType === 'iris' && (
          <motion.div
            style={{
              rotate: irisRotation,
              scale: irisScale,
              opacity: irisOpacity,
              x: shakeX,
              y: shakeY,
            }}
            className="absolute z-20 pointer-events-none w-[130vw] h-[130vw] rounded-full border-[140px] border-zinc-950 shadow-[0_0_150px_rgba(0,0,0,1)] flex items-center justify-center"
          >
            <div className="w-full h-full border-8 border-dashed border-red-500/40 rounded-full animate-[spin_60s_linear_infinite]" />
          </motion.div>
        )}

        {/* Central HUD with RGB Chromatic Aberration */}
        <motion.div
          style={{
            opacity: hudOpacity,
            scale: hudScale,
            x: shakeX,
            y: shakeY,
          }}
          className="relative z-30 flex flex-col items-center justify-center p-8 bg-black/90 border border-emerald-500/40 backdrop-blur-md rounded-xl font-mono text-emerald-400 max-w-lg w-full mx-4 shadow-[0_0_60px_rgba(16,185,129,0.2)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-4 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-xs font-bold tracking-widest text-emerald-300">
                PRESSURE LOCK // {gateId}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              RAD: {radiationUSv} μSv/h
            </span>
          </div>

          {/* Title with RGB Aberration Effect */}
          <motion.h3
            style={{ textShadow: rgbShift }}
            className="text-xl md:text-2xl font-black tracking-wider text-white mb-1 text-center"
          >
            {levelName.toUpperCase()}
          </motion.h3>

          <p className="text-xs text-zinc-400 mb-6">
            TRANSIT:{' '}
            <motion.span className="text-emerald-300 font-bold">
              {useTransform(currentDepth, (d) => `${d.toFixed(1)}m`)}
            </motion.span>{' '}
            BENEATH SURFACE
          </p>

          {/* Dynamic Hydraulic Load Progress Bar */}
          <div className="w-full bg-zinc-950 h-3.5 border border-emerald-500/30 rounded-full overflow-hidden p-0.5 mb-3 shadow-inner">
            <motion.div
              style={{
                width: useTransform(pressurePercent, (p) => `${Math.min(100, p)}%`),
                backgroundColor: useTransform(
                  pressurePercent,
                  [0, 55, 90, 100],
                  ['#10b981', '#eab308', '#ef4444', '#ffffff']
                ),
              }}
              className="h-full rounded-full transition-all duration-75 shadow-[0_0_12px_currentColor]"
            />
          </div>

          <div className="w-full flex justify-between text-[11px] font-bold">
            <span className="text-zinc-400">
              HYDRAULIC LOAD:{' '}
              <motion.span className="text-emerald-300">
                {useTransform(pressurePercent, (p) => `${p.toFixed(0)}%`)}
              </motion.span>
            </span>
            <span className="animate-pulse text-amber-400 tracking-wider">
              SCROLL FORCE TO OVERRIDE
            </span>
          </div>
        </motion.div>

        {/* Subterranean Background */}
        <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>
      </div>
    </div>
  )
}
