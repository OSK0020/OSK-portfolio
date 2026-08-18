import { TerminalPanel } from './TerminalPanel'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-center overflow-hidden pt-42 pb-24">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,black_40%,transparent_90%)]" />

      <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-7 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-green">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            Independent developer // real-time OSINT
          </span>

          <h1 className="mt-5 text-balance font-display text-[clamp(34px,4.6vw,58px)] font-extrabold leading-[1.12]">
            I build interfaces that turn <span className="text-green">chaotic data</span> into one clear picture.
          </h1>

          <p className="mt-5 max-w-[52ch] text-[17px] text-text-dim">
            Independent developer, and founder of{' '}
            <strong className="text-text">OSN — Observer Security Network</strong>. Whether it's a
            real-time tactical map, a bot monitoring the web, or an experimental AI lab — I design,
            build, and run it end to end.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="https://osn-e-xtra.vercel.app/"
              target="_blank"
              rel="noopener"
              className="border border-red px-6 py-3.5 font-mono text-sm text-red transition-all hover:bg-red hover:text-[#0a0403] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
            >
              Enter OSN Extra ↗
            </a>
            <a
              href="#projects"
              className="border border-line px-6 py-3.5 font-mono text-sm text-text-dim transition-colors hover:border-text-dim hover:text-text"
            >
              See the projects ↓
            </a>
          </div>

          <div className="mt-11 flex flex-wrap gap-8 font-mono">
            <div>
              <b className="block text-[22px] font-bold text-text">
                <CountUp to={4} />
              </b>
              <span className="text-[11.5px] uppercase tracking-[0.06em] text-text-faint">
                products in production
              </span>
            </div>
            <div>
              <b className="block text-[22px] font-bold text-text">
                <CountUp to={24} suffix="/7" />
              </b>
              <span className="text-[11.5px] uppercase tracking-[0.06em] text-text-faint">
                live monitoring &amp; automation
              </span>
            </div>
            <div>
              <b className="block text-[22px] font-bold text-text">OSN</b>
              <span className="text-[11.5px] uppercase tracking-[0.06em] text-text-faint">
                intelligence network founded
              </span>
            </div>
          </div>
        </div>

        <Reveal>
          <TerminalPanel />
        </Reveal>
      </div>
    </section>
  )
}
