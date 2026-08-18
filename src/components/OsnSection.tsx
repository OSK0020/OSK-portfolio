import { osnFeatured, osnSecondary } from '../data/projects'
import { Reveal } from './Reveal'
import { SpotlightCard } from './SpotlightCard'
import { StatusPill } from './StatusPill'

export function OsnSection() {
  return (
    <section id="osn" className="border-y border-line bg-bg-panel-alt py-30">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-red">
            <span className="h-[7px] w-[7px] animate-blip bg-red shadow-[0_0_8px_var(--color-red)]" />
            OSN — Observer Security Network
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(26px,3.2vw,38px)] font-extrabold">
            A news &amp; intelligence network I own, turning raw OSINT streams into a live
            situational picture.
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15.5px] text-text-dim">
            OSN tracks threats, geopolitical ultimatums, and security activity in real time — and
            presents it in a clear command interface, instead of another news headline.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <SpotlightCard
            color="var(--color-red)"
            className="mb-6 grid grid-cols-1 border border-red/35 bg-[linear-gradient(160deg,rgba(255,75,62,0.07),transparent_60%)] lg:grid-cols-[1.3fr_1fr]"
          >
            <div className="p-11">
              <StatusPill status={osnFeatured.status} />
              <div className="mb-1.5 text-[26px] font-bold font-display">{osnFeatured.name}</div>
              <span className="mb-4 block font-mono text-xs uppercase tracking-[0.05em] text-red">
                {osnFeatured.tag}
              </span>
              <p className="max-w-[56ch] text-[15px] text-text-dim">{osnFeatured.description}</p>
              <div className="my-5 flex flex-wrap gap-2">
                {osnFeatured.tech.map((t) => (
                  <span key={t} className="border border-line px-2.5 py-1 font-mono text-[11px] text-text-dim">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={osnFeatured.liveUrl}
                target="_blank"
                rel="noopener"
                className="inline-block border border-red px-6 py-3.5 font-mono text-sm text-red transition-all hover:bg-red hover:text-[#0a0403] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
              >
                Enter the live interface ↗
              </a>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 border-t border-line p-11 [background:radial-gradient(circle_at_30%_20%,rgba(255,75,62,0.12),transparent_55%),repeating-linear-gradient(0deg,transparent,transparent_23px,rgba(255,75,62,0.05)_24px)] lg:border-t-0 lg:border-s">
              <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border border-red/35">
                <div className="absolute inset-[22px] rounded-full border border-red/20" />
                <div className="absolute inset-[44px] rounded-full border border-red/20" />
                <div className="animate-spin-slow absolute inset-0 rounded-full [background:conic-gradient(from_0deg,rgba(255,75,62,0.55),transparent_30%)]" />
                <div className="z-[2] h-1.5 w-1.5 rounded-full bg-red shadow-[0_0_10px_var(--color-red)]" />
              </div>
              <p className="text-center font-mono text-[11px] text-text-faint">
                SCANNING // MIDDLE EAST SECTOR
              </p>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={140}>
          <SpotlightCard
            color="var(--color-cyan)"
            className="grid grid-cols-1 border border-line bg-bg-panel lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="p-8">
              <StatusPill status={osnSecondary.status} />
              <div className="mb-1.5 text-xl font-bold font-display">{osnSecondary.name}</div>
              <span className="mb-4 block font-mono text-xs uppercase tracking-[0.05em] text-cyan">
                {osnSecondary.tag}
              </span>
              <p className="max-w-[56ch] text-sm text-text-dim">{osnSecondary.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {osnSecondary.tech.map((t) => (
                  <span key={t} className="border border-line px-2.5 py-1 font-mono text-[11px] text-text-dim">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-8 pt-0 lg:pt-8">
              <a
                href={osnSecondary.liveUrl}
                target="_blank"
                rel="noopener"
                className="inline-block whitespace-nowrap border border-line px-6 py-3.5 font-mono text-sm text-text-dim transition-colors hover:border-cyan hover:text-cyan"
              >
                Visit the site ↗
              </a>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  )
}
