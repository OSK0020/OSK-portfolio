import type { Project } from '../data/projects'
import { useState, useRef } from 'react'
import { StatusPill } from './StatusPill'
import { audio } from '../utils/audioEngine'

interface Props {
  project: Project
  accentColor?: string
}

export function HolographicProjectCard({ project, accentColor }: Props) {
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

    const rotX = ((y - centerY) / centerY) * -10
    const rotY = ((x - centerX) / centerX) * 10

    setRotation({ x: rotX, y: rotY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      style={{ perspective: '1000px' }}
      className="group relative"
      onMouseEnter={() => audio.playHover()}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          borderColor: accentColor ? `color-mix(in srgb, ${accentColor} 30%, var(--color-line))` : undefined,
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
        }}
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-bg-panel p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] group-hover:border-text-dim/40 group-hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
      >
        {/* Holographic Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 60%)`,
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

          <h3 className="mt-4 font-display text-2xl font-bold text-text group-hover:text-green transition-colors">
            {project.name}
          </h3>
          <span className="mt-1 block font-mono text-xs text-cyan">
            {project.tag}
          </span>

          <p className="mt-4 text-sm leading-relaxed text-text-dim">
            {project.description}
          </p>
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
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                onClick={() => audio.playClick(1200)}
                className="flex-1 text-center rounded border border-green bg-green/10 py-2.5 font-mono text-xs font-bold text-green transition-all hover:bg-green hover:text-[#06090b] hover:shadow-[0_0_16px_rgba(61,255,160,0.35)]"
              >
                Live Deployment ↗
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener"
              onClick={() => audio.playClick(1000)}
              className="rounded border border-line px-3.5 py-2.5 font-mono text-xs text-text-dim transition-colors hover:border-text hover:text-text"
              title="View Source Repository"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
