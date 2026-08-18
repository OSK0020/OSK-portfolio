import { useState, useEffect, useRef } from 'react'
import { audio } from '../utils/audioEngine'

interface ModelSpec {
  id: string
  name: string
  latency: string
  resolution: string
  vram: string
  accuracy: string
  color: string
}

const MODELS: ModelSpec[] = [
  { id: 'flux', name: 'FLUX.1-Dev (Neural)', latency: '1.84s', resolution: '1024x1024', vram: '12.4 GB', accuracy: '99.4%', color: '#3dffa0' },
  { id: 'sdxl', name: 'SDXL Turbo (Real-time)', latency: '0.42s', resolution: '512x512', vram: '6.8 GB', accuracy: '96.2%', color: '#5fb9ff' },
  { id: 'gemini', name: 'Gemini Vision Cascade', latency: '0.95s', resolution: 'Vector / Multimodal', vram: 'Cloud API', accuracy: '98.8%', color: '#ffb648' },
]

const PROMPTS = [
  'Tactical orbital surveillance satellite over stormy atmosphere, volumetric laser scan',
  'Cybernetic neural core matrix with pulsating fiber-optic filaments, 8k octane render',
  'Autonomous reconnaissance drone navigating neon canyon grid at midnight',
]

export function AILabPlayground() {
  const [selectedModel, setSelectedModel] = useState<ModelSpec>(MODELS[0])
  const [activePromptIndex, setActivePromptIndex] = useState(0)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [progress, setProgress] = useState(100)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const w = (canvas.width = 380)
    const h = (canvas.height = 200)

    let t = 0
    const render = () => {
      t += isSynthesizing ? 0.08 : 0.02
      ctx.clearRect(0, 0, w, h)

      // Cyber wave / Latent vector animation
      ctx.lineWidth = 1.5
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath()
        ctx.globalAlpha = isSynthesizing ? 0.85 : 0.35
        ctx.strokeStyle = wave === 0 ? selectedModel.color : wave === 1 ? '#5fb9ff' : '#ff4b3e'

        for (let x = 0; x < w; x += 4) {
          const freq = 0.02 + wave * 0.01
          const amp = isSynthesizing ? 35 : 18
          const y = h / 2 + Math.sin(x * freq + t + wave) * amp * Math.cos(x * 0.01 + t * 0.5)

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }

      // Latent Nodes
      for (let i = 0; i < 8; i++) {
        const nx = ((i * 48 + t * 40) % w)
        const ny = h / 2 + Math.sin(nx * 0.03 + t) * 25
        ctx.fillStyle = selectedModel.color
        ctx.beginPath()
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [selectedModel, isSynthesizing])

  const runSynthesis = () => {
    if (isSynthesizing) return
    setIsSynthesizing(true)
    setProgress(0)
    audio.playRadarSweep()

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSynthesizing(false)
          audio.playClick(1500)
          return 100
        }
        return prev + 20
      })
    }, 180)
  }

  return (
    <div className="rounded-2xl border border-line bg-bg-panel p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
          <span className="font-bold text-text">AI MODELS LABORATORY // INTERACTIVE SANDBOX</span>
        </div>
        <span className="text-text-faint hidden sm:inline">WebGL &amp; Latent Benchmark</span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Model Controls & Visualizer */}
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-text-faint">
              SELECT GENERATIVE ARCHITECTURE:
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m)
                    audio.playClick(1100)
                  }}
                  onMouseEnter={() => audio.playHover()}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                    selectedModel.id === m.id
                      ? 'border-cyan bg-cyan/15 text-text font-bold shadow-[0_0_12px_rgba(95,185,255,0.3)]'
                      : 'border-line bg-bg-panel-alt text-text-dim hover:text-text'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-text-faint">
              TARGET PROMPT:
            </label>
            <div className="mt-2 rounded-lg border border-line bg-bg-panel-alt p-3 font-mono text-xs text-text-dim">
              "{PROMPTS[activePromptIndex]}"
            </div>
            <div className="mt-2 flex gap-2">
              {PROMPTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePromptIndex(idx)
                    audio.playHover()
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activePromptIndex === idx ? 'w-8 bg-cyan' : 'w-2 bg-line'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={runSynthesis}
            disabled={isSynthesizing}
            onMouseEnter={() => audio.playHover()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan bg-cyan/10 py-3 font-mono text-xs font-bold text-cyan transition-all hover:bg-cyan hover:text-[#06090b] hover:shadow-[0_0_20px_rgba(95,185,255,0.4)] disabled:opacity-50"
          >
            {isSynthesizing ? `SYNTHESIZING LATENT MATRIX [${progress}%]...` : '⚡ RUN BENCHMARK INFERENCE'}
          </button>
        </div>

        {/* Right: Waveform Canvas & Live Metrics */}
        <div className="flex flex-col justify-between rounded-xl border border-line-soft bg-bg-panel-alt p-4">
          <div>
            <span className="font-mono text-[11px] text-text-faint">LATENT VECTOR WAVEFORM:</span>
            <div className="mt-2 overflow-hidden rounded border border-line bg-bg flex items-center justify-center">
              <canvas ref={canvasRef} className="h-[120px] w-full" />
            </div>
          </div>

          {/* Model Telemetry */}
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="rounded border border-line bg-bg p-2">
              <span className="block text-[10px] text-text-faint">INFERENCE SPEED</span>
              <span className="font-bold text-green">{selectedModel.latency}</span>
            </div>
            <div className="rounded border border-line bg-bg p-2">
              <span className="block text-[10px] text-text-faint">FID ACCURACY</span>
              <span className="font-bold text-cyan">{selectedModel.accuracy}</span>
            </div>
            <div className="rounded border border-line bg-bg p-2">
              <span className="block text-[10px] text-text-faint">TARGET RES</span>
              <span className="font-bold text-text">{selectedModel.resolution}</span>
            </div>
            <div className="rounded border border-line bg-bg p-2">
              <span className="block text-[10px] text-text-faint">GPU FOOTPRINT</span>
              <span className="font-bold text-amber">{selectedModel.vram}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
