const links = [
  { label: 'Email', href: 'mailto:hello@tylerwchase.com', text: 'hello@tylerwchase.com' },
  { label: 'Instagram', href: 'https://instagram.com/', text: '@tylerwchase' },
  { label: 'GitHub', href: 'https://github.com/', text: 'github.com/tylerwchase' },
]

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        background: 'var(--color-bg)',
        padding: 'clamp(60px, 10vw, 120px) 24px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'var(--color-cream)',
            marginBottom: 48,
          }}
        >
          Let&apos;s talk music.
        </h2>

        <div>
          {links.map(({ label, href, text }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: '1px solid var(--color-surface-light)',
                textDecoration: 'none',
                color: 'var(--color-cream-dark)',
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-amber)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cream-dark)')}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                {label}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {text} <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
          ))}
        </div>

        <p
          style={{
            marginTop: 60,
            fontSize: 11,
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          &copy; {new Date().getFullYear()} Tyler W. Chase
        </p>
      </div>
    </section>
  )
}
