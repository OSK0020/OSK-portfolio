import { MinimalTacticalSplash } from './components/MinimalTacticalSplash'
import { SubterraneanDescentGate } from './components/SubterraneanDescentGate'
import { BunkerLevelChamber } from './components/BunkerLevelChamber'
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
  // Initialize Lenis + GSAP ScrollTrigger momentum smooth scrolling & subterranean depth audio
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black font-sans">
      {/* 1. Fast & Sleek Tactical Splash Bootloader */}
      <MinimalTacticalSplash />

      <CustomCursor />
      <TacticalHUD />
      <Nav />

      {/* LEVEL 01 (0m to -55m): COMMAND OPERATIONS CHAMBER */}
      <BunkerLevelChamber level={1}>
        <div id="top">
          <Hero />
          <ThreatGlobeSection />
          <OsnSection />
        </div>
      </BunkerLevelChamber>

      {/* TRANSITION 01: SUBTERRANEAN R&D VAULT DESCENT (Amber Cyber Airlock) */}
      <SubterraneanDescentGate
        gateTag="TRANSIT-01 // AMBER AIRLOCK"
        destinationLabel="Subterranean R&D Vault"
        fromDepth={-55}
        toDepth={-170}
        strataLayer="Industrial Concrete & Bedrock"
        sequenceFolder="cyber_amber"
      />

      {/* LEVEL 02 (-170m): SUBTERRANEAN R&D VAULT */}
      <BunkerLevelChamber level={2}>
        <div id="projects">
          <ProjectsSection />
          <SkillsMatrix />
          <OperatorDossier />
        </div>
      </BunkerLevelChamber>

      {/* TRANSITION 02: MAINFRAME SERVER SILO DESCENT (Violet Cyber Airlock) */}
      <SubterraneanDescentGate
        gateTag="TRANSIT-02 // VIOLET AIRLOCK"
        destinationLabel="Mainframe Server Silo"
        fromDepth={-170}
        toDepth={-420}
        strataLayer="Solid Basalt & Granite Chasm"
        sequenceFolder="cyber_violet"
      />

      {/* LEVEL 03 (-420m): MAINFRAME SERVER SILO & UPLINK */}
      <BunkerLevelChamber level={3}>
        <div id="terminal">
          <LabAndTerminalSection />
          <ContactUplink />
          <Footer />
        </div>
      </BunkerLevelChamber>

      {/* TRANSITION 03: DEEP SUBTERRANEAN MAINFRAME CORE (Crimson Cyber Airlock) */}
      <SubterraneanDescentGate
        gateTag="TRANSIT-03 // CRIMSON AIRLOCK"
        destinationLabel="Deep Subterranean Mainframe"
        fromDepth={-420}
        toDepth={-750}
        strataLayer="Deep Cable & Fiber Conduit"
        sequenceFolder="cyber_crimson"
      />
    </div>
  )
}

export default App
