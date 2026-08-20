import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BunkerLevelGateProps {
  level: number
  code: string
  title: string
  depth: string
  clearance: string
  status?: string
}

export function BunkerLevelGate({
  level,
  code,
  title,
  depth,
  clearance,
  status = 'AIRLOCK DECOMPRESSION: COMPLETE // CLEARANCE VERIFIED',
}: BunkerLevelGateProps) {
  const gateRef = useRef<HTMLDivElement | null>(null)
  const stripeTopRef = useRef<HTMLDivElement | null>(null)
  const stripeBottomRef = useRef<HTMLDivElement | null>(null)
  const hasTriggeredAudioRef = useRef(false)

  useEffect(() => {
    const el = gateRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredAudioRef.current) {
            hasTriggeredAudioRef.current = true
            audio.playAirlockDecompress()
          }
        })
      },
      { threshold: 0.35 }
    )

    observer.observe(el)

    // GSAP Parallax Drift on Hazard Warning Stripes
    const ctx = gsap.context(() => {
      if (stripeTopRef.current) {
        gsap.to(stripeTopRef.current, {
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
          backgroundPosition: '120px 0',
        })
      }
      if (stripeBottomRef.current) {
        gsap.to(stripeBottomRef.current, {
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
          backgroundPosition: '-120px 0',
        })
      }
    }, el)

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={gateRef}
      className="relative py-14 overflow-hidden border-y-2 border-line bg-gradient-to-r from-bg-panel/95 via-bg-panel-alt/90 to-bg-panel/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      {/* Top and Bottom Warning Hazard Stripes with Parallax */}
      <div
        ref={stripeTopRef}
        className="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#ffb800,#ffb800_10px,#05080e_10px,#05080e_20px)] opacity-70"
      />
      <div
        ref={stripeBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#ffb800,#ffb800_10px,#05080e_10px,#05080e_20px)] opacity-70"
      />

      {/* Decorative Diagonal Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono">
            {/* Left Level Indicator & Hydraulic Valve */}
            <div className="flex items-center gap-5">
              {/* Hydraulic Decompression Badge */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-cyan/70 bg-cyan/15 text-cyan font-bold text-xl shadow-[0_0_25px_rgba(0,240,255,0.35)]">
                <span>L-{level}</span>
                <div className="pointer-events-none absolute inset-0 animate-ping rounded-2xl border border-cyan/40 opacity-40" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-text-faint">
                  <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                  <span className="text-cyan font-bold uppercase tracking-widest">{code}</span>
                  <span className="text-text-faint">|</span>
                  <span className="text-green font-bold">DEPTH: {depth}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-text tracking-wide font-display mt-0.5">
                  {title}
                </h3>
              </div>
            </div>

            {/* Right Clearance & Decompression Valves */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-right">
              <div className="rounded-lg border border-amber/40 bg-amber/10 px-3.5 py-2 text-text-dim">
                CLEARANCE: <span className="text-amber font-bold">{clearance}</span>
              </div>
              <div className="rounded-lg border border-green/40 bg-green/15 px-3.5 py-2 text-green font-bold shadow-[0_0_15px_rgba(0,255,157,0.2)] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green animate-ping" />
                <span>{status}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
