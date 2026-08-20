import React, { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, useSpring, motion } from 'framer-motion'
import { subterraneanAudio } from '../utils/subterraneanAudio'

interface SubterraneanDescentGateProps {
  gateTag: string
  destinationLabel: string
  fromDepth: number
  toDepth: number
  strataLayer: string
  sequenceFolder?: 'cyber_amber' | 'cyber_violet' | 'cyber_crimson'
}

export const SubterraneanDescentGate: React.FC<SubterraneanDescentGateProps> = ({
  gateTag,
  destinationLabel,
  fromDepth,
  toDepth,
  strataLayer,
  sequenceFolder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasDropped, setHasDropped] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Heavier spring physics for solid, mechanical resistance
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 90,
    mass: 1.0,
  })

  // Tension & Depth calculations
  const tensionPercent = useTransform(smoothProgress, [0, 0.60], [0, 100])
  const currentDepth = useTransform(smoothProgress, [0, 1], [fromDepth, toDepth])

  // Heavy Blast Door movement: Slides open smoothly from 0.58 to 0.88 of scroll
  const leftDoorX = useTransform(smoothProgress, [0.58, 0.88], ['0%', '-105%'])
  const rightDoorX = useTransform(smoothProgress, [0.58, 0.88], ['0%', '105%'])

  // Seismic Ground Tremor / Screen Shake during door breach (0.58 to 0.88)
  const shakeX = useTransform(smoothProgress, (p) => {
    if (p >= 0.58 && p <= 0.88) {
      const envelope = 1 - Math.abs(p - 0.73) / 0.15
      return Math.sin(p * 95) * Math.max(0, envelope) * 4.5
    }
    return 0
  })

  const shakeY = useTransform(smoothProgress, (p) => {
    if (p >= 0.58 && p <= 0.88) {
      const envelope = 1 - Math.abs(p - 0.73) / 0.15
      return Math.cos(p * 80) * Math.max(0, envelope) * 3.5
    }
    return 0
  })

  // Light reveal and corridor forward transit push (0.58 to 0.98)
  const lightOpacity = useTransform(smoothProgress, [0.58, 0.82, 0.94, 0.99], [0, 1, 1, 0])
  const corridorScale = useTransform(smoothProgress, [0.58, 0.88, 0.99], [0.94, 1.0, 1.22])

  // Sound and Haptic sync
  useEffect(() => {
    const unsub = smoothProgress.on('change', (p) => {
      // Sound Tension buildup
      if (p > 0.15 && p < 0.60) {
        subterraneanAudio.playTensionBuild(p / 0.60)
      }

      // Door Breach Clank & Seismic Shake Trigger
      if (p >= 0.60 && !hasDropped) {
        setHasDropped(true)
        subterraneanAudio.playShaftDrop()
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([30, 40, 30, 80, 40, 120])
          } catch {
            // Ignored
          }
        }
      } else if (p < 0.56 && hasDropped) {
        setHasDropped(false)
      }
    })

    return () => unsub()
  }, [smoothProgress, hasDropped])

  const folder = sequenceFolder || 'cyber_amber'
  const leftDoorImg = `/assets/${folder}_left.jpg`
  const rightDoorImg = `/assets/${folder}_right.jpg`

  // Dynamic Theme Color Mapping
  const isAmber = folder === 'cyber_amber'
  const isViolet = folder === 'cyber_violet'

  const lightBurstBg = isAmber
    ? 'bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.24)_0%,rgba(217,119,6,0.14)_35%,transparent_75%)]'
    : isViolet
      ? 'bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.24)_0%,rgba(147,51,234,0.14)_35%,transparent_75%)]'
      : 'bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.24)_0%,rgba(185,28,28,0.14)_35%,transparent_75%)]'

  const lightSeamShadow = isAmber
    ? 'shadow-[0_0_95px_#f59e0b]'
    : isViolet
      ? 'shadow-[0_0_95px_#a855f7]'
      : 'shadow-[0_0_95px_#ef4444]'

  const accentTextColor = isAmber
    ? 'text-amber-400'
    : isViolet
      ? 'text-purple-400'
      : 'text-red-500'

  const progressBarColor = isAmber
    ? '#f59e0b'
    : isViolet
      ? '#a855f7'
      : '#ef4444'

  return (
    <div
      ref={containerRef}
      className="relative h-[360vh] w-full bg-black z-30 select-none overflow-clip"
    >
      {/* Sticky Viewport with Seismic Screen Shake Tremor */}
      <motion.div
        style={{ x: shakeX, y: shakeY }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#040507]"
      >
        {/* CENTER BEHIND DOORS: Volumetric Light & Deep Corridor Transit */}
        <motion.div
          style={{ opacity: lightOpacity, scale: corridorScale }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Volumetric Center Light Burst matching Gate Color */}
          <div className={`absolute inset-0 ${lightBurstBg}`} />

          {/* Deep Tunnel Grid Perspective Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />

          {/* Vertical Bright Light Seam */}
          <div className={`w-1.5 md:w-2.5 h-full bg-white/50 blur-[8px] ${lightSeamShadow}`} />

          {/* Chamber Entryway Telemetry Banner */}
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center font-mono z-12 px-4">
            <span
              className={`text-[11px] ${accentTextColor} tracking-[0.4em] uppercase mb-2 animate-pulse font-bold`}
            >
              ● AIRLOCK BREACH VERIFIED
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
              {destinationLabel}
            </h2>
            <div className="flex items-center gap-3 mt-4 text-xs font-mono text-zinc-400">
              <span className={`${accentTextColor} font-bold tracking-wider`}>
                {toDepth}m DEPTH
              </span>
              <span>//</span>
              <span className="text-zinc-300">{strataLayer}</span>
            </div>
          </div>
        </motion.div>

        {/* Side Facility Wire Mesh Walls */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:8px_8px] border-r border-zinc-800/80 z-25 pointer-events-none opacity-50 hidden sm:block" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:8px_8px] border-l border-zinc-800/80 z-25 pointer-events-none opacity-50 hidden sm:block" />

        {/* Overhead Hydraulic Actuator Bar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-transparent border-b border-zinc-800/60 z-25 pointer-events-none flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
            <span className={`h-2 w-2 rounded-full ${accentTextColor} animate-pulse`} />
            <span className="tracking-widest font-bold">PNEUMATIC ACTUATOR // {gateTag}</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-500 tracking-widest hidden md:block">
            HEAVY BLAST SEAL • SYSTEM ARMED
          </div>
        </div>

        {/* Ground Industrial Steel Grating */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-900/90 to-transparent border-t border-zinc-800/60 z-25 pointer-events-none flex items-center justify-between px-6 md:px-12">
          <div className="font-mono text-[10px] text-zinc-500">
            STRATA: <span className="text-zinc-300 font-semibold">{strataLayer}</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-500">
            TRANSIT VECTOR:{' '}
            <span className={`${accentTextColor} font-bold`}>{toDepth}m</span>
          </div>
        </div>

        {/* HEAVY INDUSTRIAL BLAST DOORS (Split Vertically Down The Middle) */}
        <div className="absolute inset-0 flex z-20 pointer-events-none overflow-hidden">
          {/* Left Door Wing with 4K Photorealistic Asset */}
          <motion.div
            style={{ x: leftDoorX }}
            className="w-1/2 h-full bg-[#0a0c10] border-r-4 border-zinc-700 relative flex items-center justify-end shadow-[30px_0_100px_rgba(0,0,0,1)] overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-right"
              style={{ backgroundImage: `url('${leftDoorImg}')` }}
            />
          </motion.div>

          {/* Right Door Wing with 4K Photorealistic Asset */}
          <motion.div
            style={{ x: rightDoorX }}
            className="w-1/2 h-full bg-[#0a0c10] border-l-4 border-zinc-700 relative flex items-center justify-start shadow-[-30px_0_100px_rgba(0,0,0,1)] overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-left"
              style={{ backgroundImage: `url('${rightDoorImg}')` }}
            />
          </motion.div>
        </div>

        {/* Subterranean Telemetry Tension HUD (Centered, smoothly fades out as doors open) */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0.05, 0.18, 0.52, 0.62], [0, 1, 1, 0]),
            scale: useTransform(smoothProgress, [0, 0.60], [0.96, 1.04]),
          }}
          className="relative z-30 flex flex-col items-center justify-center p-8 bg-zinc-950/92 border border-zinc-800 backdrop-blur-md rounded-xl font-mono text-zinc-300 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="flex items-center justify-between w-full mb-3 border-b border-zinc-800 pb-2">
            <span className={`text-xs font-bold tracking-widest ${accentTextColor} flex items-center gap-2`}>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>{gateTag}</span>
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">{strataLayer}</span>
          </div>

          <h3 className="text-xl font-bold tracking-wide text-white mb-1 text-center">
            {destinationLabel}
          </h3>
          <p className="text-xs text-zinc-400 mb-5">
            DESCENT VECTOR:{' '}
            <motion.span className={`${accentTextColor} font-bold`}>
              {useTransform(currentDepth, (d) => `${d.toFixed(0)}m`)}
            </motion.span>{' '}
            BELOW SURFACE
          </p>

          <div className="w-full bg-zinc-900 h-2.5 border border-zinc-800 rounded-full overflow-hidden p-0.5 mb-3">
            <motion.div
              style={{
                width: useTransform(tensionPercent, (p) => `${Math.min(100, p)}%`),
                backgroundColor: useTransform(
                  tensionPercent,
                  [0, 70, 100],
                  ['#52525b', progressBarColor, '#ef4444']
                ),
              }}
              className="h-full rounded-full transition-all duration-75 shadow-[0_0_10px_currentColor]"
            />
          </div>

          <div className="w-full flex justify-between text-[10px] text-zinc-500">
            <span>
              HYDRAULIC LOAD:{' '}
              <motion.span className="text-zinc-300">
                {useTransform(tensionPercent, (p) => `${p.toFixed(0)}%`)}
              </motion.span>
            </span>
            <span className={`animate-pulse ${accentTextColor} tracking-wider`}>
              SCROLL TO BREACH
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
