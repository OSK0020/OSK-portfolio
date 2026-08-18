import { useEffect, useState } from 'react'
import { audio } from '../utils/audioEngine'

export function BootSequence() {
  const [bootStep, setBootStep] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const steps = [
    'KERNEL_INIT: SECURE_CORE_v4.19 LOADED [OK]',
    'ESTABLISHING_NEURAL_LINK: OSINT_SAT_FEED [SYNCED]',
    'QUANTUM_BUFFER: 4096-BIT ALLOCATED // ZERO-ASSET SYNTH AUDIO [ACTIVE]',
    'AI_INFERENCE_ENGINE: ACCELERATOR_ONLINE [CUDA/ROCm]',
    'SYSTEM_STATUS: ALL DEFENSE & INTEL PROTOCOLS GREEN // CLEARANCE LEVEL 5',
  ]

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('osk_booted')
    if (hasBooted) {
      setIsDone(true)
      return
    }

    audio.playBootChord()

    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev + 1 >= steps.length) {
          clearInterval(interval)
          setTimeout(() => {
            setIsDone(true)
            sessionStorage.setItem('osk_booted', 'true')
          }, 600)
          return prev
        }
        audio.playKeystroke()
        return prev + 1
      })
    }, 420)

    return () => clearInterval(interval)
  }, [])

  if (isDone) return null

  const handleSkip = () => {
    setIsDone(true)
    sessionStorage.setItem('osk_booted', 'true')
    audio.playClick(1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg p-6 font-mono transition-opacity duration-700 select-none">
      {/* Background CRT Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-45" />

      <div className="relative max-w-[660px] w-full rounded-2xl border border-green/40 bg-bg-panel p-8 shadow-neon-green/30">
        <div className="flex items-center justify-between border-b border-line pb-4 text-xs text-text-faint">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green animate-ping" />
            <span className="text-green font-bold tracking-widest uppercase">TACTICAL COMMAND BOOT LOADER // v9.4</span>
          </div>
          <span className="text-cyan">UTC {new Date().toISOString().substring(11, 19)}</span>
        </div>

        <div className="my-8 space-y-2.5 min-h-[160px] border-l-2 border-green/30 pl-4">
          {steps.slice(0, bootStep + 1).map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-cyan font-bold">❯</span>
              <span className={idx === bootStep ? 'text-green font-bold animate-pulse' : 'text-text-dim'}>
                {step}
              </span>
            </div>
          ))}
          <div className="animate-pulse text-cyan">_</div>
        </div>

        {/* Progress Bar & Footer */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-cyan">
            <span>CORE_DEPLOYMENT</span>
            <span className="font-bold">{Math.round(((bootStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bg-panel-alt overflow-hidden border border-line">
            <div
              className="h-full bg-gradient-to-r from-cyan via-green to-cyan transition-all duration-300 shadow-[0_0_12px_var(--color-green)]"
              style={{ width: `${((bootStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
          <span className="text-[11px] text-text-faint">CLICK OR PRESS ENTER TO INITIALIZE</span>
          <button
            onClick={handleSkip}
            className="rounded border border-line bg-bg-panel-alt px-4 py-1.5 text-xs text-text-dim hover:border-green hover:text-green hover:shadow-neon-green/20 transition-all"
          >
            SKIP SEQUENCE [ENTER] ↵
          </button>
        </div>
      </div>
    </div>
  )
}
