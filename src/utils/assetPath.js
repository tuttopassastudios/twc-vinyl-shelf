// Resolve asset paths using Vite's BASE_URL so they work on GitHub Pages
const base = import.meta.env.BASE_URL ?? '/'

export function coverPath(filename) {
  return `${base}covers/${filename}`
}

export function texturePath(filename) {
  return `${base}textures/${filename}`
}

export function fontPath(filename) {
  return `${base}fonts/${filename}`
}
