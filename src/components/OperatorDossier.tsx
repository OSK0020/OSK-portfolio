import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

export function OperatorDossier() {
  return (
    <section id="operator-dossier" className="relative border-b border-line bg-bg-panel py-28 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-[160px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        {/* Section Header */}
        <Reveal className="mb-14 max-w-[720px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-cyan shadow-neon-cyan/20">
            <span className="h-[7px] w-[7px] animate-blip bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
            CLASSIFIED PERSONNEL DOSSIER // DECLASSIFIED RECORD
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-tight">
            The Architect Behind the Threat Radar
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed font-sans">
            Specializing in high-stakes cyber visualization, autonomous intelligence pipelines, and high-performance WebGL/Three.js command consoles that transform complex geopolitical signal chaos into surgical clarity.
          </p>
        </Reveal>

        {/* Dossier Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Biometric ID Card */}
          <Reveal delay={60} className="lg:col-span-4">
            <div className="rounded-2xl border border-cyan/40 bg-bg-panel-alt p-6 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between border-b border-line pb-3 text-xs text-text-faint">
                <span className="text-cyan font-bold">OSN//ID-CARD</span>
                <span className="rounded bg-red/20 px-2 py-0.5 text-[10px] font-bold text-red border border-red/30">
                  TOP SECRET
                </span>
              </div>

              {/* Biometric Reticle & Avatar Placeholder */}
              <div className="my-6 flex flex-col items-center justify-center text-center">
                <div className="relative h-28 w-28 rounded-full border-2 border-cyan p-1 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-cyan/20 to-green/20 flex items-center justify-center font-display text-3xl font-extrabold text-cyan">
                    OSK
                  </div>
                  <div className="pointer-events-none absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-t-2 border-green/80" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-text">OPERATOR: OSK</h3>
                <p className="text-xs text-green font-bold mt-0.5">SENIOR CREATIVE TECHNOLOGIST</p>
                <p className="text-[11px] text-text-faint mt-1">FOUNDER &amp; CHIEF ARCHITECT // OSN</p>
              </div>

              {/* Specs Table */}
              <div className="space-y-2 border-t border-line/60 pt-4 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-faint">GRID LOCATION:</span>
                  <span className="text-text font-bold">Global Cyber Grid // Zurich Node</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-faint">SECURITY CLEARANCE:</span>
                  <span className="text-cyan font-bold">LEVEL-5 [FULL-SPECTRUM]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-faint">SYSTEM STATUS:</span>
                  <span className="text-green font-bold">ACTIVE DEPLOYMENT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-faint">CORE FOCUS:</span>
                  <span className="text-text font-bold">3D Web, AI &amp; OSINT</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Mission Philosophy & Operational Milestones */}
          <Reveal delay={120} className="lg:col-span-8 space-y-6">
            {/* Story & Philosophy Box */}
            <div className="rounded-2xl border border-line bg-bg-panel-alt p-7 font-mono shadow-sm">
              <div className="flex items-center gap-2 text-xs text-text-faint border-b border-line pb-3 mb-4">
                <span className="h-2 w-2 rounded-full bg-green" />
                <span className="text-text font-bold uppercase">MISSION PHILOSOPHY // ARCHITECTURAL CREED</span>
              </div>
              <p className="text-sm text-text-dim leading-relaxed font-sans mb-4">
                "In an era where global security events and AI models evolve in milliseconds, traditional dashboards fail. I build high-immersion software architectures that synthesize real-time data feeds, 3D WebGL geospatial rendering, and procedural audio cues into instantaneous cognitive clarity."
              </p>
              <p className="text-sm text-text-dim leading-relaxed font-sans">
                Whether deploying autonomous X bots monitoring crisis zones 24/7 or engineering cutting-edge generative AI comparison labs with sub-100ms inference profiling, every system is designed for absolute reliability, aesthetic impact, and speed.
              </p>
            </div>

            {/* Operational Milestones Timeline */}
            <div className="rounded-2xl border border-line bg-bg-panel-alt p-7 font-mono">
              <div className="flex items-center gap-2 text-xs text-text-faint border-b border-line pb-3 mb-5">
                <span className="h-2 w-2 rounded-full bg-cyan" />
                <span className="text-text font-bold uppercase">OPERATIONAL DEPLOYMENT LOGS</span>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  {
                    phase: 'PHASE 04 // 2026',
                    title: 'OSN Extra & Global Threat Grid Live Deployment',
                    desc: 'Engineered next-gen live tactical defense tracker with real-time Leaflet, D3 and Web Audio API integration.',
                    badge: 'ACTIVE_OPS',
                    color: 'text-red border-red/30 bg-red/10',
                  },
                  {
                    phase: 'PHASE 03 // 2025',
                    title: 'Autonomous AI Multi-Model Cascades & X Intelligence Bot',
                    desc: 'Architected 24/7 autonomous OSINT agent on X utilizing Gemini search grounding cascades and instant push notifications.',
                    badge: 'PRODUCTION',
                    color: 'text-cyan border-cyan/30 bg-cyan/10',
                  },
                  {
                    phase: 'PHASE 02 // 2024-2025',
                    title: 'AI Models Visual Benchmark & Comparison Lab',
                    desc: 'Created interactive WebGL playground for side-by-side generative AI model evaluation and latency benchmarking.',
                    badge: 'VERIFIED',
                    color: 'text-green border-green/30 bg-green/10',
                  },
                  {
                    phase: 'PHASE 01 // FOUNDATION',
                    title: 'Observer Security Network (OSN) Inception',
                    desc: 'Established the core decentralized intelligence collection architecture aggregating 48+ international crisis telemetry feeds.',
                    badge: 'ORIGIN',
                    color: 'text-amber border-amber/30 bg-amber/10',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => audio.playHover()}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-l-2 border-line hover:border-cyan pl-4 py-1 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-text-faint">{item.phase}</span>
                        <span className="text-text font-bold">{item.title}</span>
                      </div>
                      <p className="text-[11.5px] text-text-dim font-sans leading-relaxed">{item.desc}</p>
                    </div>
                    <span className={`inline-self-start sm:self-auto rounded px-2 py-0.5 text-[10px] font-bold border ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
