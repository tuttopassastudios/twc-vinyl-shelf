export const PALETTE = {
  bg: '#121212',
  bgWarm: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceLight: '#3a3a3a',
  wood: '#6b6b6b',
  woodDark: '#4a4a4a',
  woodLight: '#8a8a8a',
  cream: '#f0f0f0',
  creamDark: '#d0d0d0',
  amber: '#7c9cff',
  amberGlow: '#94b0ff',
  text: '#f0f0f0',
  textMuted: '#888888',
  accent: '#5b8def',
  vinyl: '#1a1a1a',
  vinylGroove: '#2a2a2a',
  vinylLabel: '#c0392b',
}

// Generate a dominant color from an album name (deterministic hash)
export function albumToColor(albumName) {
  const vinylColors = [
    '#c0392b', '#2980b9', '#27ae60', '#8e44ad',
    '#d35400', '#16a085', '#2c3e50', '#f39c12',
    '#e74c3c', '#3498db', '#1abc9c', '#9b59b6',
    '#e67e22', '#34495e', '#e84393', '#00b894',
    '#6c5ce7', '#fd79a8', '#00cec9', '#fab1a0',
  ]
  let hash = 0
  for (let i = 0; i < albumName.length; i++) {
    hash = albumName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return vinylColors[Math.abs(hash) % vinylColors.length]
}
