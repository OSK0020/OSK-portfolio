// Web Audio API Synthesizer - Zero external assets, pure procedural audio
class SoundEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (!this.isMuted) {
      this.playBeep(880, 0.08, 'sine', 0.05)
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  // Futuristic UI Beep / Click
  public playClick(freq = 1200, duration = 0.04) {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + duration)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // AudioContext failure fallback
    }
  }

  // Subtle hover blip
  public playHover() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(540, this.ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(720, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.018, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // Ignored
    }
  }

  // Terminal keystroke mechanical click
  public playKeystroke() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      const frequencies = [1400, 1600, 1800, 2100]
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)]

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.012, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.02)
    } catch {
      // Ignored
    }
  }

  // Alert ping (Tactical warning / threat notice)
  public playAlert() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(1760, now + 0.08)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.linearRampToValueAtTime(0.03, now + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(now + 0.3)
    } catch {
      // Ignored
    }
  }

  // Boot sequence cyber chord
  public playBootChord() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const freqs = [220, 329.63, 440, 659.25, 880]

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.06)

        gain.gain.setValueAtTime(0.03, now + idx * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now + idx * 0.06)
        osc.stop(now + 1.2)
      })
    } catch {
      // Ignored
    }
  }

  // Radar sweep ping
  public playRadarSweep() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(950, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.25)

      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(now + 0.25)
    } catch {
      // Ignored
    }
  }

  private playBeep(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.03) {
    this.initCtx()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(vol, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Ignored
    }
  }
}

export const audio = new SoundEngine()
