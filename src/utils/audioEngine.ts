// Zero-asset procedural UI audio. Every sound is synthesized with Web Audio API.
class SoundEngine {
  private ctx: AudioContext | null = null
  private muted = false
  private unlocked = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.muted = localStorage.getItem('osk_audio_muted') === 'true'
      this.unlockOnFirstGesture()
    }
  }

  private unlockOnFirstGesture() {
    const unlock = () => {
      this.unlock()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
  }

  public unlock() {
    this.initCtx()
    if (this.ctx?.state === 'suspended') void this.ctx.resume()
    this.unlocked = true
  }

  private initCtx() {
    if (this.ctx || typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) this.ctx = new AudioCtx()
  }

  private ready() {
    if (this.muted) return false
    this.initCtx()
    if (!this.ctx) return false
    if (!this.unlocked && this.ctx.state !== 'running') return false
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return true
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== 'undefined') localStorage.setItem('osk_audio_muted', String(this.muted))
    if (!this.muted) {
      this.unlock()
      this.playBeep(880, 0.08, 'sine', 0.035)
    }
    return this.muted
  }

  public getMuted() {
    return this.muted
  }

  public setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== 'undefined') localStorage.setItem('osk_audio_muted', String(muted))
  }

  private tone({
    start,
    end,
    duration,
    type = 'sine',
    volume = 0.03,
  }: {
    start: number
    end?: number
    duration: number
    type?: OscillatorType
    volume?: number
  }) {
    if (!this.ready() || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(start, now)
    if (end !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(30, end), now + duration)
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + duration)
  }

  public hoverBlip() {
    this.tone({ start: 560, end: 760, duration: 0.028, type: 'triangle', volume: 0.016 })
  }

  public clickTactical(freq = 1200) {
    this.tone({ start: freq, end: 420, duration: 0.045, type: 'sine', volume: 0.035 })
  }

  public scanHum(duration = 0.28) {
    this.tone({ start: 980, end: 300, duration, type: 'sine', volume: 0.028 })
  }

  public systemBoot() {
    if (!this.ready() || !this.ctx) return
    const now = this.ctx.currentTime
    const frequencies = [220, 329.63, 440, 659.25, 880]
    frequencies.forEach((frequency, index) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const start = now + index * 0.07
      osc.type = index === 4 ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(frequency, start)
      gain.gain.setValueAtTime(0.028, start)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.05)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(start)
      osc.stop(start + 1.08)
    })
  }

  public alertPing() {
    if (!this.ready() || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.setValueAtTime(1760, now + 0.075)
    gain.gain.setValueAtTime(0.035, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.31)
  }

  public keystroke() {
    const frequencies = [1400, 1600, 1800, 2100]
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)]
    this.tone({ start: frequency, duration: 0.018, type: 'square', volume: 0.009 })
  }

  public playHover() { this.hoverBlip() }
  public playClick(freq = 1200) { this.clickTactical(freq) }
  public playRadarSweep() { this.scanHum(0.25) }
  public playAlert() { this.alertPing() }
  public playBootChord() { this.systemBoot() }
  public playKeystroke() { this.keystroke() }

  private playBeep(freq: number, duration: number, type: OscillatorType, volume: number) {
    this.tone({ start: freq, duration, type, volume })
  }
}

export const audio = new SoundEngine()
