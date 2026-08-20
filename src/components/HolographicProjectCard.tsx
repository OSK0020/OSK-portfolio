import type { Project } from '../data/projects'
import { useState, useRef } from 'react'
import { StatusPill } from './StatusPill'
import { audio } from '../utils/audioEngine'

interface Props {
  project: Project
  accentColor?: string
  onOpenDossier?: (project: Project) => void
}

export function HolographicProjectCard({ project, accentColor, onOpenDossier }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotX = ((y - centerY) / centerY) * -8
    const rotY = ((x - centerX) / centerX) * 8

    setRotation({ x: rotX, y: rotY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' || target.closest('a')) {
      return
    }
    audio.playClick(1400)
    onOpenDossier?.(project)
  }

  return (
    <div
      style={{ perspective: '1000px' }}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => audio.playHover()}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          borderColor: accentColor ? `color-mix(in srgb, ${accentColor} 45%, var(--color-line))` : undefined,
          transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out',
        }}
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-bg-panel p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] group-hover:border-cyan/60 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
      >
        {/* Holographic Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, ${glarePos.opacity}), transparent 70%)`,
          }}
        />

        {/* Ambient Top Glow Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: accentColor
              ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
              : 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)',
          }}
        />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between">
            <StatusPill status={project.status} />
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-faint">
              SYS.ID // {project.name.replace(/\s+/g, '_').toUpperCase()}
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold text-text group-hover:text-cyan transition-colors">
            {project.name}
          </h3>
          <span className="mt-1 block font-mono text-xs text-green">
            {project.tag}
          </span>

          <p className="mt-4 text-sm leading-relaxed text-text-dim font-sans">
            {project.description}
          </p>

          {/* Quick Metrics Bar */}
          {project.metrics && (
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line/60 pt-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-lg bg-bg-panel-alt/80 border border-line-soft p-2 text-center">
                  <span className="block text-[9.5px] text-text-faint uppercase font-mono">{m.label}</span>
                  <span className="block text-xs font-bold text-cyan font-mono mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Badges & Actions */}
        <div className="mt-6 pt-5 border-t border-line/60">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded border border-line-soft bg-bg-panel-alt px-2 py-0.5 font-mono text-[10.5px] text-text-dim"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenDossier?.(project)}
              className="flex-1 rounded-lg border border-cyan/40 bg-cyan/10 py-2.5 font-mono text-xs font-bold text-cyan transition-all hover:bg-cyan hover:text-[#05080e] hover:shadow-neon-cyan cursor-pointer"
            >
              INTEL DOSSIER 🔍
            </button>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                onClick={() => audio.playClick(1200)}
                className="rounded-lg border border-green bg-green/10 px-4 py-2.5 font-mono text-xs font-bold text-green transition-all hover:bg-green hover:text-[#05080e] hover:shadow-neon-green"
              >
                Live ↗
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener"
              onClick={() => audio.playClick(1000)}
              className="rounded-lg border border-line px-3 py-2.5 font-mono text-xs text-text-dim transition-colors hover:border-text hover:text-text"
              title="GitHub Repository"
            >
              GH ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
