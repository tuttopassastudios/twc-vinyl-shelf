import usePlayerStore from '../../stores/playerStore'
import { togglePlay, nextTrack, previousTrack, seek, setVolume } from '../../services/spotifyPlayer'
import styles from '../../styles/player.module.css'

function formatTime(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export default function PlayerControls() {
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const position = usePlayerStore((s) => s.position)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const progress = duration > 0 ? (position / duration) * 100 : 0

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(Math.round(pct * duration))
  }

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVolume(val)
  }

  return (
    <>
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={previousTrack} title="Previous">
          ⏮
        </button>
        <button
          className={`${styles.controlBtn} ${styles.playBtn}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className={styles.controlBtn} onClick={nextTrack} title="Next">
          ⏭
        </button>
      </div>

      <div className={styles.progressSection}>
        <span className={styles.time}>{formatTime(position)}</span>
        <div className={styles.progressBar} onClick={handleSeek}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>

      <div className={styles.volumeSection}>
        <button
          className={`${styles.controlBtn} ${styles.volumeBtn}`}
          onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
          title="Volume"
        >
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </button>
        <div className={styles.volumeBar} onClick={handleVolume}>
          <div className={styles.volumeFill} style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </>
  )
}
