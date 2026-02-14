export const PALETTE = {
  bg: '#1a1410',
  bgWarm: '#2a1f16',
  surface: '#3a2e24',
  surfaceLight: '#4a3e34',
  wood: '#8B6914',
  woodDark: '#5c4a10',
  woodLight: '#a88030',
  cream: '#f5e6c8',
  creamDark: '#d4c4a0',
  amber: '#e8a84c',
  amberGlow: '#ffb74d',
  text: '#f5e6c8',
  textMuted: '#a89878',
  accent: '#c97b2a',
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
