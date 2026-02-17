import { useState, useEffect } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on resize to desktop
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false)
  }, [isMobile])

  const handleNavClick = () => setDrawerOpen(false)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: scrolled
            ? 'rgba(247,245,240,0.92)'
            : 'rgba(247,245,240,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid var(--color-surface-light)'
            : '1px solid transparent',
          zIndex: 200,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 500,
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

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  letterSpacing: 0.5,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--color-cream)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 5,
              width: 28,
              height: 28,
              padding: 0,
            }}
          >
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--color-cream)',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: drawerOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--color-cream)',
                transition: 'opacity 0.3s',
                opacity: drawerOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                background: 'var(--color-cream)',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: drawerOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        )}
      </header>

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <nav
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(247,245,240,0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 199,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            animation: 'drawerFadeIn 0.25s ease',
          }}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleNavClick}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 36,
                fontWeight: 500,
                color: 'var(--color-cream)',
                textDecoration: 'none',
                padding: '12px 24px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-amber)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-cream)')}
            >
              {label}
            </a>
          ))}

          <style>{`
            @keyframes drawerFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </nav>
      )}
    </>
  )
}
