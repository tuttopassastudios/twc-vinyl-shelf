import useSpotifyAuth from '../../hooks/useSpotifyAuth'
import useAuthStore from '../../stores/authStore'

export default function SpotifyLogin() {
  const { isAuthenticated, login, logout } = useSpotifyAuth()
  const user = useAuthStore((s) => s.user)

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user && (
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            {user.display_name}
          </span>
        )}
        <button
          onClick={logout}
          style={{
            padding: '6px 12px',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-surface-light)',
            borderRadius: 4,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#e74c3c'
            e.target.style.color = '#e74c3c'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--color-surface-light)'
            e.target.style.color = 'var(--color-text-muted)'
          }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      style={{
        padding: '6px 16px',
        fontSize: 12,
        color: '#1DB954',
        border: '1px solid #1DB954',
        borderRadius: 20,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#1DB954'
        e.target.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent'
        e.target.style.color = '#1DB954'
      }}
    >
      Login with Spotify
    </button>
  )
}
