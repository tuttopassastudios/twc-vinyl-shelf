#!/usr/bin/env node
// Build-time script: fetches album data from TIDAL and updates src/utils/catalog.js
// Usage: node scripts/fetch-tidal.js "Artist" "Album"

import 'dotenv/config'
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CATALOG_PATH = join(ROOT, 'src/utils/catalog.js')
const COVERS_DIR = join(ROOT, 'public/covers')

const TIDAL_AUTH_URL = 'https://auth.tidal.com/v1/oauth2/token'
const TIDAL_API = 'https://openapi.tidal.com/v2'
const COUNTRY = 'US'

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function die(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

/** Parse ISO 8601 duration (e.g. "PT3M10S") to milliseconds */
function isoDurationToMs(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  const hours = parseInt(m[1] || '0', 10)
  const mins = parseInt(m[2] || '0', 10)
  const secs = parseInt(m[3] || '0', 10)
  return (hours * 3600 + mins * 60 + secs) * 1000
}

// ── TIDAL auth ───────────────────────────────────────────────────────────────

async function getAccessToken() {
  const { TIDAL_CLIENT_ID, TIDAL_CLIENT_SECRET } = process.env
  if (!TIDAL_CLIENT_ID || !TIDAL_CLIENT_SECRET) {
    die('Missing TIDAL_CLIENT_ID or TIDAL_CLIENT_SECRET in .env')
  }

  const basic = Buffer.from(`${TIDAL_CLIENT_ID}:${TIDAL_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(TIDAL_AUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    die(`Auth failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  if (!data.access_token) {
    die(`Auth response missing access_token: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

// ── TIDAL API helpers ────────────────────────────────────────────────────────

function tidalHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/vnd.api+json',
  }
}

async function tidalGet(token, path) {
  const url = `${TIDAL_API}${path}`
  const res = await fetch(url, { headers: tidalHeaders(token) })
  if (!res.ok) {
    const text = await res.text()
    die(`TIDAL API error (${res.status}) for ${path}: ${text}`)
  }
  return res.json()
}

// ── search for album ─────────────────────────────────────────────────────────

async function searchAlbum(token, artist, album) {
  const query = encodeURIComponent(`${artist} ${album}`)
  // TIDAL v2 uses camelCase: /searchResults/{query}
  const data = await tidalGet(
    token,
    `/searchResults/${query}?countryCode=${COUNTRY}&include=topHits`,
  )

  // topHits includes mixed types — filter for albums
  const topHits = data.data?.relationships?.topHits?.data || []
  const albumHits = topHits.filter((h) => h.type === 'albums')
  const includedAlbums = (data.included || []).filter((r) => r.type === 'albums')

  if (!albumHits.length) die(`No albums found for "${artist} ${album}"`)

  // Try to find an exact title match (case-insensitive)
  const match =
    includedAlbums.find(
      (a) => a.attributes?.title?.toLowerCase() === album.toLowerCase(),
    ) || includedAlbums.find((a) => albumHits.some((h) => h.id === a.id)) || includedAlbums[0]

  if (!match) {
    // Fallback: use first album hit ID even without included data
    const albumId = albumHits[0].id
    console.log(`  Found album id: ${albumId} (no included metadata)`)
    return albumId
  }

  console.log(`  Found: "${match.attributes.title}" (id: ${match.id})`)
  return match.id
}

// ── fetch album details + tracks ─────────────────────────────────────────────

async function fetchAlbumData(token, albumId) {
  // Fetch album metadata + artists
  const albumData = await tidalGet(
    token,
    `/albums/${albumId}?countryCode=${COUNTRY}&include=items,artists`,
  )

  const albumResource = albumData.data
  if (!albumResource) die('Album resource not found in response')

  const attrs = albumResource.attributes
  const albumIncluded = albumData.included || []

  // Get album artist names
  const albumArtistIds = (albumResource.relationships?.artists?.data || []).map((r) => r.id)
  const albumArtistNames = albumArtistIds
    .map((id) => albumIncluded.find((r) => r.type === 'artists' && r.id === id)?.attributes?.name)
    .filter(Boolean)

  // Get track listing with track numbers from album items relationship
  const itemRefs = albumResource.relationships?.items?.data || []

  // Fetch items with track artists
  const itemsData = await tidalGet(
    token,
    `/albums/${albumId}/relationships/items?countryCode=${COUNTRY}&include=items.artists`,
  )

  const itemsIncluded = itemsData.included || []
  const trackResources = itemsIncluded.filter((r) => r.type === 'tracks')
  const artistResources = itemsIncluded.filter((r) => r.type === 'artists')

  // Build a map of track number from the items data array
  const trackNumberMap = new Map()
  for (const ref of itemsData.data || []) {
    trackNumberMap.set(ref.id, ref.meta?.trackNumber)
  }

  // Sort tracks by track number
  const tracks = trackResources
    .map((t) => {
      const ta = t.attributes
      const trackNum = trackNumberMap.get(t.id)

      // Get artists for this track
      const trackArtistIds = (t.relationships?.artists?.data || []).map((r) => r.id)
      const artistNames = trackArtistIds
        .map((id) => artistResources.find((a) => a.id === id)?.attributes?.name)
        .filter(Boolean)

      return {
        id: `t-${trackNum}`,
        track_number: trackNum,
        name: ta.title,
        duration_ms: isoDurationToMs(ta.duration),
        artists: artistNames.join(', ') || undefined,
      }
    })
    .sort((a, b) => a.track_number - b.track_number)

  // Fetch cover art
  const coverArtData = await tidalGet(
    token,
    `/albums/${albumId}/relationships/coverArt?countryCode=${COUNTRY}&include=coverArt`,
  )
  const artworks = (coverArtData.included || []).filter((r) => r.type === 'artworks')
  // Pick the largest image
  let imageUrl = null
  if (artworks.length) {
    const files = artworks[0].attributes?.files || []
    const largest = files.reduce((best, f) => (f.meta?.width > (best?.meta?.width || 0) ? f : best), null)
    imageUrl = largest?.href || files[0]?.href || null
  }

  // Extract label from copyright text
  const copyrightText = attrs.copyright?.text || ''
  const labelMatch = copyrightText.match(/(?:exclusive\s+)?(?:global\s+)?license to\s+(.+)$/i)
    || copyrightText.match(/\)\s+(.+)$/)
  const label = labelMatch ? labelMatch[1].trim() : copyrightText

  return {
    tidalId: Number(albumId),
    title: attrs.title,
    artist: albumArtistNames.join(', ') || 'Unknown',
    releaseDate: attrs.releaseDate || null,
    label,
    imageUrl,
    tracks,
  }
}

// ── download cover art ───────────────────────────────────────────────────────

async function downloadCover(imageUrl, slug) {
  if (!imageUrl) {
    console.log('  ⚠ No cover image URL found, skipping download')
    return null
  }

  mkdirSync(COVERS_DIR, { recursive: true })

  // Determine extension from URL, default to jpg
  const ext = imageUrl.match(/\.(png|webp|jpg|jpeg)(\?|$)/i)?.[1] || 'jpg'
  const filename = `${slug}.${ext}`
  const dest = join(COVERS_DIR, filename)

  console.log(`  Downloading cover → public/covers/${filename}`)
  const res = await fetch(imageUrl)
  if (!res.ok) {
    console.log(`  ⚠ Failed to download cover (${res.status}), skipping`)
    return null
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buffer)
  console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(0)} KB)`)
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
    tidalId: ${entry.tidalId},
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

  console.log(`\nFetching "${album}" by ${artist} from TIDAL…\n`)

  // 1. Auth
  console.log('  Authenticating…')
  const token = await getAccessToken()
  console.log('  ✓ Got access token')

  // 2. Search
  console.log('  Searching…')
  const albumId = await searchAlbum(token, artist, album)

  // 3. Fetch album data
  console.log('  Fetching album data…')
  const data = await fetchAlbumData(token, albumId)
  console.log(
    `  ✓ ${data.title} — ${data.tracks.length} tracks`,
  )

  // 4. Download cover
  const slug = slugify(album)
  const coverPath = await downloadCover(data.imageUrl, slug)

  // 5. Build catalog entry
  const entry = {
    id: `${slugify(artist)}-${slug}`,
    tidalId: data.tidalId,
    name: data.title,
    artist: data.artist,
    release_date: data.releaseDate,
    label: data.label,
    images: [{ url: coverPath || `/twc-vinyl-shelf/covers/${slug}.jpg` }],
    tracks: data.tracks,
  }

  // 6. Update catalog
  console.log('  Writing catalog…')
  updateCatalog(entry)

  console.log('\n✓ Done!\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
