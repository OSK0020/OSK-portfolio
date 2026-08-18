// Tactical Procedural Audio Engine - Zero external media files, 100% Web Audio API synthesis
class TacticalAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private muted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('osk_audio_muted')
      this.muted = saved === 'true'
      this.bindGestureUnlock()
    }
  }

  private bindGestureUnlock() {
    const unlock = () => {
      this.unlock()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
  }

  private initContext() {
    if (typeof window === 'undefined') return
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = this.muted ? 0 : 0.15
        this.masterGain.connect(this.ctx.destination)
      }
    }
  }

  public unlock() {
    this.initContext()
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('osk_audio_muted', String(this.muted))
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.15, this.ctx.currentTime)
    }
    if (!this.muted) {
      this.unlock()
      this.playClick(1200)
    }
    return this.muted
  }

  public getMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('osk_audio_muted', String(muted))
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.15, this.ctx.currentTime)
    }
  }

  private ready(): boolean {
    if (this.muted) return false
    this.initContext()
    if (!this.ctx || !this.masterGain) return false
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return true
  }

  // Micro-frequency hover chirp
  public playHover() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1800, now)
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.03)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.035)
    } catch {
      // Ignored
    }
  }

  // Precise tactical click
  public playClick(freq = 650) {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.045)
    } catch {
      // Ignored
    }
  }

  // Mechanical terminal keystroke
  public playKeystroke() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      const freqs = [1400, 1650, 1850, 2150]
      const freq = freqs[Math.floor(Math.random() * freqs.length)]

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.022)
    } catch {
      // Ignored
    }
  }

  // Tactical Radar Sweep frequency chirp
  public playRadarSweep() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(980, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.28)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.29)
    } catch {
      // Ignored
    }
  }

  // Alert ping (Tactical warning / threat notice)
  public playAlert() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(1760, now + 0.075)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.33)
    } catch {
      // Ignored
    }
  }

  // Diagnostic BiquadFilter Boot Sweep (Google Spec + Harmonic chords)
  public playBootChord() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(110, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(300, now)
      filter.frequency.exponentialRampToValueAtTime(4500, now + 0.6)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.78)

      // Chords
      const freqs = [220, 329.63, 440, 659.25, 880]
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return
        const o = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        const start = now + 0.3 + idx * 0.06

        o.type = 'sine'
        o.frequency.setValueAtTime(freq, start)

        g.gain.setValueAtTime(0.025, start)
        g.gain.exponentialRampToValueAtTime(0.0001, start + 1.1)

        o.connect(g)
        g.connect(this.masterGain)

        o.start(start)
        o.stop(start + 1.12)
      })
    } catch {
      // Ignored
    }
  }
}

export const audio = new TacticalAudioEngine()
export const audioEngine = audio
