export const PALETTE = {
  bg: '#F7F5F0',
  bgWarm: '#EFECE5',
  surface: '#E8E4DC',
  surfaceLight: '#DDD8CE',
  wood: '#C4A882',
  woodDark: '#A8896A',
  woodLight: '#D4BFA0',
  cream: '#F7F5F0',
  creamDark: '#D6D1C7',
  amber: '#B87D56',
  amberGlow: '#C99068',
  text: '#2C2824',
  textMuted: '#8A847C',
  accent: '#7B8F6A',
  vinyl: '#1a1a1a',
  vinylGroove: '#2a2a2a',
  vinylLabel: '#B87D56',
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
