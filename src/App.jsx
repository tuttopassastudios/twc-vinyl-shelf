import ShelfScene from './components/Scene/ShelfScene'
import Header from './components/UI/Header'
import LinerNotes from './components/UI/LinerNotes'
import AboutOverlay from './components/UI/AboutOverlay'
import RecordOverlay from './components/UI/RecordOverlay'
import useUiStore from './stores/uiStore'

export default function App() {
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)

  return (
    <>
      <Header />

      {/* 3D Scene — main content area */}
      <main style={{ position: 'absolute', inset: 0 }}>
        <ShelfScene />
      </main>

      {/* Overlays */}
      {selectedAlbumId && <RecordOverlay />}
      <LinerNotes />
      <AboutOverlay />
    </>
  )
}
