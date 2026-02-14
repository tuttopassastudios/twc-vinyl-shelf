import useUiStore from '../../stores/uiStore'

export default function EmptyState() {
  const openSearch = useUiStore((s) => s.openSearch)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 50,
        animation: 'fadeIn 1s ease 0.5s both',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontStyle: 'italic',
          color: 'var(--color-cream-dark)',
          marginBottom: 12,
          opacity: 0.8,
        }}
      >
        Your shelf is empty
      </p>
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-muted)',
          marginBottom: 16,
          maxWidth: 300,
        }}
      >
        Browse the catalog to add albums to your collection.
      </p>
      <button
        onClick={openSearch}
        style={{
          padding: '10px 24px',
          background: 'var(--color-amber)',
          color: 'var(--color-bg)',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 700,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        + Add Your First Album
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
