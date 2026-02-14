import usePlayerStore from '../stores/playerStore'
import useAuthStore from '../stores/authStore'

let player = null
let progressInterval = null

function loadSpotifySDK() {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve(window.Spotify)
      return
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify)
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    document.body.appendChild(script)
  })
}

export async function initPlayer() {
  const SDK = await loadSpotifySDK()
  const store = usePlayerStore.getState()
  const authStore = useAuthStore.getState()

  if (player) {
    player.disconnect()
  }

  player = new SDK.Player({
    name: 'TWC Vinyl Shelf',
    getOAuthToken: (cb) => {
      cb(useAuthStore.getState().accessToken)
    },
    volume: store.volume,
  })

  player.addListener('ready', ({ device_id }) => {
    usePlayerStore.getState().setDeviceId(device_id)
    usePlayerStore.getState().setPlayerReady(true)
  })

  player.addListener('not_ready', () => {
    usePlayerStore.getState().setPlayerReady(false)
  })

  player.addListener('player_state_changed', (state) => {
    if (!state) return
    const { setPlaying, setCurrentTrack, setPosition, setDuration } = usePlayerStore.getState()
    setPlaying(!state.paused)
    setPosition(state.position)
    setDuration(state.duration)

    const track = state.track_window.current_track
    if (track) {
      setCurrentTrack(
        {
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          albumName: track.album.name,
          albumImage: track.album.images[0]?.url,
          uri: track.uri,
        },
        track.album.uri?.split(':').pop() || null
      )
    }

    // Update progress
    clearInterval(progressInterval)
    if (!state.paused) {
      progressInterval = setInterval(() => {
        const ps = usePlayerStore.getState()
        if (ps.isPlaying) {
          ps.setPosition(ps.position + 1000)
        }
      }, 1000)
    }
  })

  player.addListener('initialization_error', ({ message }) => {
    console.error('Spotify init error:', message)
  })

  player.addListener('authentication_error', ({ message }) => {
    console.error('Spotify auth error:', message)
  })

  player.addListener('account_error', ({ message }) => {
    console.error('Spotify account error (Premium required):', message)
    usePlayerStore.getState().setIsPremium(false)
  })

  const success = await player.connect()
  if (success) {
    usePlayerStore.getState().setIsPremium(true)
  }
  return success
}

export function getPlayer() {
  return player
}

export async function togglePlay() {
  if (player) await player.togglePlay()
}

export async function nextTrack() {
  if (player) await player.nextTrack()
}

export async function previousTrack() {
  if (player) await player.previousTrack()
}

export async function seek(positionMs) {
  if (player) await player.seek(positionMs)
}

export async function setVolume(value) {
  if (player) await player.setVolume(value)
  usePlayerStore.getState().setVolume(value)
}

export function disconnectPlayer() {
  clearInterval(progressInterval)
  if (player) {
    player.disconnect()
    player = null
  }
  usePlayerStore.getState().reset()
}
