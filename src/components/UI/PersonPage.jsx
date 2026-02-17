import useRouterStore from '../../stores/routerStore'
import { getPersonBySlug } from '../../utils/people'
import { coverPath } from '../../utils/assetPath'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function PersonPage() {
  const personSlug = useRouterStore((s) => s.personSlug)
  const navigate = useRouterStore((s) => s.navigate)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const person = getPersonBySlug(personSlug)

  if (!person) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p>Person not found.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 16,
            padding: '8px 20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-light)',
            color: 'var(--color-cream)',
            borderRadius: 20,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Back to Shelf
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: isMobile ? '24px 16px 60px' : '40px 24px 60px',
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '6px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-light)',
          color: 'var(--color-text-muted)',
          borderRadius: 20,
          fontSize: 12,
          cursor: 'pointer',
          marginBottom: 24,
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--color-cream)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
      >
        &larr; Back to Shelf
      </button>

      {/* Person name */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 28 : 36,
          fontWeight: 500,
          color: 'var(--color-cream)',
          marginBottom: 8,
        }}
      >
        {person.name}
      </h1>

      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 32 }}>
        {person.appearances.length} credit{person.appearances.length !== 1 ? 's' : ''}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-surface-light)', marginBottom: 24 }} />

      {/* Album appearances */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {person.appearances.map((app, i) => {
          const coverUrl = app.coverFilename ? coverPath(app.coverFilename) : null
          return (
            <button
              key={`${app.albumId}-${i}`}
              onClick={() => navigate('/album/' + app.albumId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 12,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-light)',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.2s',
                width: '100%',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-amber)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-surface-light)')}
            >
              {/* Cover thumbnail */}
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={app.albumName}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 4,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 4,
                    background: 'var(--color-surface-light)',
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    fontStyle: 'italic',
                    color: 'var(--color-cream)',
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {app.albumName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-amber)', marginBottom: 2 }}>
                  {app.artist}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {app.role}
                  {app.releaseDate && ` · ${app.releaseDate.split('-')[0]}`}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
