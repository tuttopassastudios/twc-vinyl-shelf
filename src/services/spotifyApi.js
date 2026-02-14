const BASE = 'https://api.spotify.com/v1'

async function apiFetch(endpoint, token, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Spotify API error: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function searchAlbums(query, token, limit = 20) {
  const params = new URLSearchParams({ q: query, type: 'album', limit: String(limit) })
  const data = await apiFetch(`/search?${params}`, token)
  return data.albums.items.map((album) => ({
    id: album.id,
    name: album.name,
    artist: album.artists.map((a) => a.name).join(', '),
    images: album.images,
    release_date: album.release_date,
    total_tracks: album.total_tracks,
    uri: album.uri,
  }))
}

export async function getAlbumDetails(albumId, token) {
  const data = await apiFetch(`/albums/${albumId}`, token)
  return {
    id: data.id,
    name: data.name,
    artist: data.artists.map((a) => a.name).join(', '),
    images: data.images,
    release_date: data.release_date,
    total_tracks: data.total_tracks,
    label: data.label,
    copyrights: data.copyrights,
    uri: data.uri,
    tracks: data.tracks.items.map((t) => ({
      id: t.id,
      name: t.name,
      track_number: t.track_number,
      duration_ms: t.duration_ms,
      uri: t.uri,
      artists: t.artists.map((a) => a.name).join(', '),
    })),
  }
}

export async function getCurrentUser(token) {
  return apiFetch('/me', token)
}

export async function playAlbum(albumUri, token, deviceId) {
  await apiFetch('/me/player/play' + (deviceId ? `?device_id=${deviceId}` : ''), token, {
    method: 'PUT',
    body: JSON.stringify({ context_uri: albumUri }),
  })
}

export async function playTrack(trackUri, albumUri, token, deviceId) {
  await apiFetch('/me/player/play' + (deviceId ? `?device_id=${deviceId}` : ''), token, {
    method: 'PUT',
    body: JSON.stringify({ context_uri: albumUri, offset: { uri: trackUri } }),
  })
}
