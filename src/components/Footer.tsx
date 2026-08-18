import { Reveal } from './Reveal'
import { audio } from '../utils/audioEngine'

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-line bg-bg-panel pt-28 pb-14 overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-green/5 blur-[140px]" />

      <div className="relative mx-auto max-w-[1240px] px-6">
        <Reveal className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-[0_0_12px_rgba(61,255,160,0.2)]">
              <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
              TRANSMISSION DISPATCH
            </span>

            <h2 className="mt-4 font-display text-[clamp(28px,3.5vw,40px)] font-extrabold leading-tight">
              Ready to engineer your next real-time command interface?
            </h2>

            <p className="mt-4 text-[15.5px] leading-relaxed text-text-dim">
              Whether you need an interactive tactical intelligence portal, a WebGL 3D experience, or an autonomous AI bot — let's build something extraordinary together.
            </p>

            <div className="mt-8">
              <a
                href="mailto:oristern8@gmail.com"
                onClick={() => audio.playClick(1600)}
                onMouseEnter={() => audio.playHover()}
                className="inline-flex items-center gap-2 rounded-lg border border-green bg-green/10 px-7 py-4 font-mono text-sm font-bold text-green transition-all hover:bg-green hover:text-[#06090b] hover:shadow-[0_0_24px_rgba(61,255,160,0.4)]"
              >
                <span>INITIATE TRANSMISSION (EMAIL)</span>
                <span>✉</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-[0.08em] text-text">
                // CONTACT
              </span>
              <div className="space-y-2.5 font-mono text-xs text-text-dim">
                <a
                  href="mailto:oristern8@gmail.com"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-green transition-colors"
                >
                  oristern8@gmail.com
                </a>
                <a
                  href="https://github.com/OSK0020"
                  target="_blank"
                  rel="noopener"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-green transition-colors"
                >
                  github.com/OSK0020 ↗
                </a>
              </div>
            </div>

            <div>
              <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-[0.08em] text-red">
                // OSN NETWORK
              </span>
              <div className="space-y-2.5 font-mono text-xs text-text-dim">
                <a
                  href="https://osn-e-xtra.vercel.app/"
                  target="_blank"
                  rel="noopener"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-red transition-colors"
                >
                  OSN Extra ↗
                </a>
                <a
                  href="https://osn-website.vercel.app/"
                  target="_blank"
                  rel="noopener"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-red transition-colors"
                >
                  Global Security Poll ↗
                </a>
              </div>
            </div>

            <div>
              <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-[0.08em] text-cyan">
                // EXPERIMENTAL
              </span>
              <div className="space-y-2.5 font-mono text-xs text-text-dim">
                <a
                  href="https://iamge-lab-website.vercel.app/"
                  target="_blank"
                  rel="noopener"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-cyan transition-colors"
                >
                  AI Models Laboratory ↗
                </a>
                <a
                  href="https://github.com/OSK0020/X-comment-BOT"
                  target="_blank"
                  rel="noopener"
                  onClick={() => audio.playClick()}
                  onMouseEnter={() => audio.playHover()}
                  className="block hover:text-cyan transition-colors"
                >
                  X Auto-Reply Bot ↗
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-8 font-mono text-xs text-text-faint">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
            <span>OPERATOR: OSK0020 // ARCHITECTURE: REACT 19 + CANVAS 3D</span>
          </div>
          <span>© {new Date().getFullYear()} ALL SYSTEMS VERIFIED &amp; OPERATIONAL</span>
        </div>
      </div>
    </footer>
  )
}
