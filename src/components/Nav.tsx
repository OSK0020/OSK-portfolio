import { useState } from 'react'
import { audio } from '../utils/audioEngine'

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-6">
        <a
          href="#top"
          onClick={() => audio.playClick(1500)}
          onMouseEnter={() => audio.playHover()}
          className="flex items-center gap-2.5 font-mono text-[17px] font-bold tracking-tight text-text group"
        >
          <span className="h-2.5 w-2.5 bg-green shadow-neon-green group-hover:scale-125 transition-transform" />
          <span>OSK</span>
          <span className="text-text-faint">_0020</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 text-[13px] font-mono text-text-dim lg:flex">
          <a
            href="#osn"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-green"
          >
            // OSN NETWORK
          </a>
          <a
            href="#globe"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-red"
          >
            // 3D GLOBE
          </a>
          <a
            href="#projects"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-cyan"
          >
            // PROJECTS
          </a>
          <a
            href="#skills"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-green"
          >
            // LOADOUT
          </a>
          <a
            href="#ai-lab"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-amber"
          >
            // AI LAB
          </a>
          <a
            href="#terminal"
            onClick={() => audio.playClick()}
            onMouseEnter={() => audio.playHover()}
            className="transition-colors hover:text-text"
          >
            // CLI
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://osn-e-xtra.vercel.app/"
            target="_blank"
            rel="noopener"
            onClick={() => audio.playRadarSweep()}
            onMouseEnter={() => audio.playHover()}
            className="rounded-lg border border-red bg-red/10 px-4.5 py-2 font-mono text-xs font-bold text-red transition-all hover:bg-red hover:text-[#05080e] hover:shadow-neon-red"
          >
            ENTER OSN EXTRA ↗
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => {
            setMobileOpen(!mobileOpen)
            audio.playClick(1100)
          }}
          className="rounded border border-line p-2 text-text-dim lg:hidden"
        >
          <span className="sr-only">Toggle Menu</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-line bg-bg-panel px-6 py-4 lg:hidden space-y-3 font-mono text-xs">
          <a
            href="#osn"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-green"
          >
            // OSN NETWORK
          </a>
          <a
            href="#globe"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-red"
          >
            // 3D GLOBE
          </a>
          <a
            href="#projects"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-cyan"
          >
            // PROJECTS
          </a>
          <a
            href="#skills"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-green"
          >
            // LOADOUT
          </a>
          <a
            href="#ai-lab"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-amber"
          >
            // AI LAB
          </a>
          <a
            href="#terminal"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-text"
          >
            // CLI TERMINAL
          </a>
          <a
            href="#contact-uplink"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-text-dim hover:text-cyan"
          >
            // CONTACT UPLINK
          </a>
        </div>
      )}
    </header>
  )
}
