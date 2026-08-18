import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer id="contact" className="pt-24 pb-10">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal className="mb-15 flex flex-wrap items-start justify-between gap-10">
          <h2 className="max-w-[16ch] font-display text-[clamp(24px,3.4vw,34px)] font-extrabold">
            Ready to build the next command interface?
          </h2>

          <div className="flex flex-wrap gap-11">
            <div>
              <span className="mb-3.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint">
                Contact
              </span>
              <a
                href="mailto:hello@example.com"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                hello@example.com
              </a>
              <a
                href="https://github.com/OSK0020"
                target="_blank"
                rel="noopener"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                github.com/OSK0020
              </a>
            </div>
            <div>
              <span className="mb-3.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint">
                OSN Products
              </span>
              <a
                href="https://osn-e-xtra.vercel.app/"
                target="_blank"
                rel="noopener"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                OSN Extra
              </a>
              <a
                href="https://osn-website.vercel.app/"
                target="_blank"
                rel="noopener"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                Global Security Data Poll
              </a>
            </div>
            <div>
              <span className="mb-3.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint">
                Lab
              </span>
              <a
                href="https://iamge-lab-website.vercel.app/"
                target="_blank"
                rel="noopener"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                AI Models Laboratory
              </a>
              <a
                href="https://github.com/OSK0020/X-comment-BOT"
                target="_blank"
                rel="noopener"
                className="mb-2.5 block text-sm text-text-dim transition-colors hover:text-green"
              >
                X Auto-Reply Bot
              </a>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6 font-mono text-[11.5px] text-text-faint">
          <span>© 2026 OSK0020 — all systems live</span>
          <span>built &amp; operated independently</span>
        </div>
      </div>
    </footer>
  )
}
