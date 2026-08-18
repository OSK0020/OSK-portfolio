import type { Project } from '../data/projects'
import { useEffect } from 'react'
import { StatusPill } from './StatusPill'
import { audio } from '../utils/audioEngine'

interface Props {
  project: Project | null
  onClose: () => void
}

export function ProjectIntelligenceModal({ project, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (project) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      {/* Background CRT Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />

      <div
        className="relative max-w-2xl w-full rounded-2xl border border-cyan/40 bg-bg-panel p-6 sm:p-8 font-mono shadow-neon-cyan/30 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <StatusPill status={project.status} />
            <span className="text-xs text-cyan font-bold tracking-widest uppercase">
              // INTELLIGENCE DOSSIER
            </span>
          </div>
          <button
            onClick={() => {
              audio.playClick(1500)
              onClose()
            }}
            className="rounded border border-line bg-bg-panel-alt px-3 py-1 text-xs text-text-dim hover:border-red hover:text-red transition-colors"
          >
            ESC ✕
          </button>
        </div>

        {/* Title & Tag */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold font-display text-text">{project.name}</h2>
          <span className="text-xs text-cyan mt-1 block">{project.tag}</span>
        </div>

        {/* Telemetry Bar */}
        {project.dossier?.telemetry && (
          <div className="mt-4 rounded-lg border border-green/30 bg-green/10 p-3 text-xs text-green font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
            <span>{project.dossier.telemetry}</span>
          </div>
        )}

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-line bg-bg-panel-alt p-3 text-center">
                <span className="block text-[10px] text-text-faint uppercase">{m.label}</span>
                <span className="block text-base font-bold text-text mt-1">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Deep Dive Description & Architecture */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-xs text-text-faint uppercase font-bold tracking-wider mb-1">
              SYSTEM OVERVIEW
            </h4>
            <p className="text-xs leading-relaxed text-text-dim font-sans">
              {project.dossier?.overview || project.description}
            </p>
          </div>

          {project.dossier?.architecture && (
            <div>
              <h4 className="text-xs text-text-faint uppercase font-bold tracking-wider mb-2">
                CORE ARCHITECTURE
              </h4>
              <ul className="space-y-1.5 text-xs text-text-dim font-sans list-disc list-inside">
                {project.dossier.architecture.map((arch, idx) => (
                  <li key={idx}>
                    <span className="text-cyan font-mono font-bold">[{idx + 1}]</span> {arch}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-xs text-text-faint uppercase font-bold tracking-wider mb-2">
              STACK VERIFICATION
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded border border-line-soft bg-bg px-2.5 py-1 text-[10.5px] text-text-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-3 border-t border-line/60 pt-5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener"
              onClick={() => audio.playRadarSweep()}
              className="flex-1 rounded-lg border border-green bg-green/15 py-3 text-center text-xs font-bold text-green transition-all hover:bg-green hover:text-[#05080e] hover:shadow-neon-green"
            >
              LAUNCH LIVE SYSTEM ↗
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener"
            onClick={() => audio.playClick(1000)}
            className="rounded-lg border border-line bg-bg-panel-alt px-5 py-3 text-center text-xs text-text-dim hover:border-text-dim hover:text-text transition-colors"
          >
            VIEW REPO GITHUB ↗
          </a>
        </div>
      </div>
    </div>
  )
}
