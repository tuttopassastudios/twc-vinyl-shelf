#!/usr/bin/env node
// Build-time script: fetches album/single data from iTunes Search API
// and updates src/utils/catalog.js
// Usage: node scripts/fetch-tidal.js "Artist" "Album"

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CATALOG_PATH = join(ROOT, 'src/utils/catalog.js')
const COVERS_DIR = join(ROOT, 'public/covers')

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function die(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

// ── iTunes Search API ───────────────────────────────────────────────────────

async function searchiTunes(artist, album) {
  // First try searching for the album/single as an entity
  const query = encodeURIComponent(`${artist} ${album}`)
  const url = `https://itunes.apple.com/search?term=${query}&entity=album&limit=15`
  const res = await fetch(url)
  if (!res.ok) die(`iTunes search failed (${res.status})`)
  const data = await res.json()

  const results = data.results || []
  if (!results.length) {
    // Fall back to song search
    console.log('  No album results, trying song search…')
    return searchiTunesSong(artist, album)
  }

  console.log(`  Search returned ${results.length} result(s)`)

  const normAlbum = album.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '')

  const scored = results.map((r) => {
    const title = (r.collectionName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const rArtist = (r.artistName || '').toLowerCase().replace(/[^a-z0-9]/g, '')

    let score = 0
    if (title === normAlbum) score += 100
    else if (title.includes(normAlbum)) score += 60
    else if (normAlbum.includes(title)) score += 40

    if (rArtist === normArtist) score += 80
    else if (rArtist.includes(normArtist) || normArtist.includes(rArtist)) score += 50

    return { result: r, score, title: r.collectionName, artist: r.artistName }
  })

  scored.sort((a, b) => b.score - a.score)

  for (const s of scored.slice(0, 3)) {
    console.log(`    candidate: "${s.title}" by ${s.artist} (score: ${s.score})`)
  }

  const best = scored[0]
  if (best.score < 50) {
    // Fall back to song search
    console.log('  No good album match, trying song search…')
    return searchiTunesSong(artist, album)
  }

  console.log(`  Found: "${best.title}" by ${best.artist}`)
  return { type: 'album', data: best.result }
}

async function searchiTunesSong(artist, album) {
  const query = encodeURIComponent(`${artist} ${album}`)
  const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=15`
  const res = await fetch(url)
  if (!res.ok) die(`iTunes song search failed (${res.status})`)
  const data = await res.json()

  const results = data.results || []
  if (!results.length) die(`No results found for "${artist} - ${album}"`)

  const normAlbum = album.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '')

  const scored = results.map((r) => {
    const title = (r.trackName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const rArtist = (r.artistName || '').toLowerCase().replace(/[^a-z0-9]/g, '')

    let score = 0
    if (title === normAlbum) score += 100
    else if (title.includes(normAlbum)) score += 60
    else if (normAlbum.includes(title)) score += 40

    if (rArtist === normArtist) score += 80
    else if (rArtist.includes(normArtist) || normArtist.includes(rArtist)) score += 50

    return { result: r, score, title: r.trackName, artist: r.artistName }
  })

  scored.sort((a, b) => b.score - a.score)

  for (const s of scored.slice(0, 3)) {
    console.log(`    candidate: "${s.title}" by ${s.artist} (score: ${s.score})`)
  }

  const best = scored[0]
  if (best.score < 80) {
    die(`No good match for "${artist} - ${album}". Best: "${best.title}" by ${best.artist} (score: ${best.score})`)
  }

  console.log(`  Found: "${best.title}" by ${best.artist}`)
  return { type: 'song', data: best.result }
}

// ── fetch album tracks from iTunes ──────────────────────────────────────────

async function fetchAlbumTracks(collectionId) {
  const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`
  const res = await fetch(url)
  if (!res.ok) die(`iTunes lookup failed (${res.status})`)
  const data = await res.json()

  // First result is the collection, rest are tracks
  const results = data.results || []
  const tracks = results
    .filter((r) => r.wrapperType === 'track')
    .map((t) => ({
      id: `t-${t.trackNumber}`,
      track_number: t.trackNumber,
      name: t.trackName,
      duration_ms: t.trackTimeMillis || 0,
      artists: t.artistName,
    }))
    .sort((a, b) => a.track_number - b.track_number)

  return tracks
}

// ── build entry from iTunes data ────────────────────────────────────────────

async function buildEntry(searchResult, artist, album) {
  const { type, data } = searchResult

  let tracks
  if (type === 'album') {
    tracks = await fetchAlbumTracks(data.collectionId)
  } else {
    // Single song result
    tracks = [
      {
        id: 't-1',
        track_number: 1,
        name: data.trackName,
        duration_ms: data.trackTimeMillis || 0,
        artists: data.artistName,
      },
    ]
  }

  const releaseDate = (type === 'album' ? data.releaseDate : data.releaseDate) || null
  const formattedDate = releaseDate ? releaseDate.split('T')[0] : null

  // Get high-res artwork URL (replace 100x100 with 600x600)
  const artworkUrl = (data.artworkUrl100 || '').replace('100x100', '600x600')

  return {
    title: type === 'album' ? data.collectionName : data.trackName,
    artist: data.artistName,
    releaseDate: formattedDate,
    label: data.copyright || '',
    artworkUrl,
    tracks,
  }
}

// ── download cover art ───────────────────────────────────────────────────────

async function downloadCover(imageUrl, slug) {
  if (!imageUrl) {
    console.log('  ⚠ No cover image URL, skipping')
    return `/twc-vinyl-shelf/covers/${slug}.jpg`
  }

  mkdirSync(COVERS_DIR, { recursive: true })
  const filename = `${slug}.jpg`
  const dest = join(COVERS_DIR, filename)

  console.log(`  Downloading cover…`)
  const res = await fetch(imageUrl)
  if (!res.ok) {
    console.log(`  ⚠ Failed to download cover (${res.status})`)
    return `/twc-vinyl-shelf/covers/${filename}`
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buffer)
  console.log(`  ✓ Saved cover (${(buffer.length / 1024).toFixed(0)} KB)`)
  return `/twc-vinyl-shelf/covers/${filename}`
}

// ── update catalog.js ────────────────────────────────────────────────────────

function updateCatalog(entry) {
  if (existsSync(CATALOG_PATH)) {
    const src = readFileSync(CATALOG_PATH, 'utf8')

    // Try to preserve credits from existing entry with matching id
    const idMatch = src.match(
      new RegExp(
        `id:\\s*['"]${entry.id}['"][\\s\\S]*?credits:\\s*(\\[[\\s\\S]*?\\])\\s*,?\\s*\\}`,
      ),
    )
    if (idMatch) {
      entry._preservedCreditsStr = idMatch[1]
    }

    // Check for other albums we're not updating
    const existingIds = [...src.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(
      (m) => m[1],
    )
    if (existingIds.length && !existingIds.every((id) => id === entry.id)) {
      entry._otherAlbumsSource = src
    }
  }

  writeCatalog(entry)
}

function formatTrack(t) {
  const parts = [
    `      id: '${t.id}'`,
    `      track_number: ${t.track_number}`,
    `      name: ${JSON.stringify(t.name)}`,
    `      duration_ms: ${t.duration_ms}`,
  ]
  if (t.artists) {
    parts.push(`      artists: ${JSON.stringify(t.artists)}`)
  }
  return `    {\n${parts.join(',\n')},\n    }`
}

function writeCatalog(entry) {
  const tracksStr = entry.tracks.map(formatTrack).join(',\n')
  const creditsStr = entry._preservedCreditsStr || '[]'

  const albumBlock = `  {
    id: '${entry.id}',
    name: ${JSON.stringify(entry.name)},
    artist: ${JSON.stringify(entry.artist)},
    release_date: ${JSON.stringify(entry.release_date)},
    label: ${JSON.stringify(entry.label)},
    images: [{ url: '${entry.images[0].url}' }],
    tracks: [
${tracksStr},
    ],
    credits: ${creditsStr},
  }`

  let otherBlocks = ''
  if (entry._otherAlbumsSource) {
    console.log(
      '  ⚠ Other albums exist in catalog — they will be preserved as-is',
    )
    const match = entry._otherAlbumsSource.match(
      /const CATALOG = \[\s*([\s\S]*)\s*\]\s*$/m,
    )
    if (match) {
      const existing = match[1]
      const blocks = []
      let depth = 0
      let start = -1
      for (let i = 0; i < existing.length; i++) {
        if (existing[i] === '{') {
          if (depth === 0) start = i
          depth++
        } else if (existing[i] === '}') {
          depth--
          if (depth === 0 && start >= 0) {
            const block = existing.slice(start, i + 1)
            if (!block.includes(`id: '${entry.id}'`)) {
              blocks.push(block)
            }
            start = -1
          }
        }
      }
      if (blocks.length) {
        otherBlocks = '\n' + blocks.join(',\n') + ','
      }
    }
  }

  const src = `// TWC album catalog — single source of truth
// To add an album, run: npm run add-album "Artist" "Album"
const CATALOG = [
${albumBlock},${otherBlocks}
]

export default CATALOG
`
  writeFileSync(CATALOG_PATH, src)
  console.log(`  ✓ Updated ${CATALOG_PATH}`)
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const [artist, album] = process.argv.slice(2)
  if (!artist || !album) {
    die('Usage: node scripts/fetch-tidal.js "Artist" "Album"')
  }

  console.log(`\nFetching "${album}" by ${artist} from iTunes…\n`)

  // 1. Search
  console.log('  Searching…')
  const result = await searchiTunes(artist, album)

  // 2. Build entry
  console.log('  Fetching details…')
  const data = await buildEntry(result, artist, album)
  console.log(`  ✓ ${data.title} — ${data.tracks.length} track(s)`)

  // 3. Download cover
  const slug = slugify(album)
  const coverPath = await downloadCover(data.artworkUrl, slug)

  // 4. Build catalog entry
  const entry = {
    id: `${slugify(artist)}-${slug}`,
    name: data.title,
    artist: data.artist,
    release_date: data.releaseDate,
    label: data.label,
    images: [{ url: coverPath }],
    tracks: data.tracks,
  }

  // 5. Update catalog
  console.log('  Writing catalog…')
  updateCatalog(entry)

  console.log('\n✓ Done!\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
