import { useState, useEffect, useRef } from 'react'
import { audio } from '../utils/audioEngine'

export function AILabPlayground() {
  const [model, setModel] = useState<'8B' | '70B' | 'MoE-8x7B'>('70B')
  const [quantization, setQuantization] = useState<'INT4' | 'INT8' | 'FP16'>('INT4')
  const [batchSize, setBatchSize] = useState(16)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Dynamic calculations based on Google Architecture Spec
  const baseVram = model === '70B' ? 70 : model === '8B' ? 8 : 45
  const quantFactor = quantization === 'FP16' ? 2 : quantization === 'INT8' ? 1 : 0.5
  const estimatedVram = (baseVram * quantFactor + batchSize * 0.38).toFixed(1)
  const throughput = Math.round((1250 / (baseVram * 0.1)) * (1 / quantFactor) * (batchSize / 8))
  const latencyMs = Math.round(18 * quantFactor * (baseVram / 10))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const w = (canvas.width = 440)
    const h = (canvas.height = 160)

    let t = 0
    const render = () => {
      t += isSynthesizing ? 0.09 : 0.025
      ctx.clearRect(0, 0, w, h)

      // Cyber wave / Latent vector animation
      ctx.lineWidth = 1.5
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath()
        ctx.globalAlpha = isSynthesizing ? 0.9 : 0.4
        ctx.strokeStyle = wave === 0 ? '#00f0ff' : wave === 1 ? '#00ff9d' : '#ff0055'

        for (let x = 0; x < w; x += 4) {
          const freq = 0.022 + wave * 0.012
          const amp = isSynthesizing ? 32 : 18
          const y = h / 2 + Math.sin(x * freq + t + wave) * amp * Math.cos(x * 0.01 + t * 0.4)

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }

      // Latent Nodes
      for (let i = 0; i < 7; i++) {
        const nx = (i * 65 + t * 35) % w
        const ny = h / 2 + Math.sin(nx * 0.03 + t) * 22
        ctx.fillStyle = '#00f0ff'
        ctx.beginPath()
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isSynthesizing])

  const runBenchmark = () => {
    if (isSynthesizing) return
    setIsSynthesizing(true)
    audio.playRadarSweep()

    setTimeout(() => {
      setIsSynthesizing(false)
      audio.playClick(1400)
    }, 1800)
  }

  return (
    <div className="rounded-2xl border border-cyan/30 bg-bg-panel p-7 font-mono shadow-neon-cyan/20 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <h3 className="text-sm font-bold tracking-wider text-cyan uppercase">
              AI INFERENCE &amp; VRAM BENCHMARK LAB
            </h3>
          </div>
          <p className="text-[11px] text-text-dim mt-0.5">
            Real-time throughput, latency &amp; memory allocation simulator
          </p>
        </div>
        <span className="rounded border border-green/40 bg-green/10 px-3 py-1 text-[11px] font-bold text-green">
          CUDA 12.4 / ROCm ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="text-[11px] text-text-faint uppercase font-bold tracking-wider">
              MODEL_ARCHITECTURE
            </label>
            <div className="mt-2 flex gap-2">
              {(['8B', '70B', 'MoE-8x7B'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setModel(m)
                    audio.playClick()
                  }}
                  onMouseEnter={() => audio.playHover()}
                  className={`flex-1 rounded-lg border px-2.5 py-2 text-xs transition-all ${
                    model === m
                      ? 'border-cyan bg-cyan/20 text-text font-bold shadow-neon-cyan/20'
                      : 'border-line bg-bg-panel-alt text-text-dim hover:border-text-dim'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-text-faint uppercase font-bold tracking-wider">
              QUANTIZATION_PRECISION
            </label>
            <div className="mt-2 flex gap-2">
              {(['INT4', 'INT8', 'FP16'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuantization(q)
                    audio.playClick()
                  }}
                  onMouseEnter={() => audio.playHover()}
                  className={`flex-1 rounded-lg border px-2.5 py-2 text-xs transition-all ${
                    quantization === q
                      ? 'border-green bg-green/20 text-text font-bold shadow-neon-green/20'
                      : 'border-line bg-bg-panel-alt text-text-dim hover:border-text-dim'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-text-dim">
              <span>CONCURRENT_BATCH_SIZE</span>
              <span className="text-cyan font-bold">{batchSize} streams</span>
            </div>
            <input
              type="range"
              min="1"
              max="64"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="mt-2 w-full accent-cyan cursor-pointer"
            />
          </div>

          <button
            onClick={runBenchmark}
            disabled={isSynthesizing}
            onMouseEnter={() => audio.playHover()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan bg-cyan/10 py-3 text-xs font-bold text-cyan transition-all hover:bg-cyan hover:text-[#05080e] hover:shadow-neon-cyan/40 disabled:opacity-50"
          >
            {isSynthesizing ? 'BENCHMARKING INFERENCE STREAMS...' : '⚡ RUN BENCHMARK INFERENCE'}
          </button>
        </div>

        {/* Live Metrics & Waveform */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col justify-between rounded-xl border border-cyan/30 bg-bg-panel-alt p-4">
              <span className="text-[10px] text-text-faint uppercase font-bold tracking-wider">
                ESTIMATED VRAM
              </span>
              <div className="my-2 text-2xl font-bold text-cyan">
                {estimatedVram} <span className="text-xs text-text-dim">GB</span>
              </div>
              <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-cyan transition-all duration-300"
                  style={{ width: `${Math.min(100, (Number(estimatedVram) / 80) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-green/30 bg-bg-panel-alt p-4">
              <span className="text-[10px] text-text-faint uppercase font-bold tracking-wider">
                THROUGHPUT
              </span>
              <div className="my-2 text-2xl font-bold text-green">
                {throughput} <span className="text-xs text-text-dim">tok/s</span>
              </div>
              <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-green transition-all duration-300"
                  style={{ width: `${Math.min(100, (throughput / 1600) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-amber/30 bg-bg-panel-alt p-4">
              <span className="text-[10px] text-text-faint uppercase font-bold tracking-wider">
                P99 LATENCY
              </span>
              <div className="my-2 text-2xl font-bold text-amber">
                {latencyMs} <span className="text-xs text-text-dim">ms</span>
              </div>
              <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-amber transition-all duration-300"
                  style={{ width: `${Math.min(100, (latencyMs / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Latent Waveform Canvas */}
          <div className="rounded-xl border border-line bg-bg p-4">
            <span className="text-[10.5px] text-text-faint uppercase tracking-wider block mb-2 font-bold">
              NEURAL LATENT VECTOR WAVEFORM:
            </span>
            <div className="overflow-hidden rounded border border-line/60 bg-bg-panel-alt flex items-center justify-center">
              <canvas ref={canvasRef} className="h-[130px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
