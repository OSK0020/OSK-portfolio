import { useEffect, useState } from 'react'
import { audio } from '../utils/audioEngine'

export function BootSequence() {
  const [bootStep, setBootStep] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const steps = [
    'ESTABLISHING SECURE PROTOCOL // OSK-CORE v4.8',
    'INITIALIZING SYNTHETIC SENSORY ARRAY & AUDIO ENGINE...',
    'SYNCING OSINT THREAT TELEMETRY & 3D GLOBE MATRIX...',
    'OPERATIONAL CLEARANCE GRANTED: LEVEL 5',
  ]

  useEffect(() => {
    // Check if booted in session
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
          }, 800)
          return prev
        }
        audio.playClick(1000 + prev * 200)
        return prev + 1
      })
    }, 450)

    return () => clearInterval(interval)
  }, [])

  if (isDone) return null

  const handleSkip = () => {
    setIsDone(true)
    sessionStorage.setItem('osk_booted', 'true')
    audio.playClick(1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06090b] p-6 font-mono transition-opacity duration-700">
      {/* Background CRT Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-40" />

      <div className="relative max-w-[620px] w-full rounded-2xl border border-green/30 bg-bg-panel p-8 shadow-[0_0_80px_rgba(61,255,160,0.15)]">
        <div className="flex items-center justify-between border-b border-line pb-4 text-xs text-text-faint">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green animate-ping" />
            <span className="text-green font-bold">OPERATIVE BOOT SEQUENCE</span>
          </div>
          <span>INIT_ID: #0020-OSK</span>
        </div>

        <div className="my-8 space-y-3 min-h-[140px]">
          {steps.slice(0, bootStep + 1).map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-cyan">[{idx + 1}/4]</span>
              <span className={idx === bootStep ? 'text-green font-bold animate-pulse' : 'text-text-dim'}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-bg-panel-alt overflow-hidden border border-line">
          <div
            className="h-full bg-green transition-all duration-300 shadow-[0_0_12px_var(--color-green)]"
            style={{ width: `${((bootStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[11px] text-text-faint">HOLD OR CLICK TO ENTER</span>
          <button
            onClick={handleSkip}
            className="rounded border border-line px-4 py-1.5 text-xs text-text-dim hover:border-green hover:text-green transition-colors"
          >
            SKIP SEQUENCE [ENTER] ↵
          </button>
        </div>
      </div>
    </div>
  )
}
