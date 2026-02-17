import Header from './components/UI/Header'
import LinerNotes from './components/UI/LinerNotes'
import RecordOverlay from './components/UI/RecordOverlay'
import StickerPeel from './components/UI/StickerPeel'
import HeroSection from './components/sections/HeroSection'
import ProjectsSection from './components/sections/ProjectsSection'
import AboutSection from './components/sections/AboutSection'
import ContactSection from './components/sections/ContactSection'
import useUiStore from './stores/uiStore'
import stickerImg from './assets/sticker.png'

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

      <div className="sticker-wrapper">
        <StickerPeel
          imageSrc={stickerImg}
          width={200}
          rotate={0}
          peelBackHoverPct={30}
          peelBackActivePct={40}
          shadowIntensity={0.5}
          lightingIntensity={0.1}
          initialPosition={{ x: -100, y: 100 }}
          peelDirection={0}
        />
      </div>
    </>
  )
}
