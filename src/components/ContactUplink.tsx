import { useState } from 'react'
import { audio } from '../utils/audioEngine'
import { Reveal } from './Reveal'

export function ContactUplink() {
  const [callsign, setCallsign] = useState('')
  const [frequency, setFrequency] = useState<'DEFENSE' | 'COMMERCIAL' | 'AI_LAB'>('COMMERCIAL')
  const [message, setMessage] = useState('')
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitted, setTransmitted] = useState(false)

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsTransmitting(true)
    audio.playAlert()

    setTimeout(() => {
      setIsTransmitting(false)
      setTransmitted(true)
      audio.playClick(1500)
      // Open mailto with pre-filled content
      const subject = encodeURIComponent(`[OSK UPLINK] Transmission from ${callsign || 'Anonymous Operator'} // ${frequency}`)
      const body = encodeURIComponent(`OPERATOR: ${callsign}\nFREQUENCY: ${frequency}\n\nTRANSMISSION:\n${message}`)
      window.location.href = `mailto:oristern8@gmail.com?subject=${subject}&body=${body}`
    }, 1200)
  }

  return (
    <section id="contact-uplink" className="relative border-b border-line bg-bg-panel-alt py-28 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-green/5 blur-[150px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-14 max-w-[680px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-neon-green/20">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            SECURE TRANSMISSION UPLINK
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
            Initiate Direct Encrypted Dispatch
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed font-sans">
            Ready to architect a mission-critical command interface, build a real-time data visualizer, or collaborate on autonomous AI pipelines? Dispatch your parameters below.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-2xl border border-line bg-bg-panel p-8 font-mono shadow-[0_25px_60px_-20px_rgba(0,0,0,0.85)] max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 text-xs text-text-faint">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                <span className="text-text font-bold uppercase">CHANNEL // P2P ENCRYPTED UPLINK</span>
              </div>
              <span className="text-cyan">CIPHER: AES-256-GCM</span>
            </div>

            <form onSubmit={handleDispatch} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] text-text-faint uppercase font-bold tracking-wider mb-2">
                    SENDER_CALLSIGN / NAME
                  </label>
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    onKeyDown={() => audio.playKeystroke()}
                    placeholder="e.g. Operator Alpha / Founder"
                    className="w-full rounded-lg border border-line bg-bg-panel-alt px-4 py-3 text-xs text-text outline-none focus:border-green transition-colors placeholder:text-text-faint/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-text-faint uppercase font-bold tracking-wider mb-2">
                    FREQUENCY_SECTOR
                  </label>
                  <div className="flex gap-1.5">
                    {(['COMMERCIAL', 'DEFENSE', 'AI_LAB'] as const).map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        onClick={() => {
                          setFrequency(freq)
                          audio.playClick()
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className={`flex-1 rounded-lg border py-3 text-[11px] transition-all ${
                          frequency === freq
                            ? 'border-green bg-green/15 text-text font-bold shadow-neon-green/20'
                            : 'border-line bg-bg-panel-alt text-text-dim hover:border-text-dim'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-text-faint uppercase font-bold tracking-wider mb-2">
                  TRANSMISSION_PAYLOAD
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={() => audio.playKeystroke()}
                  required
                  placeholder="Describe your project, data architecture, or timeline requirements..."
                  className="w-full rounded-lg border border-line bg-bg-panel-alt px-4 py-3 text-xs text-text outline-none focus:border-green transition-colors placeholder:text-text-faint/60"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-text-faint">
                  DIRECT TRANSMISSION TO: <span className="text-green font-bold">oristern8@gmail.com</span>
                </div>

                <button
                  type="submit"
                  disabled={isTransmitting}
                  onMouseEnter={() => audio.playHover()}
                  className="rounded-lg border border-green bg-green/15 px-8 py-3.5 text-xs font-bold text-green transition-all hover:bg-green hover:text-[#05080e] hover:shadow-neon-green disabled:opacity-50"
                >
                  {isTransmitting ? 'ENCRYPTING & DISPATCHING...' : transmitted ? '✓ TRANSMISSION DELIVERED' : 'TRANSMIT PACKET ✉'}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
