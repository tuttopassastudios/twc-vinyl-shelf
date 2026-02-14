import { useState, useMemo } from 'react'
import useUiStore from '../../stores/uiStore'
import useCollectionStore from '../../stores/collectionStore'
import { searchDemoCatalog } from '../../utils/demoCatalog'
import { albumToColor } from '../../utils/colors'

export default function SearchModal() {
  const showSearchModal = useUiStore((s) => s.showSearchModal)
  const closeSearch = useUiStore((s) => s.closeSearch)
  const addAlbum = useCollectionStore((s) => s.addAlbum)
  const albums = useCollectionStore((s) => s.albums)
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchDemoCatalog(query), [query])

  if (!showSearchModal) return null

  const handleAdd = (album) => {
    addAlbum(album)
  }

  const isInCollection = (id) => albums.some((a) => a.id === id)

  return (
    <div
      onClick={closeSearch}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 80,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-warm)',
          border: '1px solid var(--color-surface-light)',
          borderRadius: 12,
          padding: 24,
          width: '90%',
          maxWidth: 640,
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: 'var(--color-cream)',
            }}
          >
            Add Albums
          </h2>
          <button
            onClick={closeSearch}
            style={{ fontSize: 18, color: 'var(--color-text-muted)' }}
          >
            x
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by album, artist, or label..."
          autoFocus
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: 14,
            marginBottom: 16,
            borderRadius: 6,
          }}
        />

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {results.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              {results.map((album) => {
                const added = isInCollection(album.id)
                const color = albumToColor(album.name)
                return (
                  <button
                    key={album.id}
                    onClick={() => !added && handleAdd(album)}
                    style={{
                      background: 'var(--color-surface)',
                      border: added ? '2px solid var(--color-amber)' : '2px solid transparent',
                      borderRadius: 6,
                      padding: 0,
                      overflow: 'hidden',
                      cursor: added ? 'default' : 'pointer',
                      opacity: added ? 0.6 : 1,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                  >
                    {/* Color swatch as album art placeholder */}
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: `linear-gradient(135deg, ${color} 0%, ${color}88 50%, var(--color-surface) 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 13,
                          fontStyle: 'italic',
                          color: '#fff',
                          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          wordBreak: 'break-word',
                        }}
                      >
                        {album.name}
                      </span>
                    </div>
                    <div style={{ padding: '8px 8px 10px' }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--color-cream)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {album.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: 'var(--color-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {album.artist}
                      </div>
                      {added && (
                        <div style={{ fontSize: 9, color: 'var(--color-amber)', marginTop: 2 }}>
                          In collection
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 40, fontSize: 13 }}>
              No albums match your search
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
