/**
 * Procedural Tactical Audio Engine for Scroll Velocity Modulation & Hydraulic Blast Resistance
 * 100% Web Audio API DSP Synthesis - Zero External Media Files
 */
class TacticalAudioEngine {
  private ctx: AudioContext | null = null
  private isUnlocked = false
  private masterGain: GainNode | null = null

  // Drone Nodes
  private droneOsc: OscillatorNode | null = null
  private droneGain: GainNode | null = null
  private droneFilter: BiquadFilterNode | null = null

  // Ambient Reactor Sub
  private reactorOsc: OscillatorNode | null = null
  private reactorGain: GainNode | null = null

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
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      this.setupSubDrone()
      this.setupReactorRumble()
      this.isUnlocked = true
    } catch {
      // Ignored
    }
  }

  private setupSubDrone() {
    if (!this.ctx || !this.masterGain) return
    try {
      this.droneOsc = this.ctx.createOscillator()
      this.droneGain = this.ctx.createGain()
      this.droneFilter = this.ctx.createBiquadFilter()

      this.droneOsc.type = 'sawtooth'
      this.droneOsc.frequency.setValueAtTime(45, this.ctx.currentTime)

      this.droneFilter.type = 'lowpass'
      this.droneFilter.frequency.setValueAtTime(110, this.ctx.currentTime)

      this.droneGain.gain.setValueAtTime(0.03, this.ctx.currentTime)

      this.droneOsc.connect(this.droneFilter)
      this.droneFilter.connect(this.droneGain)
      this.droneGain.connect(this.masterGain)
      this.droneOsc.start()
    } catch {
      // Ignored
    }
  }

  private setupReactorRumble() {
    if (!this.ctx || !this.masterGain) return
    try {
      this.reactorOsc = this.ctx.createOscillator()
      this.reactorGain = this.ctx.createGain()

      this.reactorOsc.type = 'sine'
      this.reactorOsc.frequency.setValueAtTime(32, this.ctx.currentTime) // תדר תת-קרקעי עמוק 32Hz
      this.reactorGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

      this.reactorOsc.connect(this.reactorGain)
      this.reactorGain.connect(this.masterGain)
      this.reactorOsc.start()
    } catch {
      // Ignored
    }
  }

  // 1. צליל בניית לחץ הידראולי מודולרי
  public playHydraulicBuildup(intensity: number) {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(40 + intensity * 180, now)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(200 + intensity * 600, now)
      filter.Q.setValueAtTime(3, now)

      gain.gain.setValueAtTime(0.01 + intensity * 0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(filter)
      filter.connect(gain)
      if (this.masterGain) gain.connect(this.masterGain)
      else gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    } catch {
      // Ignored
    }
  }

  // 2. פריצת דלתות הדף: שילוב קיטור בלחץ גבוה + מכת הדף סאב-באס
  public playBlastBreach() {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime

      // רעש פריקת קיטור (High Pressure Steam Jet)
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.2)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1400, now)
      filter.frequency.exponentialRampToValueAtTime(80, now + 1.1)
      filter.Q.setValueAtTime(1.2, now)

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.55, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1)

      noise.connect(filter)
      filter.connect(noiseGain)
      if (this.masterGain) noiseGain.connect(this.masterGain)
      else noiseGain.connect(this.ctx.destination)
      noise.start(now)

      // מכת הדף תת-קרקעית כבדה (Sub Seismic Punch)
      const subOsc = this.ctx.createOscillator()
      const subGain = this.ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(95, now)
      subOsc.frequency.exponentialRampToValueAtTime(24, now + 0.8)

      subGain.gain.setValueAtTime(0.7, now)
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

      subOsc.connect(subGain)
      if (this.masterGain) subGain.connect(this.masterGain)
      else subGain.connect(this.ctx.destination)
      subOsc.start(now)
      subOsc.stop(now + 0.8)
    } catch {
      // Ignored
    }
  }

  // 3. סימולציית מונה גייגר (Geiger Radiation Clicks)
  public triggerGeigerClick(radiationLevel: number) {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.003) // 3ms click
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(2500, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(Math.min(0.2, 0.03 + radiationLevel * 0.05), now)

      noise.connect(filter)
      filter.connect(gain)
      if (this.masterGain) gain.connect(this.masterGain)
      else gain.connect(this.ctx.destination)
      noise.start(now)
    } catch {
      // Ignored
    }
  }

  // 4. סרוו מנוע חשמלי לפתיחת צמצם IRIS
  public playIrisServo(progressNorm: number) {
    if (!this.ctx) this.init()
    if (!this.ctx || this.ctx.state !== 'running') return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(320 + progressNorm * 240, now)

      gain.gain.setValueAtTime(0.015, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gain)
      if (this.masterGain) gain.connect(this.masterGain)
      else gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.06)
    } catch {
      // Ignored
    }
  }

  public updateDepthDrone(depthNorm: number) {
    if (!this.ctx || this.ctx.state !== 'running') return
    const now = this.ctx.currentTime
    if (this.droneOsc && this.droneGain) {
      this.droneOsc.frequency.setTargetAtTime(45 + depthNorm * 40, now, 0.1)
      this.droneGain.gain.setTargetAtTime(0.03 + depthNorm * 0.08, now, 0.1)
    }
  }

  public updateVelocity(velocity: number) {
    if (!this.ctx || this.ctx.state !== 'running') return
    const clampedVelocity = Math.min(Math.abs(velocity), 6)
    const norm = clampedVelocity / 6
    const now = this.ctx.currentTime

    if (this.droneOsc && this.droneGain) {
      const targetFreq = 45 + norm * 75
      const targetGain = 0.03 + norm * 0.2
      this.droneOsc.frequency.setTargetAtTime(targetFreq, now, 0.05)
      this.droneGain.gain.setTargetAtTime(targetGain, now, 0.05)
    }
  }

  public playAirlockClank() {
    if (!this.ctx) this.init()
    if (!this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(160, now)
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.35)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.4)
    } catch {
      // Ignored
    }
  }

  public triggerMilestone(_progress: number) {
    if (!this.ctx) this.init()
    this.playAirlockClank()
  }

  public destroy() {
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
      this.isUnlocked = false
    }
  }
}

export const tacticalAudio = new TacticalAudioEngine()
