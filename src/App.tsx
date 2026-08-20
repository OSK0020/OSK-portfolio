import { TacticalStreetViewSplash } from './components/TacticalStreetViewSplash'
import { BunkerResistanceGate } from './components/BunkerResistanceGate'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ThreatGlobeSection } from './components/ThreatGlobeSection'
import { OsnSection } from './components/OsnSection'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsMatrix } from './components/SkillsMatrix'
import { OperatorDossier } from './components/OperatorDossier'
import { LabAndTerminalSection } from './components/LabAndTerminalSection'
import { ContactUplink } from './components/ContactUplink'
import { Footer } from './components/Footer'
import { TacticalHUD } from './components/TacticalHUD'
import { CustomCursor } from './components/CustomCursor'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export function App() {
  // Initialize Lenis + GSAP ScrollTrigger momentum smooth scrolling
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black font-sans">
      <CustomCursor />
      <TacticalHUD />
      <Nav />

      {/* LEVEL 00: ORBITAL RECON & STREET-VIEW APPROACH */}
      <section id="approach">
        <TacticalStreetViewSplash />
      </section>

      {/* HOLLYWOOD RESISTANCE GATE 01: SURFACE TO LEVEL 01 */}
      <BunkerResistanceGate
        gateId="GATE-01 // AIRLOCK ALPHA"
        levelName="Command Operations Center"
        fromDepth={0}
        toDepth={-50}
        radiationUSv={1.2}
        doorType="blast"
      />

      {/* LEVEL 01 (-50m): STRATEGIC SITUATION ROOM */}
      <main id="top" className="relative z-10 bg-black">
        <Hero />
        <ThreatGlobeSection />
        <OsnSection />
      </main>

      {/* HOLLYWOOD RESISTANCE GATE 02: LEVEL 01 TO LEVEL 02 */}
      <BunkerResistanceGate
        gateId="GATE-02 // BIO-VAULT IRIS"
        levelName="Classified Weapons & Projects"
        fromDepth={-50}
        toDepth={-120}
        radiationUSv={8.4}
        doorType="iris"
      />

      {/* LEVEL 02 (-120m): CLASSIFIED R&D VAULT */}
      <section id="projects" className="relative z-10 bg-black">
        <ProjectsSection />
        <SkillsMatrix />
        <OperatorDossier />
      </section>

      {/* HOLLYWOOD RESISTANCE GATE 03: LEVEL 02 TO DEEP CORE */}
      <BunkerResistanceGate
        gateId="GATE-03 // REACTOR SEAL"
        levelName="Deep Subterranean Core"
        fromDepth={-120}
        toDepth={-250}
        radiationUSv={26.8}
        doorType="blast"
      />

      {/* LEVEL 03 (-250m): MAINFRAME TERMINAL & TRANSMISSION UPLINK */}
      <section id="terminal" className="relative z-10 bg-black">
        <LabAndTerminalSection />
        <ContactUplink />
        <Footer />
      </section>
    </div>
  )
}

export default App
