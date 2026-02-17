export default function HeroSection() {
  return (
    <section
      id="hero"
      className="section-fullscreen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'var(--color-bg)',
        position: 'relative',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 24,
        }}
      >
        Tyler W. Chase
      </span>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 500,
          lineHeight: 1.05,
          color: 'var(--color-cream)',
          maxWidth: 800,
          marginBottom: 24,
        }}
      >
        The Vinyl Shelf
      </h2>

      <p
        style={{
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          maxWidth: 480,
          marginBottom: 40,
        }}
      >
        A curated collection of the albums that shaped my ear,
        influenced my mixes, and defined my relationship with music.
      </p>

      <a
        href="#projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 28px',
          border: '1px solid var(--color-surface-light)',
          borderRadius: 999,
          fontSize: 13,
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-cream)',
          textDecoration: 'none',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-amber)'
          e.currentTarget.style.background = 'rgba(184,125,86,0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-surface-light)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        Explore the shelf <span aria-hidden="true">&rarr;</span>
      </a>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-text-muted)',
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          opacity: 0.5,
        }}
      >
        <span>Scroll</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>
    </section>
  )
}
