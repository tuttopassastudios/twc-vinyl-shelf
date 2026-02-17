// People index — derived from catalog credits at import time
import CATALOG from './catalog'
import { coverPath } from './assetPath'

export function personSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Build the index once
const peopleMap = new Map()

CATALOG.forEach((album) => {
  const credits = album.credits || []
  credits.forEach((credit) => {
    const slug = personSlug(credit.name)
    if (!peopleMap.has(slug)) {
      peopleMap.set(slug, {
        slug,
        name: credit.name,
        appearances: [],
      })
    }
    peopleMap.get(slug).appearances.push({
      albumId: album.id,
      albumName: album.name,
      artist: album.artist,
      coverFilename: album.images?.[0]?.url ?? null,
      role: credit.role,
      releaseDate: album.release_date,
    })
  })
})

// Sort each person's appearances by release date (newest first)
peopleMap.forEach((person) => {
  person.appearances.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))
})

export function getPersonBySlug(slug) {
  return peopleMap.get(slug) || null
}

export function getAllPeople() {
  return Array.from(peopleMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}
