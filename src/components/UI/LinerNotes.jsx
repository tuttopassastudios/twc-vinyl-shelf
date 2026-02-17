import useUiStore from '../../stores/uiStore'
import useRouterStore from '../../stores/routerStore'
import useCollectionStore from '../../stores/collectionStore'
import useMediaQuery from '../../hooks/useMediaQuery'
import PersonLink from './PersonLink'

function formatDuration(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function totalDuration(tracks) {
  const total = tracks.reduce((sum, t) => sum + t.duration_ms, 0)
  const min = Math.floor(total / 60000)
  return `${min} min`
}

export default function LinerNotes() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const showLinerNotes = useUiStore((s) => s.showLinerNotes)
  const setShowLinerNotes = useUiStore((s) => s.setShowLinerNotes)
  const albumId = useRouterStore((s) => s.albumId)
  const albums = useCollectionStore((s) => s.albums)

  const album = albums.find((a) => a.id === albumId)

  if (!showLinerNotes || !albumId || !album) return null

  const tracks = album.tracks || []
  const credits = album.credits || []

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: isMobile ? '100%' : 380,
        maxWidth: '100%',
        background: 'var(--color-bg-warm)',
        borderLeft: '1px solid var(--color-surface-light)',
        zIndex: 300,
        overflowY: 'auto',
        animation: 'slideIn 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setShowLinerNotes(false)}
        style={{
          position: 'sticky',
          top: 0,
          background: 'var(--color-bg-warm)',
          borderBottom: '1px solid var(--color-surface)',
          padding: '12px 20px',
          fontSize: 12,
          color: 'var(--color-text-muted)',
          textAlign: 'left',
          zIndex: 1,
        }}
      >
        &larr; Back to shelf
      </button>

      <div style={{ padding: '20px 24px 40px' }}>
        {/* Album header */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontStyle: 'italic',
              color: 'var(--color-cream)',
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            {album.name}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-amber)', marginBottom: 8 }}>
            {album.artist}
          </p>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', gap: 12 }}>
            <span>{album.release_date?.split('-')[0]}</span>
            {album.label && <span>{album.label}</span>}
            {tracks.length > 0 && <span>{totalDuration(tracks)}</span>}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--color-surface-light)',
            marginBottom: 20,
          }}
        />

        {/* Track listing */}
        {tracks.length > 0 ? (
          <div>
            {tracks.map((track) => (
              <div
                key={track.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 0',
                  gap: 12,
                  borderBottom: '1px solid rgba(180,170,155,0.3)',
                }}
              >
                <span
                  style={{
                    width: 24,
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {track.track_number}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: 'var(--color-cream)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {track.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    flexShrink: 0,
                  }}
                >
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            No track listing available.
          </p>
        )}

        {/* Credits section */}
        {credits.length > 0 && (
          <>
            <div
              style={{
                height: 1,
                background: 'var(--color-surface-light)',
                marginTop: 24,
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-muted)',
                marginBottom: 12,
              }}
            >
              Credits
            </h3>
            {credits.map((credit, i) => (
              <div
                key={i}
                style={{
                  padding: '4px 0',
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                <PersonLink name={credit.name} />
                {' — '}
                {credit.role}
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
