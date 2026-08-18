import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { OsnSection } from './components/OsnSection'
import { ThreatGlobeSection } from './components/ThreatGlobeSection'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsMatrix } from './components/SkillsMatrix'
import { LabAndTerminalSection } from './components/LabAndTerminalSection'
import { ContactUplink } from './components/ContactUplink'
import { ServicesSection } from './components/ServicesSection'
import { Footer } from './components/Footer'
import { TacticalHUD } from './components/TacticalHUD'
import { CustomCursor } from './components/CustomCursor'
import { InteractiveDotGrid } from './components/InteractiveDotGrid'
import { BootSequence } from './components/BootSequence'

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg text-text selection:bg-green selection:text-[#05080e]">
      {/* Cinematic Boot Sequence on First Load */}
      <BootSequence />

      {/* Mouse Reactive Dot Grid Matrix Canvas */}
      <InteractiveDotGrid />

      {/* Floating Tactical HUD Layer */}
      <TacticalHUD />

      {/* Reticle Cursor for Non-Touch Screens */}
      <CustomCursor />

      {/* Navigation Bar */}
      <Nav />

      {/* Main Experience Stream */}
      <main className="relative z-10">
        <Hero />
        <OsnSection />
        <ThreatGlobeSection />
        <ProjectsSection />
        <SkillsMatrix />
        <LabAndTerminalSection />
        <ContactUplink />
        <ServicesSection />
      </main>

      {/* Dispatch Footer */}
      <Footer />
    </div>
  )
}
