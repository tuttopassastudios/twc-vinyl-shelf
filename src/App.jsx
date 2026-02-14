import ShelfScene from './components/Scene/ShelfScene'
import Header from './components/UI/Header'
import SearchModal from './components/UI/SearchModal'
import LinerNotes from './components/UI/LinerNotes'
import AboutOverlay from './components/UI/AboutOverlay'
import RecordOverlay from './components/UI/RecordOverlay'
import EmptyState from './components/UI/EmptyState'
import useCollectionStore from './stores/collectionStore'
import useUiStore from './stores/uiStore'

export default function App() {
  const albums = useCollectionStore((s) => s.albums)
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)

  return (
    <>
      <Header />

      {/* 3D Scene — main content area */}
      <main style={{ flex: 1, position: 'relative' }}>
        <ShelfScene />
        {albums.length === 0 && <EmptyState />}
      </main>

      {/* Overlays */}
      {selectedAlbumId && <RecordOverlay />}
      <LinerNotes />
      <SearchModal />
      <AboutOverlay />
    </>
  )
}
