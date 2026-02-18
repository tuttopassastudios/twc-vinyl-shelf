import Header from './components/UI/Header'
import LinerNotes from './components/UI/LinerNotes'
import RecordOverlay from './components/UI/RecordOverlay'
import PersonPage from './components/UI/PersonPage'
import StickerPeel from './components/UI/StickerPeel'
import CameraControls from './components/UI/CameraControls'
import HeroSection from './components/sections/HeroSection'
import ProjectsSection from './components/sections/ProjectsSection'
import AboutSection from './components/sections/AboutSection'
import ContactSection from './components/sections/ContactSection'
import useRouterStore from './stores/routerStore'
import stickerImg from './assets/sticker.png'

export default function App() {
  const view = useRouterStore((s) => s.view)
  const albumId = useRouterStore((s) => s.albumId)

  return (
    <>
      <Header />

      {view === 'person' ? (
        <main>
          <PersonPage />
        </main>
      ) : (
        <>
          <main>
            <HeroSection />
            <ProjectsSection />
            {view === 'shelf' && (
              <>
                <AboutSection />
                <ContactSection />
              </>
            )}
          </main>

          {/* Overlays — position:fixed, render above everything */}
          {albumId && <RecordOverlay />}
          <LinerNotes />
        </>
      )}

      <CameraControls />
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
