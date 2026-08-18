import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { OsnSection } from './components/OsnSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ServicesSection } from './components/ServicesSection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Nav />
      <main>
        <Hero />
        <OsnSection />
        <ProjectsSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  )
}
