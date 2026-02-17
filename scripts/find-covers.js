#!/usr/bin/env node
// Search iTunes for missing cover art and download it

import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const COVERS_DIR = join(__dirname, '..', 'public/covers')

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const missing = [
  { slug: '5k', searches: ['EBK JaayBo 5K', 'EBK Jaaybo 5K', 'Jaaybo 5K'], artists: ['jaaybo'] },
  { slug: 'the-biggest-g', searches: ['EBK JaayBo Biggest G', 'EBK Jaaybo Biggest', 'Jaaybo Biggest G'], artists: ['jaaybo'] },
  { slug: 'v-s-freestyle', searches: ['Victony VS Freestyle', 'Victony V.S. Freestyle'], artists: ['victony'] },
  { slug: 'e-go-be', searches: ['Victony E Go Be', 'Victony Don Jazzy E Go Be', 'Don Jazzy E Go Be'], artists: ['victony', 'don jazzy'] },
  { slug: 'long-live-my-brother', searches: ['EBK JaayBo Long Live My Brother', 'EBK Jaaybo Long Live'], artists: ['jaaybo'] },
  { slug: 'someone-you-love', searches: ['EBK JaayBo Someone You Love', 'EBK Jaaybo Someone You Love'], artists: ['jaaybo'] },
  { slug: 'i-m-koming', searches: ['EBK JaayBo Koming', 'EBK Jaaybo Im Koming'], artists: ['jaaybo'] },
  { slug: 'hour-glass', searches: ['BLP Kosher Hour Glass', 'BLP Kosher Hourglass', 'BLP KOSHER'], artists: ['blp', 'kosher'] },
]

async function searchiTunes(query, entity) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&limit=10&country=US`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.results || []
}

async function downloadArtwork(artworkUrl100, slug) {
  const highRes = artworkUrl100.replace('100x100', '3000x3000')
  mkdirSync(COVERS_DIR, { recursive: true })
  const dest = join(COVERS_DIR, `${slug}.jpg`)

  const res = await fetch(highRes)
  if (!res.ok) {
    // Try 600x600 if 3000x3000 fails
    const medRes = artworkUrl100.replace('100x100', '600x600')
    const res2 = await fetch(medRes)
    if (!res2.ok) return false
    const buf = Buffer.from(await res2.arrayBuffer())
    writeFileSync(dest, buf)
    console.log(`    Saved ${slug}.jpg (${(buf.length / 1024).toFixed(0)} KB) @ 600x600`)
    return true
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buf)
  console.log(`    Saved ${slug}.jpg (${(buf.length / 1024).toFixed(0)} KB) @ 3000x3000`)
  return true
}

async function main() {
  console.log('Searching iTunes for missing cover art...\n')

  for (const item of missing) {
    const dest = join(COVERS_DIR, `${item.slug}.jpg`)
    if (existsSync(dest)) {
      console.log(`  ${item.slug}: already exists, skipping`)
      continue
    }

    console.log(`  ${item.slug}:`)
    let found = false

    for (const query of item.searches) {
      if (found) break

      for (const entity of ['song', 'album']) {
        if (found) break

        const results = await searchiTunes(query, entity)
        await delay(300)

        for (const r of results) {
          const name = (entity === 'song' ? r.trackName : r.collectionName || '').toLowerCase()
          const artist = (r.artistName || '').toLowerCase()

          // Check if the artist matches
          const artistMatch = item.artists.some((a) => artist.includes(a))
          if (!artistMatch) continue

          const artwork = r.artworkUrl100
          if (!artwork) continue

          console.log(`    Found: "${entity === 'song' ? r.trackName : r.collectionName}" by ${r.artistName}`)
          const ok = await downloadArtwork(artwork, item.slug)
          if (ok) found = true
          break
        }
      }
    }

    if (!found) {
      console.log('    NOT FOUND on iTunes')
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)
