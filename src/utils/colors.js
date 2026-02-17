export const PALETTE = {
  bg: '#0a0a0a',
  bgWarm: '#141210',
  surface: '#252320',
  surfaceLight: '#353230',
  wood: '#1a1a1a',
  woodDark: '#111111',
  woodLight: '#2a2825',
  cream: '#f0ede8',
  creamDark: '#d0cdc8',
  amber: '#7c9cff',
  amberGlow: '#94b0ff',
  text: '#f0ede8',
  textMuted: '#807c78',
  accent: '#5b8def',
  vinyl: '#1a1a1a',
  vinylGroove: '#2a2a2a',
  vinylLabel: '#b03325',
}

// Generate a dominant color from an album name (deterministic hash)
// Used as fallback when cover art color extraction hasn't completed
export function albumToColor(albumName) {
  const vinylColors = [
    '#a63325', '#2670a3', '#229155', '#7a3a96',
    '#b84800', '#148a73', '#263442', '#d48a10',
    '#c44235', '#2d84c0', '#17a088', '#8550a0',
    '#c46e1e', '#2e3f52', '#c43880', '#00a680',
    '#5e50c8', '#d56d90', '#00b5b0', '#d89888',
  ]
  let hash = 0
  for (let i = 0; i < albumName.length; i++) {
    hash = albumName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return vinylColors[Math.abs(hash) % vinylColors.length]
}
