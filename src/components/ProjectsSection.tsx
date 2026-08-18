import type { ReactElement } from 'react'
import { labProjects } from '../data/projects'
import { Reveal } from './Reveal'
import { SpotlightCard } from './SpotlightCard'
import { StatusPill } from './StatusPill'

const icons: Record<string, ReactElement> = {
  'AI Models Laboratory': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  'X Auto-Reply Bot': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="14" r="1.3" fill="currentColor" />
      <circle cx="15" cy="14" r="1.3" fill="currentColor" />
    </svg>
  ),
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-30">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-green">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            Independent side projects
          </span>
          <h2 className="mt-4 font-display text-[clamp(26px,3.2vw,38px)] font-extrabold">
            A lab for technical experiments
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15.5px] text-text-dim">
            Personal projects where I test new ideas — in-browser audio synthesis, WebGL, and
            AI-driven automation.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {labProjects.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <SpotlightCard
                color={p.status === 'live' ? 'var(--color-green)' : 'var(--color-amber)'}
                className="h-full border border-line bg-bg-panel p-8"
              >
                <div className="mb-5 flex h-[42px] w-[42px] items-center justify-center border border-line text-green">
                  {icons[p.name]}
                </div>
                <StatusPill status={p.status} label={p.status === 'running' ? '24/7' : undefined} />
                <div className="mb-1.5 text-[21px] font-bold font-display">{p.name}</div>
                <p className="text-[14.5px] text-text-dim">{p.description}</p>
                <div className="my-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="border border-line px-2.5 py-1 font-mono text-[11px] text-text-dim">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3.5">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener"
                      className="border-b border-line pb-0.5 font-mono text-[13px] transition-colors hover:border-green hover:text-green"
                    >
                      View the demo ↗
                    </a>
                  )}
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener"
                    className="border-b border-line pb-0.5 font-mono text-[13px] text-text-faint transition-colors hover:border-text-dim hover:text-text-dim"
                  >
                    Source code ↗
                  </a>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
