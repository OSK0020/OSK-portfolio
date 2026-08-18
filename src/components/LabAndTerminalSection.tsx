import { AILabPlayground } from './AILabPlayground'
import { InteractiveTerminal } from './InteractiveTerminal'
import { Reveal } from './Reveal'

export function LabAndTerminalSection() {
  return (
    <section id="ai-lab" className="relative border-b border-line bg-bg-panel-alt py-32 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute top-1/4 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-cyan/5 blur-[150px]" />

      <div className="relative mx-auto max-w-[1240px] px-6 space-y-24">
        {/* AI Lab Sandbox */}
        <div>
          <Reveal className="mb-12 max-w-[640px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-cyan shadow-[0_0_12px_rgba(95,185,255,0.2)]">
              <span className="h-[7px] w-[7px] animate-blip bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
              EXPERIMENTAL AI VISUAL PLAYGROUND
            </span>
            <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
              AI Models Laboratory &amp; Latent Vector Space
            </h2>
            <p className="mt-4 text-[16px] text-text-dim leading-relaxed">
              Test generative models, benchmark inference latencies, and inspect neural waveform synthesis in real time.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <AILabPlayground />
          </Reveal>
        </div>

        {/* Live Interactive CLI Terminal */}
        <div id="terminal">
          <Reveal className="mb-12 max-w-[640px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-[0_0_12px_rgba(61,255,160,0.2)]">
              <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
              COMMAND &amp; CONTROL // OPERATOR CLI
            </span>
            <h2 className="mt-4 text-balance font-display text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight">
              Interactive System Terminal
            </h2>
            <p className="mt-4 text-[16px] text-text-dim leading-relaxed">
              Type commands into the live interactive console to query system architecture, trigger alerts, decrypt matrix codes,
              or dispatch direct transmissions.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <InteractiveTerminal />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
