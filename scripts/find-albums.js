#!/usr/bin/env node
// Find which albums the missing singles are on via iTunes

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const tracks = [
  { title: '5K', artist: 'EBK JaayBo', search: 'EBK Jaaybo 5K' },
  { title: 'The Biggest G', artist: 'EBK JaayBo', search: 'EBK Jaaybo Biggest G' },
  { title: 'V.S. Freestyle', artist: 'Victony', search: 'Victony VS Freestyle' },
  { title: 'E Go Be', artist: 'Victony', search: 'Victony Don Jazzy E Go Be' },
  { title: 'Long Live My Brother', artist: 'EBK JaayBo', search: 'EBK Jaaybo Long Live My Brother' },
  { title: 'Someone You Love', artist: 'EBK JaayBo', search: 'EBK Jaaybo Someone You Love' },
  { title: "I'm Koming", artist: 'EBK JaayBo', search: 'EBK Jaaybo Koming' },
  { title: 'Hour Glass', artist: 'BLP Kosher', search: 'BLP Kosher Hour Glass' },
  { title: 'Boogieman', artist: 'EBK JaayBo', search: 'EBK Jaaybo Boogieman' },
  { title: 'F*ck Everybody (Free Maxx)', artist: 'EBK JaayBo', search: 'EBK Jaaybo Fuck Everybody' },
]

async function main() {
  for (const t of tracks) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(t.search)}&entity=song&limit=20&country=US`
    const res = await fetch(url)
    const data = await res.json()
    const results = (data.results || []).filter((r) => {
      const artist = (r.artistName || '').toLowerCase()
      return t.artist.toLowerCase().split(' ').some((word) => artist.includes(word.toLowerCase()))
    })

    console.log(`\n${t.title} by ${t.artist}:`)
    if (!results.length) {
      console.log('  No results')
    } else {
      for (const r of results.slice(0, 5)) {
        console.log(`  "${r.trackName}" on album "${r.collectionName}" by ${r.artistName}`)
      }
    }
    await delay(300)
  }
}

main().catch(console.error)
