import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

interface SkillGroup {
  category: string
  icon: string
  accent: string
  skills: { name: string; level: number; spec: string }[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Realtime Rendering & 3D Math',
    icon: '🌐',
    accent: '#00f0ff',
    skills: [
      { name: 'Canvas 2D / 3D Projection & Fibonacci Spheres', level: 98, spec: '60 FPS Budget' },
      { name: 'WebGL & Three.js Shader Architecture', level: 94, spec: 'GPU Accelerated' },
      { name: 'Interactive Dot-Grid & Vector Fields', level: 96, spec: 'Mouse Reactive' },
    ],
  },
  {
    category: 'Sensory & Procedural Sound',
    icon: '🔊',
    accent: '#00ff9d',
    skills: [
      { name: 'Web Audio API Procedural Synthesis', level: 97, spec: '0kb Media Overhead' },
      { name: 'BiquadFilter & Frequency Envelopes', level: 95, spec: 'Low-Latency SFX' },
      { name: 'Tactical UI Micro-Sound Feedback Systems', level: 98, spec: 'A11y Compliant' },
    ],
  },
  {
    category: 'OSINT & Intelligence Telemetry',
    icon: '🛰️',
    accent: '#ff0055',
    skills: [
      { name: 'Multi-Source Signal Aggregation & Radar HUDs', level: 99, spec: 'Sub-40ms Ingest' },
      { name: 'Geopolitical Crisis Mapping & Anomaly Scoring', level: 96, spec: 'Real-time Feeds' },
      { name: 'Autonomous Push Notification Engines (NTFY)', level: 97, spec: 'Instant Dispatch' },
    ],
  },
  {
    category: 'AI Architectures & LLM Cascades',
    icon: '🧠',
    accent: '#ffb800',
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

  return (
    <section id="skills" className="relative border-b border-line bg-bg py-32 overflow-hidden" ref={containerRef}>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-cyan/5 blur-[160px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-16 max-w-[680px]">
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

        {/* 4 Skill Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SKILL_GROUPS.map((group, idx) => (
            <Reveal key={group.category} delay={idx * 60}>
              <div
                onMouseEnter={() => audio.playHover()}
                className="group relative overflow-hidden rounded-2xl border border-line bg-bg-panel p-7 transition-all hover:border-cyan/40 hover:shadow-neon-cyan/15"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-panel-alt text-lg">
                      {group.icon}
                    </span>
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
