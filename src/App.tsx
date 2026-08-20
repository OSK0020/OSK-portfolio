import { Nav } from './components/Nav'
import { CyberTicker } from './components/CyberTicker'
import { Hero } from './components/Hero'
import { BunkerLevelGate } from './components/BunkerLevelGate'
import { OsnSection } from './components/OsnSection'
import { ThreatGlobeSection } from './components/ThreatGlobeSection'
import { OperatorDossier } from './components/OperatorDossier'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsMatrix } from './components/SkillsMatrix'
import { LabAndTerminalSection } from './components/LabAndTerminalSection'
import { ContactUplink } from './components/ContactUplink'
import { ServicesSection } from './components/ServicesSection'
import { Footer } from './components/Footer'
import { TacticalHUD } from './components/TacticalHUD'
import { ElevatorShaftOverlay } from './components/ElevatorShaftOverlay'
import { CustomCursor } from './components/CustomCursor'
import { InteractiveDotGrid } from './components/InteractiveDotGrid'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  // Initialize Lenis + GSAP ScrollTrigger momentum smooth scrolling
  useSmoothScroll()

  return (
    <div className="relative min-h-screen bg-bg text-text selection:bg-green selection:text-[#05080e]">

      {/* Mouse & Scroll Reactive 3D Tunnel Warp Canvas */}
      <InteractiveDotGrid />

      {/* Rapid Elevator Descent Speed Streams Overlay */}
      <ElevatorShaftOverlay />

      {/* Floating Tactical HUD Layer with Bunker Depth Gauge */}
      <TacticalHUD />

      {/* Reticle Cursor for Non-Touch Screens */}
      <CustomCursor />

      {/* Navigation Bar */}
      <Nav />

      {/* Main Experience Stream - The Cyber Bunker Scrollytelling Journey */}
      <main id="portfolio-main" className="relative z-10 pt-[70px]">
        {/* Real-time Global OSINT Telemetry Ticker */}
        <CyberTicker />

        {/* LEVEL 0: SURFACE PERIMETER */}
        <Hero />

        {/* LEVEL 1: SITUATION ROOM */}
        <BunkerLevelGate
          level={1}
          code="CHECKPOINT // SITUATION ROOM"
          title="OSN Tactical Threat Matrix & Surveillance"
          depth="-240m"
          clearance="LEVEL-2 CONFIDENTIAL"
        />
        <OsnSection />

        {/* LEVEL 2: WAR ROOM */}
        <BunkerLevelGate
          level={2}
          code="CHECKPOINT // WAR ROOM"
          title="3D Geospatial Crisis Globe & Intercept Nodes"
          depth="-480m"
          clearance="LEVEL-3 SECRET"
        />
        <ThreatGlobeSection />

        {/* LEVEL 3: ARSENAL & CLASSIFIED DOSSIER */}
        <BunkerLevelGate
          level={3}
          code="CHECKPOINT // TACTICAL ARSENAL & DOSSIER"
          title="Operator Personnel File & Production Platforms"
          depth="-720m"
          clearance="LEVEL-4 RESTRICTED"
        />
        <OperatorDossier />
        <ProjectsSection />
        <SkillsMatrix />

        {/* LEVEL 4: R&D QUANTUM CHAMBER */}
        <BunkerLevelGate
          level={4}
          code="CHECKPOINT // R&D QUANTUM CHAMBER"
          title="AI Neural Inference Lab & Operator CLI Terminal"
          depth="-960m"
          clearance="LEVEL-5 TOP SECRET"
        />
        <LabAndTerminalSection />

        {/* LEVEL 5: DEEP VAULT */}
        <BunkerLevelGate
          level={5}
          code="AIRLOCK // INNER SANCTUM UPLINK"
          title="Direct P2P Encrypted Operator Transmission"
          depth="-1,200m"
          clearance="COSMIC TOP SECRET // RESTRICTED ACCESS"
        />
        <ContactUplink />
        <ServicesSection />
      </main>

      {/* Dispatch Footer */}
      <Footer />
    </div>
  )
}
