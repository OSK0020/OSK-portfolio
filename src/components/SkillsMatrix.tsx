import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

interface SkillGroup {
  id: string
  category: string
  accent: string
  icon: React.ReactNode
  skills: { name: string; level: number; spec: string }[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: '3d',
    category: 'Realtime Rendering & 3D Math',
    accent: '#00f0ff',
    icon: (
      <svg className="h-5 w-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    skills: [
      { name: 'Canvas 2D / 3D Projection & Fibonacci Spheres', level: 98, spec: '60 FPS Budget' },
      { name: 'WebGL & Three.js Shader Architecture', level: 94, spec: 'GPU Accelerated' },
      { name: 'Interactive Dot-Grid & Vector Fields', level: 96, spec: 'Mouse Reactive' },
    ],
  },
  {
    id: 'audio',
    category: 'Sensory & Procedural Sound',
    accent: '#00ff9d',
    icon: (
      <svg className="h-5 w-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    skills: [
      { name: 'Web Audio API Procedural Synthesis', level: 97, spec: '0kb Media Overhead' },
      { name: 'BiquadFilter & Frequency Envelopes', level: 95, spec: 'Low-Latency SFX' },
      { name: 'Tactical UI Micro-Sound Feedback Systems', level: 98, spec: 'A11y Compliant' },
    ],
  },
  {
    id: 'osint',
    category: 'OSINT & Intelligence Telemetry',
    accent: '#ff0055',
    icon: (
      <svg className="h-5 w-5 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    skills: [
      { name: 'Multi-Source Signal Aggregation & Radar HUDs', level: 99, spec: 'Sub-40ms Ingest' },
      { name: 'Geopolitical Crisis Mapping & Anomaly Scoring', level: 96, spec: 'Real-time Feeds' },
      { name: 'Autonomous Push Notification Engines (NTFY)', level: 97, spec: 'Instant Dispatch' },
    ],
  },
  {
    id: 'ai',
    category: 'AI Architectures & LLM Cascades',
    accent: '#ffb800',
    icon: (
      <svg className="h-5 w-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    skills: [
      { name: 'Gemini Multi-Model Cascades & Search Grounding', level: 96, spec: '4-Stage Pipeline' },
      { name: 'Quantization Benchmarking (INT4 / INT8 / FP16)', level: 93, spec: 'VRAM Profiling' },
      { name: 'Autonomous OSINT Reply Bots (X / Social)', level: 98, spec: '24/7 Operations' },
    ],
  },
]

export function SkillsMatrix() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filteredGroups =
    activeFilter === 'all'
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((g) => g.id === activeFilter)

  return (
    <section id="skills" className="relative border-b border-line bg-bg py-32 overflow-hidden" ref={containerRef}>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-cyan/5 blur-[160px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-12 max-w-[680px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-neon-green/20">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            OPERATOR LOADOUT // PROFICIENCY MATRIX
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
            Calibrated technical competencies &amp; system architecture.
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed">
            Every capability below is verified through live production deployments — from high-frequency canvas rendering
            to autonomous OSINT ingestion pipelines.
          </p>
        </Reveal>

        {/* Tactical Filter Chips */}
        <div className="mb-10 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-text-faint mr-2 text-[11px]">FILTER_SECTOR:</span>
          {[
            { id: 'all', label: 'ALL PROFICIENCIES' },
            { id: '3d', label: '3D & RENDERING' },
            { id: 'audio', label: 'PROCEDURAL AUDIO' },
            { id: 'osint', label: 'OSINT & TELEMETRY' },
            { id: 'ai', label: 'AI & LLM CASCADES' },
          ].map((tab) => {
            const isSel = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id)
                  audio.playClick(1300)
                }}
                onMouseEnter={() => audio.playHover()}
                className={`rounded-lg border px-3.5 py-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'border-green bg-green/15 text-text font-bold shadow-[0_0_15px_rgba(0,255,157,0.25)]'
                    : 'border-line bg-bg-panel-alt text-text-dim hover:border-text-dim hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 4 Skill Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredGroups.map((group, idx) => (
            <Reveal key={group.category} delay={idx * 60}>
              <div
                onMouseEnter={() => audio.playHover()}
                className="group relative overflow-hidden rounded-2xl border border-line bg-bg-panel p-7 transition-all hover:border-cyan/40 hover:shadow-neon-cyan/15"
              >
                {/* Header with SVG Vector Icon */}
                <div className="flex items-center justify-between border-b border-line/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-panel-alt shadow-inner"
                      style={{ borderColor: `${group.accent}33` }}
                    >
                      {group.icon}
                    </div>
                    <h3 className="font-display text-base font-bold text-text group-hover:text-cyan transition-colors">
                      {group.category}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
                    LEVEL // 0{idx + 1}
                  </span>
                </div>

                {/* Skills Progress Bars */}
                <div className="mt-6 space-y-5">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-text-dim">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-faint">[{skill.spec}]</span>
                          <span className="font-bold text-green">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-bg-panel-alt overflow-hidden border border-line/60">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: isVisible ? `${skill.level}%` : '0%',
                            backgroundColor: group.accent,
                            boxShadow: `0 0 12px ${group.accent}66`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
