import usePlayerStore from '../../stores/playerStore'
import useAuthStore from '../../stores/authStore'
import PlayerControls from './PlayerControls'
import VinylSpinner from './VinylSpinner'
import styles from '../../styles/player.module.css'

export default function Player() {
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const playerReady = usePlayerStore((s) => s.playerReady)
  const isPremium = usePlayerStore((s) => s.isPremium)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Not authenticated — no player
  if (!isAuthenticated) return null

  // Premium check failed
  if (isPremium === false) {
    return (
      <div className={styles.noPlayer}>
        Spotify Premium is required for in-browser playback.{' '}
        <a href="https://open.spotify.com" target="_blank" rel="noreferrer">
          Open Spotify
        </a>
      </div>
    )
  }

  // No track playing yet
  if (!currentTrack) {
    return (
      <div
        className={`${styles.player} ${styles.playerVisible}`}
        style={{ justifyContent: 'center', opacity: 0.5 }}
      >
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {playerReady ? 'Select an album and hit play' : 'Connecting to Spotify...'}
        </span>
      </div>
    )
  }

  return (
    <div className={`${styles.player} ${styles.playerVisible}`}>
      {/* Album art + vinyl spinner */}
      <div className={styles.vinylContainer}>
        <VinylSpinner size={56} albumImage={currentTrack.albumImage} />
      </div>

      {/* Track info */}
      <div className={styles.trackInfo}>
        <div className={styles.trackName}>{currentTrack.name}</div>
        <div className={styles.trackArtist}>{currentTrack.artist}</div>
      </div>

      {/* Controls, progress, volume */}
      <PlayerControls />
    </div>
  )
}
