import { Interactive3DGlobe } from './Interactive3DGlobe'
import { Reveal } from './Reveal'

export function ThreatGlobeSection() {
  return (
    <section id="globe" className="relative py-28 border-b border-line bg-bg overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-cyan/5 blur-[150px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-cyan">
                <span className="h-[7px] w-[7px] animate-blip bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                GLOBAL OSINT SPATIAL MAPPING
              </span>

              <h2 className="mt-5 text-balance font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-tight">
                Interactive 3D Geospatial Intelligence Telemetry
              </h2>

              <p className="mt-4 text-[16px] text-text-dim leading-relaxed">
                A pure Canvas 3D Fibonacci sphere rendering active geopolitical crisis zones, security alerts, and
                intercept hubs across the globe. Built with high-efficiency 3D projection algorithms for fluid 60 FPS
                rendering on any device.
              </p>

              <div className="mt-8 space-y-3 font-mono text-xs text-text-dim">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red" />
                  <span>CRITICAL NODES: Active missile alerts, territorial ultimatums, maritime blockades</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  <span>ELEVATED ZONES: Heightened troop deployments, airspace restrictions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-green" />
                  <span>SECURE HUBS: Strategic command &amp; data ingest pipelines</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Interactive3DGlobe />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
