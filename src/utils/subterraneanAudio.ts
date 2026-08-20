// src/utils/subterraneanAudio.ts
class SubterraneanAudioEngine {
  private ctx: AudioContext | null = null
  private isUnlocked = false
  private masterGain: GainNode | null = null
  private earthDroneOsc: OscillatorNode | null = null
  private earthDroneGain: GainNode | null = null

  public init() {
    if (this.isUnlocked && this.ctx?.state === 'running') return

    try {
      const AudioClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioClass) return
      this.ctx = new AudioClass()

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume()
      }

      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      this.setupEarthRumble()
      this.isUnlocked = true
    } catch {
      // Ignored
    }
  }

  // תהודה של מעמקי האדמה (30Hz Sub-Bass)
  private setupEarthRumble() {
    if (!this.ctx || !this.masterGain) return
    try {
      this.earthDroneOsc = this.ctx.createOscillator()
      this.earthDroneGain = this.ctx.createGain()

      this.earthDroneOsc.type = 'sine'
      this.earthDroneOsc.frequency.setValueAtTime(32, this.ctx.currentTime)
      this.earthDroneGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

      this.earthDroneOsc.connect(this.earthDroneGain)
      this.earthDroneGain.connect(this.masterGain)
      this.earthDroneOsc.start()
    } catch {
      // Ignored
    }
  }

  // 1. צליל מתיחת כבלי מעלית ומתח הידראולי
  public playTensionBuild(intensity: number) {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(50 + intensity * 120, now)

      gain.gain.setValueAtTime(0.01 + intensity * 0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(250 + intensity * 400, now)

      osc.connect(filter)
      filter.connect(gain)
      if (this.masterGain) gain.connect(this.masterGain)
      else gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {
      // Ignored
    }
  }

  // 2. צליל שחרור בלמים / פריצת שער ורוח פיר
  public playShaftDrop() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime

      // רעש רוח פיר חזק (Vertical Wind Inrush)
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.4)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(600, now)
      filter.frequency.exponentialRampToValueAtTime(140, now + 1.2)
      filter.Q.setValueAtTime(2.0, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.45, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

      noise.connect(filter)
      filter.connect(gain)
      if (this.masterGain) gain.connect(this.masterGain)
      else gain.connect(this.ctx.destination)
      noise.start(now)

      // מכת פלדה תעשייתית (Heavy Clamp Release)
      const clank = this.ctx.createOscillator()
      const clankGain = this.ctx.createGain()
      clank.type = 'triangle'
      clank.frequency.setValueAtTime(110, now)
      clank.frequency.exponentialRampToValueAtTime(35, now + 0.4)

      clankGain.gain.setValueAtTime(0.5, now)
      clankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

      clank.connect(clankGain)
      if (this.masterGain) clankGain.connect(this.masterGain)
      else clankGain.connect(this.ctx.destination)
      clank.start(now)
      clank.stop(now + 0.4)
    } catch {
      // Ignored
    }
  }

  // עדכון עוצמת מעמקי האדמה לפי העומק
  public updateAmbientDepth(depthMeters: number) {
    if (!this.ctx || this.ctx.state !== 'running' || !this.earthDroneGain) return
    try {
      const norm = Math.min(1, Math.abs(depthMeters) / 450)
      const targetGain = 0.04 + norm * 0.08
      this.earthDroneGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2)
    } catch {
      // Ignored
    }
  }

  public destroy() {
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
      this.isUnlocked = false
    }
  }
}

export const subterraneanAudio = new SubterraneanAudioEngine()
