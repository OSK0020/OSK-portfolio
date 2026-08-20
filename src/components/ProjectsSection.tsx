import type { Project } from '../data/projects'
import { useState, useEffect, useRef } from 'react'
import { labProjects, osnFeatured, osnSecondary } from '../data/projects'
import { HolographicProjectCard } from './HolographicProjectCard'
import { ProjectIntelligenceModal } from './ProjectIntelligenceModal'
import { Reveal } from './Reveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {
  const allProjects = [osnFeatured, osnSecondary, ...labProjects]
  const [activeDossier, setActiveDossier] = useState<Project | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardsContainerRef = useRef<HTMLDivElement | null>(null)

  // GSAP ScrollTrigger Stagger & Reveal
  useEffect(() => {
    const cards = cardsContainerRef.current?.children
    if (!cards || cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 82%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative border-b border-line bg-bg py-32 overflow-hidden"
    >
      {/* Ambient Grid & Glows */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-cyan/5 blur-[180px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-14 max-w-[680px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3.5 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-neon-green/20">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            LEVEL-3 ARSENAL // PRODUCTION PLATFORMS
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,46px)] font-extrabold leading-tight">
            Flagship deployments, OSINT grids &amp; AI laboratories.
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed font-sans">
            Every system below is fully designed, engineered, and maintained by OSK. Move your cursor over each module for 3D perspective tilt or click <strong className="text-cyan">Intel Dossier</strong> for architecture specifications.
          </p>
        </Reveal>

        {/* Interactive Responsive Grid with GSAP Entrance */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 gap-7 md:grid-cols-2"
        >
          {allProjects.map((project, idx) => (
            <div key={project.name} className="h-full">
              <HolographicProjectCard
                project={project}
                accentColor={
                  idx === 0
                    ? 'var(--color-red)'
                    : idx === 1
                    ? 'var(--color-cyan)'
                    : 'var(--color-green)'
                }
                onOpenDossier={(p) => setActiveDossier(p)}
              />
            </div>
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
