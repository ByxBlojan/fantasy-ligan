  // scripts/update-data.js
  // Hämtar nya omgångar från Fantasy Allsvenskan API och uppdaterar omgangar.json
  // Kräver Node 18+. Kör med: node scripts/update-data.js

  import { readFileSync, writeFileSync } from 'fs'
  import { join, dirname } from 'path'
  import { fileURLToPath } from 'url'

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const BASE = 'https://fantasy.allsvenskan.se/api'

  // Entry-ID för varje deltagare
  const SPELARE = [
    { id: 10275, namn: 'Oliver' },
    { id: 28485, namn: 'Alle' },
    { id: 34658, namn: 'Josef' },
    { id: 32959, namn: 'Magnus' },
    { id: 18521, namn: 'Erik' },
    { id: 25103, namn: 'Hellman' },
    { id: 39432, namn: 'Manne' },
    { id: 32960, namn: 'Lindmark' },
  ]

  async function fetchJSON(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} för ${url}`)
    return res.json()
  }

  async function main() {
    console.log('Hämtar bootstrap-data...')
    const bootstrap = await fetchJSON(`${BASE}/bootstrap-static/`)

    const avslutade = bootstrap.events.filter((e) => e.finished)
    if (avslutade.length === 0) {
      console.log('Inga avslutade omgångar ännu.')
      return
    }
    const sistaGW = avslutade.at(-1).id
    console.log(`Senaste avslutade omgång: GW${sistaGW}`)

    const jsonPath = join(__dirname, '../src/data/omgangar.json')
    const omgangar = JSON.parse(readFileSync(jsonPath, 'utf8'))
    const befintligaGW = new Set(omgangar.map((o) => o.omgang))

    const saknasGW = []
    for (let gw = 1; gw <= sistaGW; gw++) {
      if (!befintligaGW.has(gw)) saknasGW.push(gw)
    }

    if (saknasGW.length === 0) {
      console.log('Allt är redan uppdaterat.')
      return
    }

    console.log(`Hämtar data för GW: ${saknasGW.join(', ')}`)

    for (const gw of saknasGW) {
      console.log(`  Hämtar GW${gw}...`)

      const poang = {}

      for (const spelare of SPELARE) {
        const picksData = await fetchJSON(`${BASE}/entry/${spelare.id}/event/${gw}/picks/`)
        const gwPoang = picksData.entry_history.points
        poang[spelare.namn] = gwPoang
        console.log(`    ${spelare.namn}: ${gwPoang} poäng`)
      }

      omgangar.push({ omgang: gw, poang })
      console.log(`  GW${gw} tillagd: ${JSON.stringify(poang)}`)
    }

    omgangar.sort((a, b) => a.omgang - b.omgang)
    writeFileSync(jsonPath, JSON.stringify(omgangar, null, 2) + '\n')
    console.log('omgangar.json uppdaterad!')
  }

  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
