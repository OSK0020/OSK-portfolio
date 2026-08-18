import { processSteps } from '../data/projects'
import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

export function ServicesSection() {
  return (
    <section id="services" className="relative border-b border-line bg-bg py-32 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-14 max-w-[680px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-cyan shadow-[0_0_12px_rgba(95,185,255,0.2)]">
            <span className="h-[7px] w-[7px] animate-blip bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
            ENGINEERING WORKFLOW // SERVICES
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
            Want a mission-critical command interface? I engineer them from scratch.
          </h2>
          <p className="mt-4 text-[16px] text-text-dim leading-relaxed">
            I help organizations, founders, and security teams turn noisy, massive data streams into ultra-fast, visually stunning
            interfaces that provide instant situational clarity.
          </p>
        </Reveal>

        {/* 4-Step Process Grid */}
        <Reveal
          delay={80}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((step) => (
            <div
              key={step.num}
              onMouseEnter={() => audio.playHover()}
              className="group rounded-xl border border-line bg-bg-panel p-7 transition-all hover:border-green/50 hover:bg-bg-panel-alt hover:shadow-[0_10px_30px_-10px_rgba(61,255,160,0.15)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-green">
                  {step.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
                  PHASE // {step.tag}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold font-display text-text group-hover:text-green transition-colors">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-text-dim">{step.body}</p>
            </div>
          ))}
        </Reveal>

        {/* CTA Box */}
        <Reveal
          delay={140}
          className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-bg-panel p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)]"
        >
          <div>
            <span className="block font-display text-lg font-bold text-text">
              Have complex data waiting for a real-time command interface?
            </span>
            <p className="text-xs text-text-dim font-mono mt-1">
              From concept and 3D architectural prototypes to full production deployment.
            </p>
          </div>
          <a
            href="#contact"
            onClick={() => audio.playClick(1500)}
            onMouseEnter={() => audio.playHover()}
            className="rounded-lg border border-green bg-green/10 px-7 py-3.5 font-mono text-xs font-bold text-green transition-all hover:bg-green hover:text-[#06090b] hover:shadow-[0_0_24px_rgba(61,255,160,0.4)]"
          >
            Initiate Project Discussion ↓
          </a>
        </Reveal>
      </div>
    </section>
  )
}
