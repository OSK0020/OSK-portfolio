import { useEffect, useState } from 'react'
import { audio } from '../utils/audioEngine'

export function BootSequence() {
  const [bootState, setBootState] = useState<'gate' | 'booting' | 'completed'>('gate')
  const [bootStep, setBootStep] = useState(0)

  const steps = [
    'KERNEL_INIT: SECURE_CORE_v5.4 LOADED [OK]',
    'ESTABLISHING_NEURAL_LINK: OSINT_SAT_FEED [SYNCED // 48 FEEDS]',
    'QUANTUM_BUFFER: 4096-BIT ALLOCATED // ZERO-ASSET PROCEDURAL AUDIO [ACTIVE]',
    'AI_INFERENCE_ENGINE: CUDA 12.4 ACCELERATOR ONLINE [4-MODEL CASCADE]',
    'GEOSPATIAL_MATRIX: 412 GEO-NODES MAPPED TO 3D FIBONACCI SPHERE',
    'ACCESS_GRANTED: CLEARANCE LEVEL-5 // ALL DEFENSE PROTOCOLS GREEN',
  ]

  const startBoot = () => {
    audio.unlock()
    audio.playBootChord()
    setBootState('booting')
    setBootStep(0)
  }

  useEffect(() => {
    if (bootState !== 'booting') return

    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev + 1 >= steps.length) {
          clearInterval(interval)
          audio.playAccessGranted()
          setTimeout(() => {
            setBootState('completed')
          }, 800)
          return prev
        }
        audio.playKeystroke()
        return prev + 1
      })
    }, 400)

    return () => clearInterval(interval)
  }, [bootState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (bootState === 'gate') {
          startBoot()
        } else if (bootState === 'booting') {
          handleSkip()
        }
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }
    const handleReplay = () => {
      setBootState('gate')
      setBootStep(0)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('osk:replay-boot', handleReplay)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('osk:replay-boot', handleReplay)
    }
  }, [bootState])

  const handleSkip = () => {
    audio.unlock()
    audio.playClick(1400)
    setBootState('completed')
  }

  if (bootState === 'completed') return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg p-6 font-mono select-none overflow-hidden transition-opacity duration-700">
      {/* Background CRT Scanlines & Cyber Grid */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      {/* Cyber Ambient Glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-[450px] w-[450px] rounded-full bg-green/10 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full bg-cyan/10 blur-[150px]" />

      {bootState === 'gate' ? (
        /* ==================== STAGE 1: CINEMATIC ENTRY GATE ==================== */
        <div className="relative max-w-[580px] w-full rounded-2xl border border-green/40 bg-bg-panel/95 p-8 text-center shadow-[0_0_60px_rgba(0,255,157,0.25)] backdrop-blur-2xl animate-fadeIn">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-line pb-4 text-xs text-text-faint">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red animate-ping" />
              <span className="text-red font-bold tracking-widest uppercase">
                SECURITY CLEARANCE REQUIRED
              </span>
            </div>
            <span className="text-cyan text-[11px]">SYS // OSK_0020</span>
          </div>

          {/* Center Holographic Reticle */}
          <div className="my-8 flex flex-col items-center justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              {/* Outer Pulsing Rings */}
              <div className="absolute inset-0 rounded-full border border-green/30 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan/40 animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-5 rounded-full bg-green/5 animate-pulse" />

              {/* Center Skull/Target Icon */}
              <svg className="h-10 w-10 text-green drop-shadow-[0_0_12px_var(--color-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold font-display text-text tracking-wide">
              TACTICAL COMMAND MATRIX
            </h2>
            <p className="mt-2 text-xs text-text-dim max-w-[42ch]">
              Initialize encrypted neural feed &amp; procedural Web Audio sound synthesis engine.
            </p>
          </div>

          {/* Interactive Unlock CTA */}
          <div className="space-y-3">
            <button
              onClick={startBoot}
              onMouseEnter={() => audio.playHover()}
              className="group relative w-full overflow-hidden rounded-xl border border-green bg-green/15 py-4 text-xs font-bold uppercase tracking-widest text-green transition-all hover:bg-green hover:text-[#05080e] hover:shadow-[0_0_35px_rgba(0,255,157,0.5)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>[ INITIALIZE TACTICAL SYSTEM ]</span>
                <span className="transition-transform group-hover:translate-x-1">↵</span>
              </span>
            </button>

            <div className="flex items-center justify-between pt-2 text-[10.5px] text-text-faint">
              <span>PRESS <strong className="text-text">ENTER</strong> TO INITIALIZE</span>
              <button
                onClick={handleSkip}
                className="hover:text-text underline cursor-pointer"
              >
                DIRECT ACCESS [ESC]
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== STAGE 2: LIVE TERMINAL BOOT SEQUENCE ==================== */
        <div className="relative max-w-[660px] w-full rounded-2xl border border-green/50 bg-bg-panel/95 p-8 shadow-[0_0_80px_rgba(0,255,157,0.3)] backdrop-blur-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-line pb-4 text-xs text-text-faint">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green animate-ping" />
              <span className="text-green font-bold tracking-widest uppercase">
                TACTICAL BOOT LOADER // RUNNING
              </span>
            </div>
            <span className="text-cyan">UTC {new Date().toISOString().substring(11, 19)}</span>
          </div>

          <div className="my-8 space-y-2.5 min-h-[180px] border-l-2 border-green/40 pl-4">
            {steps.slice(0, bootStep + 1).map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="text-cyan font-bold">❯</span>
                <span
                  className={
                    idx === bootStep
                      ? 'text-green font-bold animate-pulse'
                      : 'text-text-dim'
                  }
                >
                  {step}
                </span>
              </div>
            ))}
            <div className="animate-pulse text-cyan">_</div>
          </div>

          {/* Progress Bar & Footer */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-cyan font-bold">
              <span>CORE_DEPLOYMENT_PROGRESS</span>
              <span>{Math.round(((bootStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bg-panel-alt overflow-hidden border border-line">
              <div
                className="h-full bg-gradient-to-r from-cyan via-green to-cyan transition-all duration-300 shadow-[0_0_15px_var(--color-green)]"
                style={{ width: `${((bootStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs">
            <span className="text-[11px] text-text-faint">AUDIO SYNTHESIS: ONLINE</span>
            <button
              onClick={handleSkip}
              className="rounded border border-line bg-bg-panel-alt px-4 py-1.5 text-xs text-text-dim hover:border-green hover:text-green hover:shadow-neon-green/20 transition-all cursor-pointer"
            >
              SKIP [ESC] ↵
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
