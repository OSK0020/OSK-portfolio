import { useEffect, useState } from 'react'
import { audio } from '../utils/audioEngine'

export function TacticalHUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [timeUtc, setTimeUtc] = useState('')
  const [timeJerusalem, setTimeJerusalem] = useState('')
  const [isMuted, setIsMuted] = useState(() => audio.getMuted())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeUtc(`${now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC`)
      setTimeJerusalem(`${now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', second: '2-digit' })} TLV`)
    }
    updateTime()
    const timer = window.setInterval(updateTime, 1000)

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const handleMouseMove = (event: MouseEvent) => setCoords({ x: event.clientX, y: event.clientY })
    if (!coarse) window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleToggleSound = () => setIsMuted(audio.toggleMute())

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      <div className="absolute left-3 top-3 flex items-start gap-2 font-mono text-[10px] text-text-faint sm:left-5 sm:top-5">
        <div className="h-4 w-4 border-l border-t border-green/60" />
        <div className="hidden sm:block"><span className="text-green">OSK//SYS.v5.0</span><span className="mx-2">|</span><span>NET: SECURE</span></div>
      </div>

      <div className="pointer-events-auto absolute right-3 top-3 flex items-center gap-3 font-mono text-[10px] sm:right-5 sm:top-5">
        <button
          type="button"
          onClick={handleToggleSound}
          onMouseEnter={() => audio.playHover()}
          className={`flex items-center gap-1.5 rounded border px-2.5 py-1 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green ${!isMuted ? 'border-green/60 bg-green/10 text-green shadow-[0_0_10px_rgba(61,255,160,0.2)]' : 'border-line bg-bg-panel text-text-faint hover:text-text-dim'}`}
          aria-label={isMuted ? 'Enable synthesized audio' : 'Mute synthesized audio'}
          aria-pressed={isMuted}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${!isMuted ? 'bg-green shadow-[0_0_7px_var(--color-green)]' : 'bg-text-faint'}`} />
          <span>AUDIO: {isMuted ? 'MUTED' : 'SYNTH ON'}</span>
        </button>
        <div className="h-4 w-4 border-r border-t border-green/60" />
      </div>

      <div className="absolute bottom-3 left-3 flex items-end gap-2 font-mono text-[10px] text-text-faint sm:bottom-5 sm:left-5">
        <div className="h-4 w-4 border-b border-l border-green/60" />
        <div className="hidden md:block"><span className="text-text-dim">CURSOR </span><span className="text-green">X:{coords.x} Y:{coords.y}</span><span className="mx-2">|</span><span>GRID: 32.08°N 34.78°E</span></div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-end gap-2 font-mono text-[10px] text-text-faint sm:bottom-5 sm:right-5">
        <div className="hidden items-center gap-2 sm:flex"><span className="text-cyan">{timeJerusalem}</span><span>//</span><span>{timeUtc}</span></div>
        <div className="h-4 w-4 border-b border-r border-green/60" />
      </div>
    </div>
  )
}
