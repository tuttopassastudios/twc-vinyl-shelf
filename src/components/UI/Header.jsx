import useUiStore from '../../stores/uiStore'

export default function Header() {
  const openSearch = useUiStore((s) => s.openSearch)
  const toggleAbout = useUiStore((s) => s.toggleAbout)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'linear-gradient(180deg, rgba(26,20,16,0.95) 0%, rgba(26,20,16,0) 100%)',
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-cream)',
            letterSpacing: 2,
          }}
        >
          TWC
        </h1>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Vinyl Shelf
        </span>
      </div>

      <nav
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={openSearch}
          style={{
            padding: '6px 16px',
            border: '1px solid var(--color-surface-light)',
            borderRadius: 4,
            fontSize: 12,
            color: 'var(--color-cream)',
            background: 'var(--color-surface)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--color-amber)'
            e.target.style.color = 'var(--color-amber)'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--color-surface-light)'
            e.target.style.color = 'var(--color-cream)'
          }}
        >
          + Add Album
        </button>
        <button
          onClick={toggleAbout}
          style={{
            padding: '6px 12px',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--color-cream)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
        >
          About
        </button>
      </nav>
    </header>
  )
}
