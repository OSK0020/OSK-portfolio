// Tactical Procedural Audio Engine - Zero external media files, 100% Web Audio API synthesis
class TacticalAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private ambientOsc1: OscillatorNode | null = null
  private ambientOsc2: OscillatorNode | null = null
  private isAmbientPlaying: boolean = false
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
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('click', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
  }

  public initContext() {
    if (typeof window === 'undefined') return
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = this.muted ? 0 : 0.35
        this.masterGain.connect(this.ctx.destination)

        this.ambientGain = this.ctx.createGain()
        this.ambientGain.gain.value = 0
        this.ambientGain.connect(this.masterGain)
      }
    }
  }

  public unlock() {
    this.initContext()
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume()
      }
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime)
      }
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('osk_audio_muted', String(this.muted))
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime)
    }
    if (!this.muted) {
      this.unlock()
      this.playAccessGranted()
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
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime)
    }
  }

  private ready(): boolean {
    if (this.muted) return false
    this.initContext()
    if (!this.ctx || !this.masterGain) return false
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return true
  }

  // ==================== CONTINUOUS AMBIENT SCI-FI DRONE ====================
  public toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientDrone()
      return false
    } else {
      this.startAmbientDrone()
      return true
    }
  }

  public startAmbientDrone() {
    if (!this.ready() || !this.ctx || !this.ambientGain) return
    if (this.isAmbientPlaying) return

    try {
      const now = this.ctx.currentTime

      // Filter for warm, deep sub-hum
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(140, now)

      this.ambientOsc1 = this.ctx.createOscillator()
      this.ambientOsc1.type = 'sine'
      this.ambientOsc1.frequency.setValueAtTime(55, now) // A1 Sub-drone

      this.ambientOsc2 = this.ctx.createOscillator()
      this.ambientOsc2.type = 'sawtooth'
      this.ambientOsc2.frequency.setValueAtTime(55.4, now) // Slight detune for phasing richness

      this.ambientOsc1.connect(filter)
      this.ambientOsc2.connect(filter)
      filter.connect(this.ambientGain)

      this.ambientGain.gain.setValueAtTime(0.001, now)
      this.ambientGain.gain.exponentialRampToValueAtTime(0.12, now + 1.5)

      this.ambientOsc1.start(now)
      this.ambientOsc2.start(now)
      this.isAmbientPlaying = true
    } catch {
      // Ignored
    }
  }

  public stopAmbientDrone() {
    if (!this.ctx || !this.ambientGain) return
    try {
      const now = this.ctx.currentTime
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now)
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)

      setTimeout(() => {
        this.ambientOsc1?.stop()
        this.ambientOsc2?.stop()
        this.ambientOsc1?.disconnect()
        this.ambientOsc2?.disconnect()
        this.isAmbientPlaying = false
      }, 850)
    } catch {
      this.isAmbientPlaying = false
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying
  }

  // ==================== BUNKER SHAFT & AIRLOCK FX ====================

  // Hydraulic Airlock Decompression Hiss & Heavy Clunk
  public playAirlockDecompress() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime

      // 1. Pneumatic Hiss (Filtered noise)
      const bufferSize = this.ctx.sampleRate * 0.35
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1600, now)
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.35)

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.16, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(this.masterGain)

      noise.start(now)
      noise.stop(now + 0.36)

      // 2. Heavy Magnetic Airlock Clunk
      const clunkOsc = this.ctx.createOscillator()
      const clunkGain = this.ctx.createGain()

      clunkOsc.type = 'triangle'
      clunkOsc.frequency.setValueAtTime(140, now + 0.22)
      clunkOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45)

      clunkGain.gain.setValueAtTime(0.001, now)
      clunkGain.gain.setValueAtTime(0.28, now + 0.22)
      clunkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48)

      clunkOsc.connect(clunkGain)
      clunkGain.connect(this.masterGain)

      clunkOsc.start(now + 0.22)
      clunkOsc.stop(now + 0.5)
    } catch {
      // Ignored
    }
  }

  // Elevator Gravity Drop Sub-Bass Sweep
  public playElevatorDrop() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(110, now)
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.7)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.78)
    } catch {
      // Ignored
    }
  }

  // Sonar Target Lock Ping
  public playSonarPing(freq = 1250) {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.6)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.62)
    } catch {
      // Ignored
    }
  }

  // Tactical Glitch FX
  public playGlitchFX() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const bufferSize = this.ctx.sampleRate * 0.08
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(2400, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      noise.start(now)
      noise.stop(now + 0.085)
    } catch {
      // Ignored
    }
  }

  // Warp Acceleration Whoosh
  public playWarpSound() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(1400, now + 1.2)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, now)
      filter.frequency.exponentialRampToValueAtTime(6000, now + 1.2)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 1.35)
    } catch {
      // Ignored
    }
  }

  // Micro-frequency hover chirp
  public playHover() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(2200, now)
      osc.frequency.exponentialRampToValueAtTime(3600, now + 0.035)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch {
      // Ignored
    }
  }

  // Precise tactical click
  public playClick(freq = 750) {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.055)
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

      const freqs = [1200, 1500, 1800, 2100, 2400]
      const freq = freqs[Math.floor(Math.random() * freqs.length)]

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.032)
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
      osc.frequency.setValueAtTime(1100, now)
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.32)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.33)
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
      osc.frequency.setValueAtTime(950, now)
      osc.frequency.setValueAtTime(1900, now + 0.08)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.36)
    } catch {
      // Ignored
    }
  }

  // Confirmation Chime: Access Granted
  public playAccessGranted() {
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const freqs = [523.25, 659.25, 783.99, 1046.5]

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const start = now + idx * 0.07

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.12, start)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(start)
        osc.stop(start + 0.42)
      })
    } catch {
      // Ignored
    }
  }

  // Massive Cinematic Boot Chord & Sub-Bass Drop
  public playBootChord() {
    this.unlock()
    if (!this.ready() || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime

      // 1. Sub Bass Punch
      const subOsc = this.ctx.createOscillator()
      const subGain = this.ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(130, now)
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.8)

      subGain.gain.setValueAtTime(0.35, now)
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

      subOsc.connect(subGain)
      subGain.connect(this.masterGain)
      subOsc.start(now)
      subOsc.stop(now + 0.95)

      // 2. Filtered Cyber Sweep
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(110, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(250, now)
      filter.frequency.exponentialRampToValueAtTime(5000, now + 0.6)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.82)

      // 3. Cyber Matrix Chords
      const chordFreqs = [220, 329.63, 440, 554.37, 659.25, 880]
      chordFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return
        const o = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        const start = now + 0.25 + idx * 0.05

        o.type = 'sine'
        o.frequency.setValueAtTime(freq, start)

        g.gain.setValueAtTime(0.08, start)
        g.gain.exponentialRampToValueAtTime(0.0001, start + 1.2)

        o.connect(g)
        g.connect(this.masterGain)

        o.start(start)
        o.stop(start + 1.25)
      })
    } catch {
      // Ignored
    }
  }
}

export const audio = new TacticalAudioEngine()
export const audioEngine = audio
