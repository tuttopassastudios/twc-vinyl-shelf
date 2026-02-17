import Header from './components/UI/Header'
import LinerNotes from './components/UI/LinerNotes'
import RecordOverlay from './components/UI/RecordOverlay'
import HeroSection from './components/sections/HeroSection'
import ProjectsSection from './components/sections/ProjectsSection'
import AboutSection from './components/sections/AboutSection'
import ContactSection from './components/sections/ContactSection'
import useUiStore from './stores/uiStore'

export default function App() {
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)

  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Overlays — position:fixed, render above everything */}
      {selectedAlbumId && <RecordOverlay />}
      <LinerNotes />
    </>
  )
}
