import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { audioEngine } from '../utils/audioEngine'
import { subterraneanAudio } from '../utils/subterraneanAudio'

interface Props {
  onComplete?: () => void
}

const BOOT_LOGS = [
  'OSK_0020 // SECURE NODE HANDSHAKE',
  'OSN GLOBAL INTELLIGENCE GRID: CONNECTED',
  'AUTONOMOUS AGENT BOTS: 6/6 ONLINE',
  'BIOMETRIC CLEARANCE: LEVEL 5 GRANTED',
]

export const MinimalTacticalSplash: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Fast tactical boot sequence (approx 1.6s)
  useEffect(() => {
    const startTime = performance.now()
    const duration = 1500 // 1.5s

    const update = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(100, Math.floor((elapsed / duration) * 100))
      setProgress(p)

      // Update log line
      const currentLog = Math.min(BOOT_LOGS.length - 1, Math.floor((p / 100) * BOOT_LOGS.length))
      setLogIndex(currentLog)

      if (p < 100) {
        requestAnimationFrame(update)
      } else {
        setIsReady(true)
        subterraneanAudio.playShaftDrop()
        // Auto-dismiss after brief moment
        setTimeout(() => {
          handleEnter()
        }, 400)
      }
    }

    const anim = requestAnimationFrame(update)
    return () => cancelAnimationFrame(anim)
  }, [])

  const handleEnter = () => {
    if (isDismissed) return
    setIsDismissed(true)
    audioEngine.playAirlockDecompress()
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 40, 80])
      } catch {
        // Ignored
      }
    }
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 600)
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(12px)',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] text-white select-none overflow-hidden"
        >
          {/* Subtle Ambient Grid & Center Glow */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Top Classification Bar */}
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between font-mono text-[11px] text-zinc-500 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-300 font-bold tracking-widest">OSK // SUB-FACILITY</span>
            </div>
            <div className="tracking-widest hidden sm:block text-zinc-600">
              SYS_INIT // SECURE CHANNEL
            </div>
            <div className="text-emerald-400 font-bold">CET / UTC ACTIVE</div>
          </div>

          {/* Center Tactical Reticle & Decryption Card */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
            {/* Animated Tactical Reticle Ring */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              {/* Outer dashed spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40"
              />
              {/* Inner fast spinning brackets */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
                className="absolute inset-2 rounded-full border-t-2 border-b-2 border-emerald-400/80"
              />
              {/* Center Target Crosshair */}
              <div className="relative flex flex-col items-center justify-center font-mono">
                <span className="text-[10px] text-emerald-400 font-bold tracking-widest">OSK</span>
                <span className="text-[8px] text-zinc-500 font-bold">_0020</span>
              </div>
            </div>

            {/* System Identifier Title */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-white mb-2 font-mono uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              INITIALIZING AIRLOCK
            </h1>

            {/* Live Changing Boot Terminal Line */}
            <div className="h-6 flex items-center justify-center mb-6">
              <motion.p
                key={logIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs text-zinc-400 tracking-wider"
              >
                &gt; {BOOT_LOGS[logIndex]}
              </motion.p>
            </div>

            {/* Precision 2px Progress Bar */}
            <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800 rounded-full overflow-hidden p-0.5 mb-3">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full transition-all duration-75 shadow-[0_0_12px_#10b981]"
              />
            </div>

            {/* Progress Percentage & Status */}
            <div className="w-full flex items-center justify-between font-mono text-[11px] text-zinc-500 mb-8">
              <span>DECRYPTING: {progress}%</span>
              <span className="text-emerald-400 font-bold">
                {progress === 100 ? 'ACCESS AUTHORIZED' : 'SYNCHRONIZING...'}
              </span>
            </div>

            {/* Instant Skip / Enter Button */}
            <button
              onClick={handleEnter}
              className="px-6 py-2 bg-zinc-900/80 hover:bg-emerald-500/20 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-white font-mono text-xs tracking-widest uppercase rounded-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              [ {isReady ? 'ENTER FACILITY ↵' : 'SKIP INTRO ↵'} ]
            </button>
          </div>

          {/* Bottom Coordinates & Node Status */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] text-zinc-600 border-t border-zinc-800/80 pt-3">
            <div>NODE: ZURICH // 47.37°N 8.54°E</div>
            <div className="text-zinc-500 hidden sm:block">STATUS: LEVEL 01 READY</div>
            <div>VER: 4.2.0 // DEEP_RECON</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
