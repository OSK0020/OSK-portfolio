import type { Project } from '../data/projects'
import { useState } from 'react'
import { labProjects, osnFeatured, osnSecondary } from '../data/projects'
import { HolographicProjectCard } from './HolographicProjectCard'
import { ProjectIntelligenceModal } from './ProjectIntelligenceModal'
import { Reveal } from './Reveal'

export function ProjectsSection() {
  const allProjects = [osnFeatured, osnSecondary, ...labProjects]
  const [activeDossier, setActiveDossier] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative border-b border-line bg-bg py-32 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green/5 blur-[160px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-neon-green/20">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            FEATURED WORKS // PRODUCTION PLATFORMS
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
            Flagship deployments, visual labs &amp; autonomous bots.
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed font-sans">
            Every product below is fully designed, engineered, and maintained by OSK. Move your cursor over each card
            for 3D perspective tilt or click <strong className="text-cyan">Intel Dossier</strong> for full technical telemetry.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {allProjects.map((project, idx) => (
            <Reveal key={project.name} delay={idx * 80}>
              <HolographicProjectCard
                project={project}
                accentColor={idx === 0 ? 'var(--color-red)' : idx === 1 ? 'var(--color-cyan)' : 'var(--color-green)'}
                onOpenDossier={(p) => setActiveDossier(p)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Intelligence Dossier Modal */}
      <ProjectIntelligenceModal
        project={activeDossier}
        onClose={() => setActiveDossier(null)}
      />
    </section>
  )
}
