import { TerminalPanel } from './TerminalPanel'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[95vh] items-center overflow-hidden pt-36 pb-20">
      {/* Dynamic Grid Background Layer */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_90%_70%_at_50%_10%,black_50%,transparent_90%)]" />

      {/* Cyber Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-green/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-cyan/5 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-green/30 bg-green/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-[0_0_15px_rgba(61,255,160,0.15)]">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            INDEPENDENT DEVELOPER // REAL-TIME OSINT &amp; AI
          </div>

          <h1 className="mt-6 text-balance font-display text-[clamp(34px,4.8vw,62px)] font-extrabold leading-[1.1] tracking-tight">
            I build interfaces that turn <span className="text-green underline decoration-green/40 decoration-wavy underline-offset-8">chaotic data</span> into one clear picture.
          </h1>

          <p className="mt-6 max-w-[54ch] text-[16.5px] leading-relaxed text-text-dim">
            Independent full-stack developer and founder of{' '}
            <strong className="text-text">OSN — Observer Security Network</strong>. From real-time
            tactical threat radars and autonomous AI cascades to experimental WebGL laboratories — I architect,
            build, and deploy them end to end.
          </p>

          {/* Interactive CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://osn-e-xtra.vercel.app/"
              target="_blank"
              rel="noopener"
              onClick={() => audio.playRadarSweep()}
              onMouseEnter={() => audio.playHover()}
              className="rounded-lg border border-red bg-red/10 px-7 py-3.5 font-mono text-sm font-bold text-red transition-all hover:bg-red hover:text-[#06090b] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
            >
              Enter OSN Extra ↗
            </a>
            <a
              href="#terminal"
              onClick={() => audio.playClick(1300)}
              onMouseEnter={() => audio.playHover()}
              className="rounded-lg border border-green/40 bg-green/5 px-7 py-3.5 font-mono text-sm text-green transition-all hover:border-green hover:bg-green/15 hover:shadow-[0_0_20px_rgba(61,255,160,0.25)]"
            >
              Launch CLI Terminal ↵
            </a>
            <a
              href="#projects"
              onClick={() => audio.playClick(900)}
              onMouseEnter={() => audio.playHover()}
              className="rounded-lg border border-line bg-bg-panel px-6 py-3.5 font-mono text-sm text-text-dim transition-colors hover:border-text-dim hover:text-text"
            >
              See All Projects ↓
            </a>
          </div>

          {/* Telemetry Stats */}
          <div className="mt-12 flex flex-wrap gap-8 font-mono border-t border-line/60 pt-6">
            <div>
              <b className="block text-[24px] font-bold text-text">
                <CountUp to={4} />
              </b>
              <span className="text-[11px] uppercase tracking-[0.06em] text-text-faint">
                products in production
              </span>
            </div>
            <div>
              <b className="block text-[24px] font-bold text-cyan">
                <CountUp to={24} suffix="/7" />
              </b>
              <span className="text-[11px] uppercase tracking-[0.06em] text-text-faint">
                live monitoring &amp; automation
              </span>
            </div>
            <div>
              <b className="block text-[24px] font-bold text-red">OSN</b>
              <span className="text-[11px] uppercase tracking-[0.06em] text-text-faint">
                intelligence network founded
              </span>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="relative">
            {/* Ambient HUD Backglow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green/20 to-cyan/20 opacity-30 blur-xl" />
            <TerminalPanel />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
