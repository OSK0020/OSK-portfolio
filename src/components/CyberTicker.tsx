import { useEffect, useState } from 'react'

const INTEL_FEEDS = [
  { label: 'DEFCON 2', text: 'GLOBAL DEFENSE SECTOR 01 // HEIGHTENED READINESS ACTIVE', color: 'text-red', border: 'border-red/40', bg: 'bg-red/10' },
  { label: 'OSINT RADAR', text: '4.2k SIGNALS/SEC INGESTED WITH 38ms STREAM LATENCY', color: 'text-green', border: 'border-green/40', bg: 'bg-green/10' },
  { label: 'SAT-LINK 09', text: 'INTERNATIONAL MARITIME CORRIDOR & SATELLITE RADAR MONITORED', color: 'text-cyan', border: 'border-cyan/40', bg: 'bg-cyan/10' },
  { label: 'AI INFERENCE', text: '4-MODEL GEMINI CASCADE RUNNING 24/7 // ZERO DROP RATE', color: 'text-amber', border: 'border-amber/40', bg: 'bg-amber/10' },
  { label: 'GEO MATRIX', text: '412 GEO-NODES SYNCHRONIZED ON 3D FIBONACCI PROJECTION', color: 'text-cyan', border: 'border-cyan/40', bg: 'bg-cyan/10' },
  { label: 'SECURITY CIPHER', text: 'AES-256-GCM QUANTUM BUFFER VERIFIED & OPERATIONAL', color: 'text-green', border: 'border-green/40', bg: 'bg-green/10' },
]

export function CyberTicker() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % INTEL_FEEDS.length)
        setFade(true)
      }, 300)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

  const current = INTEL_FEEDS[index]

  return (
    <div className="relative z-30 border-b border-line bg-bg-panel/90 backdrop-blur-md font-mono text-[11px] select-none">
      <div className="mx-auto flex h-10 max-w-[1240px] items-center justify-between px-6">
        {/* Left Side: Live Feed Blip and Text */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="font-bold uppercase tracking-wider text-red">LIVE_INTEL //</span>
          </div>

          <div
            className={`flex items-center gap-2 transition-opacity duration-300 truncate ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span
              className={`hidden sm:inline-block rounded border px-1.5 py-0.5 text-[9.5px] font-bold ${current.border} ${current.bg} ${current.color}`}
            >
              {current.label}
            </span>
            <span className="text-text-dim truncate tracking-wide text-xs">
              {current.text}
            </span>
          </div>
        </div>

        {/* Right Side: Telemetry Status Badges */}
        <div className="hidden md:flex items-center gap-4 text-text-faint text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            <span>ENCRYPTED_FEED</span>
          </div>
          <span className="text-line-soft">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan font-bold">48 FEEDS SYNCED</span>
          </div>
          <span className="text-line-soft">|</span>
          <span className="text-green font-bold">99.9% UPTIME</span>
        </div>
      </div>
    </div>
  )
}
