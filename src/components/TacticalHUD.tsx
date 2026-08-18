import { useEffect, useState } from 'react'
import { audio } from '../utils/audioEngine'

export function TacticalHUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [timeUtc, setTimeUtc] = useState('')
  const [timeJerusalem, setTimeJerusalem] = useState('')
  const [isMuted, setIsMuted] = useState(audio.getMuted())

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
      setTimeJerusalem(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Jerusalem',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' TLV'
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearInterval(timer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleToggleSound = () => {
    const newMute = audio.toggleMute()
    setIsMuted(newMute)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* Top Left Corner Bracket */}
      <div className="absolute top-3 left-3 flex items-start gap-2 font-mono text-[10.5px] text-text-faint sm:top-5 sm:left-5">
        <div className="h-4 w-4 border-t-2 border-l-2 border-green/60" />
        <div className="hidden sm:block">
          <span className="text-green">OSK//SYS.v4.8</span>
          <span className="mx-2 text-text-faint">|</span>
          <span>NET: SECURE</span>
        </div>
      </div>

      {/* Top Right Corner Bracket & Sound Toggle */}
      <div className="pointer-events-auto absolute top-3 right-3 flex items-center gap-3 font-mono text-[11px] sm:top-5 sm:right-5">
        <button
          onClick={handleToggleSound}
          onMouseEnter={() => audio.playHover()}
          className={`flex items-center gap-1.5 rounded border px-2.5 py-1 transition-all ${
            !isMuted
              ? 'border-green/60 bg-green/10 text-green shadow-[0_0_10px_rgba(61,255,160,0.2)]'
              : 'border-line bg-bg-panel text-text-faint hover:text-text-dim'
          }`}
          title="Toggle Synthesized Audio Feedback"
        >
          <span className="relative flex h-2 w-2">
            {!isMuted && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />}
            <span className={`inline-flex h-2 w-2 rounded-full ${!isMuted ? 'bg-green' : 'bg-text-faint'}`} />
          </span>
          <span>AUDIO: {isMuted ? 'MUTED' : 'SYNTH ON'}</span>
        </button>
        <div className="h-4 w-4 border-t-2 border-r-2 border-green/60" />
      </div>

      {/* Bottom Left Corner Bracket & Live Coordinates */}
      <div className="absolute bottom-3 left-3 flex items-end gap-2 font-mono text-[10.5px] text-text-faint sm:bottom-5 sm:left-5">
        <div className="h-4 w-4 border-b-2 border-l-2 border-green/60" />
        <div className="hidden md:block">
          <span className="text-text-dim">COORD: </span>
          <span className="text-green">X:{coords.x} Y:{coords.y}</span>
          <span className="mx-2 text-text-faint">|</span>
          <span className="text-text-dim">GRID: </span>
          <span>32.08°N 34.78°E</span>
        </div>
      </div>

      {/* Bottom Right Corner Bracket & Live Dual Clock */}
      <div className="absolute bottom-3 right-3 flex items-end gap-2 font-mono text-[10.5px] text-text-faint sm:bottom-5 sm:right-5">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-cyan">{timeJerusalem}</span>
          <span>//</span>
          <span>{timeUtc}</span>
        </div>
        <div className="h-4 w-4 border-b-2 border-r-2 border-green/60" />
      </div>
    </div>
  )
}
