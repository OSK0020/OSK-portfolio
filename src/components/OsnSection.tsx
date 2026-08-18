import { osnFeatured, osnSecondary } from '../data/projects'
import { Reveal } from './Reveal'
import { SpotlightCard } from './SpotlightCard'
import { StatusPill } from './StatusPill'
import { OsnRadarViewer } from './OsnRadarViewer'
import { audio } from '../utils/audioEngine'

export function OsnSection() {
  return (
    <section id="osn" className="relative border-y border-line bg-bg-panel-alt py-32 overflow-hidden">
      {/* Background Grid & Ambient Red Glow */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[450px] w-[450px] rounded-full bg-red/5 blur-[140px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-14 max-w-[680px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-red shadow-[0_0_12px_rgba(255,75,62,0.2)]">
            <span className="h-[7px] w-[7px] animate-blip bg-red shadow-[0_0_8px_var(--color-red)]" />
            OSN — OBSERVER SECURITY NETWORK
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
            A real-time intelligence network turning raw OSINT streams into a live situational command picture.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[16px] text-text-dim leading-relaxed">
            OSN tracks geopolitical ultimatums, military alerts, and regional crises in real time — synthesising
            unfiltered telemetry from dozens of live sensors into instant tactical interfaces.
          </p>
        </Reveal>

        {/* Featured Card with Live Tactical Radar Scope */}
        <Reveal delay={80}>
          <SpotlightCard
            color="var(--color-red)"
            className="mb-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-red/40 bg-[linear-gradient(160deg,rgba(255,75,62,0.08),transparent_65%)] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.8)] lg:grid-cols-[1.25fr_1fr]"
          >
            <div className="p-9 sm:p-12">
              <StatusPill status={osnFeatured.status} />
              <div className="mt-3 mb-1 text-[28px] font-bold font-display text-text">{osnFeatured.name}</div>
              <span className="mb-4 block font-mono text-xs uppercase tracking-[0.05em] text-red">
                {osnFeatured.tag}
              </span>
              <p className="max-w-[56ch] text-[15.5px] leading-relaxed text-text-dim">{osnFeatured.description}</p>
              
              <div className="my-6 flex flex-wrap gap-2">
                {osnFeatured.tech.map((t) => (
                  <span key={t} className="rounded border border-line bg-bg-panel px-3 py-1 font-mono text-[11px] text-text-dim">
                    {t}
                  </span>
                ))}
              </div>
              
              <a
                href={osnFeatured.liveUrl}
                target="_blank"
                rel="noopener"
                onClick={() => audio.playRadarSweep()}
                onMouseEnter={() => audio.playHover()}
                className="inline-flex items-center gap-2 rounded-lg border border-red bg-red/10 px-7 py-3.5 font-mono text-sm font-bold text-red transition-all hover:bg-red hover:text-[#06090b] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
              >
                <span>ENTER TACTICAL COMMAND</span>
                <span>↗</span>
              </a>
            </div>

            {/* Radar Scope Viewport */}
            <div className="flex flex-col items-center justify-center border-t border-line bg-bg-panel/60 p-8 lg:border-t-0 lg:border-s">
              <OsnRadarViewer />
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Secondary OSN Platform */}
        <Reveal delay={140}>
          <SpotlightCard
            color="var(--color-cyan)"
            className="grid grid-cols-1 rounded-2xl border border-line bg-bg-panel p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)] lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div>
              <StatusPill status={osnSecondary.status} />
              <div className="mt-2 mb-1 text-2xl font-bold font-display text-text">{osnSecondary.name}</div>
              <span className="mb-3 block font-mono text-xs uppercase tracking-[0.05em] text-cyan">
                {osnSecondary.tag}
              </span>
              <p className="max-w-[62ch] text-[15px] leading-relaxed text-text-dim">{osnSecondary.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {osnSecondary.tech.map((t) => (
                  <span key={t} className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-text-dim">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 lg:mt-0 lg:pl-8">
              <a
                href={osnSecondary.liveUrl}
                target="_blank"
                rel="noopener"
                onClick={() => audio.playClick(1400)}
                onMouseEnter={() => audio.playHover()}
                className="inline-block whitespace-nowrap rounded-lg border border-cyan/40 bg-cyan/5 px-6 py-3.5 font-mono text-sm font-bold text-cyan transition-all hover:border-cyan hover:bg-cyan/15 hover:shadow-[0_0_16px_rgba(95,185,255,0.3)]"
              >
                Visit 3D Globe Site ↗
              </a>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  )
}
