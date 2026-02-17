#!/usr/bin/env node
// Batch script: searches iTunes for cover art and track metadata for all 16 singles,
// then adds them all to catalog.js at once.

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CATALOG_PATH = join(ROOT, 'src/utils/catalog.js')
const COVERS_DIR = join(ROOT, 'public/covers')

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ── Singles to add ──────────────────────────────────────────────────────────

const SINGLES = [
  {
    title: 'Boogieman',
    artist: 'EBK JaayBo',
    credit: 'Mixing engineer',
    releaseDate: '2024-08-22',
    search: 'EBK Jaaybo Boogieman',
  },
  {
    title: 'F*ck Everybody (Free Maxx)',
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-03-07',
    search: 'EBK Jaaybo Fuck Everybody Free Maxx',
  },
  {
    title: '5K',
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-09-05',
    search: 'EBK Jaaybo 5K',
  },
  {
    title: 'The Biggest G',
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-02-18',
    search: 'EBK Jaaybo The Biggest G',
  },
  {
    title: 'V.S. Freestyle',
    artist: 'Victony',
    credit: 'Engineer, mastering engineer, mixing engineer',
    releaseDate: '2025-11-21',
    search: 'Victony VS Freestyle',
  },
  {
    title: 'Burning Up (feat. The Kid LAROI)',
    artist: 'Nardo Wick',
    credit: 'Engineer',
    releaseDate: '2022-07-22',
    search: 'Nardo Wick Burning Up Kid LAROI',
  },
  {
    title: 'Deep',
    artist: 'Girlfriend',
    credit: 'Engineer',
    releaseDate: '2025-12-17',
    search: 'Girlfriend Deep',
  },
  {
    title: 'E Go Be',
    artist: 'Victony & Don Jazzy',
    credit: 'Engineer',
    releaseDate: '2025-11-21',
    search: 'Victony Don Jazzy E Go Be',
  },
  {
    title: 'Long Live My Brother',
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-04-11',
    search: 'EBK Jaaybo Long Live My Brother',
  },
  {
    title: 'Someone You Love',
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-07-18',
    search: 'EBK Jaaybo Someone You Love',
  },
  {
    title: "I'm Koming",
    artist: 'EBK JaayBo',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2025-08-22',
    search: "EBK Jaaybo I'm Koming",
  },
  {
    title: 'Hour Glass',
    artist: 'BLP Kosher',
    credit: 'Composer, mastering engineer, mixing engineer',
    releaseDate: '2024-07-12',
    search: 'BLP Kosher Hour Glass',
  },
  {
    title: 'Paris to Tokyo',
    artist: 'Fivio Foreign & The Kid LAROI',
    credit: 'Engineer',
    releaseDate: '2022-07-08',
    search: 'Fivio Foreign Kid LAROI Paris to Tokyo',
  },
  {
    title: 'OFF THE PORCH (feat. BigXthaPlug & Maxo Kream)',
    artist: 'Mike Dimes',
    credit: 'Engineer',
    releaseDate: '2023-04-21',
    search: 'Mike Dimes OFF THE PORCH BigXthaPlug',
  },
  {
    title: 'Como Yo',
    artist: 'Saul Villarreal',
    credit: 'Mastering engineer, mixing engineer',
    releaseDate: '2024-05-29',
    search: 'Saul Villarreal Como Yo',
  },
  {
    title: 'Skidoo',
    artist: 'BLP Kosher',
    credit: 'Engineer, mastering engineer, mixing engineer',
    releaseDate: '2024-07-12',
    search: 'BLP Kosher Skidoo',
  },
]

// ── iTunes search ───────────────────────────────────────────────────────────

async function searchSong(query, expectedTitle, expectedArtist) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const results = data.results || []
    if (!results.length) return null

    const normTitle = expectedTitle.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normArtist = expectedArtist.toLowerCase().replace(/[^a-z0-9]/g, '')

    // Score results
    const scored = results.map((r) => {
      const title = (r.trackName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const artist = (r.artistName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      let score = 0
      if (title === normTitle) score += 100
      else if (title.includes(normTitle) || normTitle.includes(title)) score += 50
      if (artist.includes(normArtist) || normArtist.includes(artist)) score += 80
      return { result: r, score }
    })

    scored.sort((a, b) => b.score - a.score)
    return scored[0].score >= 80 ? scored[0].result : null
  } catch {
    return null
  }
}

async function downloadCover(artworkUrl, slug) {
  if (!artworkUrl) return null
  mkdirSync(COVERS_DIR, { recursive: true })
  const highRes = artworkUrl.replace('100x100', '600x600')
  const filename = `${slug}.jpg`
  const dest = join(COVERS_DIR, filename)

  try {
    const res = await fetch(highRes)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    writeFileSync(dest, buffer)
    console.log(`    ✓ Cover saved (${(buffer.length / 1024).toFixed(0)} KB)`)
    return `/twc-vinyl-shelf/covers/${filename}`
  } catch {
    return null
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nBatch-adding 16 singles to catalog…\n')

  const entries = []

  for (const single of SINGLES) {
    const slug = slugify(single.title)
    const artistSlug = slugify(single.artist.split('&')[0].split('feat')[0].trim())
    const id = `${artistSlug}-${slug}`

    console.log(`  [${entries.length + 1}/16] ${single.title} by ${single.artist}`)

    // Search iTunes for metadata + cover art
    const match = await searchSong(single.search, single.title, single.artist.split('&')[0].split('feat')[0].trim())

    let coverPath = `/twc-vinyl-shelf/covers/${slug}.jpg`
    let duration = 0
    let trackArtists = single.artist

    if (match) {
      console.log(`    Found on iTunes: "${match.trackName}" by ${match.artistName}`)
      duration = match.trackTimeMillis || 0
      trackArtists = match.artistName

      // Download cover art
      const downloaded = await downloadCover(match.artworkUrl100, slug)
      if (downloaded) coverPath = downloaded
    } else {
      console.log('    ⚠ Not found on iTunes, using metadata from plan')
    }

    entries.push({
      id,
      name: single.title,
      artist: single.artist,
      release_date: single.releaseDate,
      label: '',
      images: [{ url: coverPath }],
      tracks: [
        {
          id: 't-1',
          track_number: 1,
          name: single.title,
          duration_ms: duration,
          artists: trackArtists,
        },
      ],
      credits: [
        { name: 'Tyler Chase', role: single.credit },
      ],
    })

    // Rate limit for iTunes
    await delay(400)
  }

  // Read existing catalog to preserve Stubborn
  const existingSrc = readFileSync(CATALOG_PATH, 'utf8')
  const existingMatch = existingSrc.match(/const CATALOG = \[\s*([\s\S]*)\s*\]\s*$/m)
  let existingBlocks = ''
  if (existingMatch) {
    const existing = existingMatch[1]
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
          blocks.push(existing.slice(start, i + 1))
          start = -1
        }
      }
    }
    existingBlocks = blocks.join(',\n')
  }

  // Format new entries
  function formatEntry(e) {
    const tracksStr = e.tracks
      .map((t) => {
        const parts = [
          `      id: '${t.id}'`,
          `      track_number: ${t.track_number}`,
          `      name: ${JSON.stringify(t.name)}`,
          `      duration_ms: ${t.duration_ms}`,
        ]
        if (t.artists) parts.push(`      artists: ${JSON.stringify(t.artists)}`)
        return `    {\n${parts.join(',\n')},\n    }`
      })
      .join(',\n')

    const creditsStr = e.credits
      .map((c) => `      { name: ${JSON.stringify(c.name)}, role: ${JSON.stringify(c.role)} }`)
      .join(',\n')

    return `  {
    id: '${e.id}',
    name: ${JSON.stringify(e.name)},
    artist: ${JSON.stringify(e.artist)},
    release_date: ${JSON.stringify(e.release_date)},
    label: ${JSON.stringify(e.label)},
    images: [{ url: '${e.images[0].url}' }],
    tracks: [
${tracksStr},
    ],
    credits: [
${creditsStr},
    ],
  }`
  }

  const newBlocks = entries.map(formatEntry).join(',\n')

  const src = `// TWC album catalog — single source of truth
// To add an album, run: npm run add-album "Artist" "Album"
const CATALOG = [
${existingBlocks},
${newBlocks},
]

export default CATALOG
`

  writeFileSync(CATALOG_PATH, src)
  console.log(`\n✓ Updated catalog with ${entries.length} new singles`)
  console.log(`  Total entries: ${entries.length + 1} (including Stubborn)`)

  // Report cover art status
  const withCover = entries.filter((e) => e._hasCover).length
  const withoutCover = entries.length - withCover
  console.log(`\n✓ Done!\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
