import useUiStore from '../../stores/uiStore'
import useCollectionStore from '../../stores/collectionStore'

export default function RecordOverlay() {
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const deselectRecord = useUiStore((s) => s.deselectRecord)
  const toggleLinerNotes = useUiStore((s) => s.toggleLinerNotes)
  const showLinerNotes = useUiStore((s) => s.showLinerNotes)
  const albums = useCollectionStore((s) => s.albums)

  const album = albums.find((a) => a.id === selectedAlbumId)
  if (!album) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        zIndex: 250,
        animation: 'fadeUp 0.4s ease 0.6s both',
      }}
    >
      <button
        onClick={toggleLinerNotes}
        style={{
          padding: '8px 20px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-light)',
          color: 'var(--color-cream)',
          borderRadius: 20,
          fontSize: 12,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--color-amber)'
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--color-surface-light)'
        }}
      >
        {showLinerNotes ? 'Hide Notes' : 'Liner Notes'}
      </button>

      <button
        onClick={deselectRecord}
        style={{
          padding: '8px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-light)',
          color: 'var(--color-text-muted)',
          borderRadius: 20,
          fontSize: 12,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--color-cream)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
      >
        Back
      </button>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
