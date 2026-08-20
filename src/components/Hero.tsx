import { useEffect, useRef } from 'react'
import { TerminalPanel } from './TerminalPanel'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'
import { CyberDecryptedText } from './CyberDecryptedText'
import { audio } from '../utils/audioEngine'
import { MagneticButton } from './ui/magnetic-button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null)
  const headlineRef = useRef<HTMLHeadingElement | null>(null)
  const terminalWrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle scroll parallax on Hero headline & terminal
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -40,
          opacity: 0.85,
        })
      }

      if (terminalWrapperRef.current) {
        gsap.to(terminalWrapperRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: -25,
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleBunkerJump = (href: string) => {
    audio.playClick(1100)
    const target = document.querySelector(href)
    if (target) {
      const lenisInstance = (
        window as unknown as { lenis?: { scrollTo: (el: Element | string) => void } }
      ).lenis
      if (lenisInstance) {
        lenisInstance.scrollTo(target)
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex min-h-[90vh] items-center overflow-hidden pt-14 pb-20 sm:pt-20"
    >
      {/* Dynamic Grid Background Layer */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_90%_70%_at_50%_10%,black_50%,transparent_90%)]" />

      {/* Cyber Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-green/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-cyan/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-green/40 bg-green/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-green shadow-[0_0_20px_rgba(0,255,157,0.2)]">
            <span className="h-[7px] w-[7px] animate-blip bg-green shadow-[0_0_8px_var(--color-green)]" />
            <CyberDecryptedText
              text="LEVEL 0 // SURFACE GATE & COMMAND TERMINAL"
              speed={25}
            />
          </div>

          <h1
            ref={headlineRef}
            className="mt-6 text-balance font-display text-[clamp(34px,4.8vw,62px)] font-extrabold leading-[1.1] tracking-tight"
          >
            I build interfaces that turn{' '}
            <span className="text-green underline decoration-green/40 decoration-wavy underline-offset-8">
              <CyberDecryptedText text="chaotic data" speed={30} />
            </span>{' '}
            into one clear picture.
          </h1>

          <p className="mt-6 max-w-[54ch] text-[16.5px] leading-relaxed text-text-dim">
            Independent full-stack developer and founder of{' '}
            <strong className="text-text">OSN — Observer Security Network</strong>. From real-time
            tactical threat radars and autonomous AI cascades to experimental WebGL laboratories — I architect,
            build, and deploy them end to end.
          </p>

          {/* Interactive Magnetic CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="https://osn-e-xtra.vercel.app/"
              target="_blank"
              rel="noopener"
              className="inline-block"
            >
              <MagneticButton
                strength={0.3}
                soundFrequency={1500}
                className="rounded-lg border border-red bg-red/10 px-7 py-3.5 font-mono text-sm font-bold text-red transition-all hover:bg-red hover:text-[#06090b] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
              >
                Enter OSN Extra ↗
              </MagneticButton>
            </a>

            <MagneticButton
              strength={0.3}
              soundFrequency={1300}
              onClick={() => handleBunkerJump('#terminal')}
              className="rounded-lg border border-green/40 bg-green/5 px-7 py-3.5 font-mono text-sm text-green transition-all hover:border-green hover:bg-green/15 hover:shadow-[0_0_20px_rgba(61,255,160,0.25)]"
            >
              Launch CLI Terminal ↵
            </MagneticButton>

            <MagneticButton
              strength={0.3}
              soundFrequency={900}
              onClick={() => handleBunkerJump('#projects')}
              className="rounded-lg border border-line bg-bg-panel px-6 py-3.5 font-mono text-sm text-text-dim transition-colors hover:border-text-dim hover:text-text"
            >
              See All Projects ↓
            </MagneticButton>
          </div>

          {/* Interactive Bunker Levels Quick Selector */}
          <div className="mt-9 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-text-faint uppercase text-[10.5px] mr-1">
              BUNKER LEVELS:
            </span>
            {[
              { label: 'L0: SURFACE', href: '#top', depth: '0m', color: 'text-text' },
              { label: 'L1: SITUATION ROOM', href: '#osn', depth: '-240m', color: 'text-red' },
              { label: 'L2: WAR ROOM', href: '#globe', depth: '-480m', color: 'text-cyan' },
              { label: 'L3: ARSENAL', href: '#projects', depth: '-720m', color: 'text-green' },
              { label: 'L4: QUANTUM AI', href: '#terminal', depth: '-960m', color: 'text-amber' },
              { label: 'L5: DEEP VAULT', href: '#contact-uplink', depth: '-1200m', color: 'text-purple-400' },
            ].map((lvl) => (
              <a
                key={lvl.label}
                href={lvl.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleBunkerJump(lvl.href)
                }}
                onMouseEnter={() => audio.playHover()}
                className="group flex items-center gap-1.5 rounded-lg border border-line bg-bg-panel/70 px-2.5 py-1.5 hover:border-cyan hover:bg-cyan/10 transition-all cursor-pointer"
              >
                <span className={`font-bold ${lvl.color}`}>{lvl.label}</span>
                <span className="text-[9.5px] text-text-faint group-hover:text-cyan">
                  ({lvl.depth})
                </span>
              </a>
            ))}
          </div>

          {/* Telemetry Stats */}
          <div className="mt-10 flex flex-wrap gap-8 font-mono border-t border-line/60 pt-6">
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
          <div ref={terminalWrapperRef} className="relative">
            {/* Ambient HUD Backglow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green/20 to-cyan/20 opacity-30 blur-xl" />
            <TerminalPanel />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
