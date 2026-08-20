/**
 * Procedural Tactical Audio Engine for Scroll Velocity Modulation
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

  // Whoosh / Friction Nodes
  private noiseSource: AudioBufferSourceNode | null = null
  private noiseGain: GainNode | null = null
  private noiseFilter: BiquadFilterNode | null = null

  // Decompression Clank State
  private lastMilestone = 0

  public init() {
    if (this.isUnlocked && this.ctx?.state === 'running') return

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return

      this.ctx = new AudioContextClass()

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume()
      }

      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.45, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      this.setupSubDrone()
      this.setupAtmosphericWhoosh()
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
      this.droneOsc.frequency.setValueAtTime(45, this.ctx.currentTime) // Base 45Hz sub-rumble

      this.droneFilter.type = 'lowpass'
      this.droneFilter.frequency.setValueAtTime(110, this.ctx.currentTime)

      this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

      this.droneOsc.connect(this.droneFilter)
      this.droneFilter.connect(this.droneGain)
      this.droneGain.connect(this.masterGain)
      this.droneOsc.start()
    } catch {
      // Ignored
    }
  }

  private setupAtmosphericWhoosh() {
    if (!this.ctx || !this.masterGain) return
    try {
      // 2-second looped white noise buffer
      const bufferSize = this.ctx.sampleRate * 2
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      this.noiseSource = this.ctx.createBufferSource()
      this.noiseSource.buffer = noiseBuffer
      this.noiseSource.loop = true

      this.noiseFilter = this.ctx.createBiquadFilter()
      this.noiseFilter.type = 'bandpass'
      this.noiseFilter.frequency.setValueAtTime(280, this.ctx.currentTime)
      this.noiseFilter.Q.setValueAtTime(1.8, this.ctx.currentTime)

      this.noiseGain = this.ctx.createGain()
      this.noiseGain.gain.setValueAtTime(0.0, this.ctx.currentTime)

      this.noiseSource.connect(this.noiseFilter)
      this.noiseFilter.connect(this.noiseGain)
      this.noiseGain.connect(this.masterGain)
      this.noiseSource.start()
    } catch {
      // Ignored
    }
  }

  public updateVelocity(velocity: number) {
    if (!this.ctx || this.ctx.state !== 'running') return

    const clampedVelocity = Math.min(Math.abs(velocity), 6)
    const norm = clampedVelocity / 6 // 0.0 to 1.0
    const now = this.ctx.currentTime

    // Modulate Sub-Drone
    if (this.droneOsc && this.droneGain) {
      const targetFreq = 45 + norm * 75 // Up to 120Hz
      const targetGain = 0.04 + norm * 0.22
      this.droneOsc.frequency.setTargetAtTime(targetFreq, now, 0.05)
      this.droneGain.gain.setTargetAtTime(targetGain, now, 0.05)
    }

    // Modulate Whoosh Air Friction
    if (this.noiseFilter && this.noiseGain) {
      const targetFilterFreq = 280 + norm * 2400 // Open filter up to 2680Hz
      const targetNoiseGain = norm * 0.35
      this.noiseFilter.frequency.setTargetAtTime(targetFilterFreq, now, 0.05)
      this.noiseGain.gain.setTargetAtTime(targetNoiseGain, now, 0.05)
    }
  }

  public triggerMilestone(progress: number) {
    if (!this.ctx || !this.masterGain) return
    const currentSegment = Math.floor(progress * 4)
    if (currentSegment !== this.lastMilestone) {
      this.lastMilestone = currentSegment
      this.playAirlockClank()
    }
  }

  public playAirlockClank() {
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

  public destroy() {
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
      this.isUnlocked = false
    }
  }
}

export const tacticalAudio = new TacticalAudioEngine()
