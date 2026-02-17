export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: 'var(--color-bg-warm)',
        padding: 'clamp(60px, 10vw, 120px) 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 500,
            color: 'var(--color-cream)',
            marginBottom: 32,
          }}
        >
          About TWC
        </h2>

        <p
          style={{
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            lineHeight: 1.8,
            color: 'var(--color-cream-dark)',
            marginBottom: 20,
          }}
        >
          This is my vinyl shelf — a curated collection of the albums that shaped my ear,
          influenced my mixes, and defined my relationship with music. Every record here
          tells a story.
        </p>

        <p
          style={{
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            lineHeight: 1.8,
            color: 'var(--color-cream-dark)',
            marginBottom: 32,
          }}
        >
          Browse the shelf, pull out a record, read the liner notes, and hit play.
          This is music the way it&apos;s meant to be experienced — intentionally.
        </p>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          Built with React and Three.js.
        </p>
      </div>
    </section>
  )
}
