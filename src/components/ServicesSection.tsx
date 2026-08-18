import { processSteps } from '../data/projects'
import { Reveal } from './Reveal'

export function ServicesSection() {
  return (
    <section id="services" className="border-y border-line bg-bg-panel-alt py-30">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-cyan">
            <span className="h-[7px] w-[7px] animate-blip bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
            Services
          </span>
          <h2 className="mt-4 font-display text-[clamp(26px,3.2vw,38px)] font-extrabold">
            Want an interface like this? I build them for you.
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15.5px] text-text-dim">
            I help businesses, founders, and organizations turn complex data — financial,
            security, operational, or otherwise — into a clear, fast, impressive command
            interface. From an OSINT dashboard to an automated bot or an experimental AI product,
            just like the projects above.
          </p>
        </Reveal>

        <Reveal
          delay={80}
          className="mt-13 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((step) => (
            <div key={step.num} className="bg-bg-panel p-7">
              <span className="mb-4 block font-mono text-[13px] text-green">
                {step.num} / {step.tag}
              </span>
              <h3 className="mb-2.5 text-[16.5px] font-bold font-display">{step.title}</h3>
              <p className="text-[13.5px] text-text-dim">{step.body}</p>
            </div>
          ))}
        </Reveal>

        <Reveal
          delay={140}
          className="mt-13 flex flex-wrap items-center justify-between gap-5 border border-line bg-bg-panel px-8 py-7"
        >
          <p className="text-[14.5px] text-text-dim">
            Have data that needs its own command interface? Let's talk about it.
          </p>
          <a
            href="#contact"
            className="border border-green px-6 py-3.5 font-mono text-sm text-green transition-all hover:bg-green hover:text-[#04140c] hover:shadow-[0_0_24px_rgba(61,255,160,0.4)]"
          >
            Let's talk about your project ↓
          </a>
        </Reveal>
      </div>
    </section>
  )
}
