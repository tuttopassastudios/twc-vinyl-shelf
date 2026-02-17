import useUiStore from '../../stores/uiStore'

export default function AboutOverlay() {
  const showAbout = useUiStore((s) => s.showAbout)
  const setAbout = useUiStore((s) => s.setAbout)

  if (!showAbout) return null

  return (
    <div
      onClick={() => setAbout(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(247,245,240,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-warm)',
          border: '1px solid var(--color-surface-light)',
          borderRadius: 12,
          padding: '40px 48px',
          maxWidth: 520,
          width: '90%',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setAbout(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontSize: 18,
            color: 'var(--color-text-muted)',
          }}
        >
          x
        </button>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            marginBottom: 16,
            color: 'var(--color-cream)',
          }}
        >
          About TWC
        </h2>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: 'var(--color-cream-dark)',
            marginBottom: 16,
          }}
        >
          This is my vinyl shelf — a curated collection of the albums that shaped my ear,
          influenced my mixes, and defined my relationship with music. Every record here
          tells a story.
        </p>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: 'var(--color-cream-dark)',
            marginBottom: 16,
          }}
        >
          Browse the shelf, pull out a record, read the liner notes, and hit play.
          This is music the way it&apos;s meant to be experienced — intentionally.
        </p>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          Built with React, Three.js, and the Spotify API.
        </p>
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
