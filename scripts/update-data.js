// scripts/update-data.js
// Hämtar nya omgångar från Fantasy Allsvenskan API och uppdaterar omgangar.json
// Kräver Node 18+. Kör med: node scripts/update-data.js

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://fantasy.allsvenskan.se/api'

// Entry-ID för respektive lag i den privata ligan
const ENTRIES = [
  { id: 42398, spelare: ['Oliver', 'Alle', 'Josef', 'Magnus'] },
  { id: 46847, spelare: ['Erik', 'Hellman', 'Manne', 'Lindmark'] },
]

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} för ${url}`)
  return res.json()
}

async function main() {
  console.log('Hämtar bootstrap-data...')
  const bootstrap = await fetchJSON(`${BASE}/bootstrap-static/`)

  // Bygg upp en map: player_id → web_name
  const playerMap = {}
  for (const el of bootstrap.elements) {
    playerMap[el.id] = el.web_name
  }

  // Hitta senaste avslutade omgång
  const avslutade = bootstrap.events.filter((e) => e.finished)
  if (avslutade.length === 0) {
    console.log('Inga avslutade omgångar ännu.')
    return
  }
  const sistaGW = avslutade.at(-1).id
  console.log(`Senaste avslutade omgång: GW${sistaGW}`)

  // Läs befintliga omgångar
  const jsonPath = join(__dirname, '../src/data/omgangar.json')
  const omgangar = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const befintligaGW = new Set(omgangar.map((o) => o.omgang))

  // Hitta GW:ar som saknas
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

    // Hämta live-poäng för alla spelare denna GW
    const live = await fetchJSON(`${BASE}/event/${gw}/live/`)
    const liveMap = {}
    for (const el of live.elements) {
      liveMap[el.id] = el.stats.total_points
    }

    const poang = {}

    for (const entry of ENTRIES) {
      // Hämta picks för detta lag och denna GW
      const picksData = await fetchJSON(`${BASE}/entry/${entry.id}/event/${gw}/picks/`)

      for (const pick of picksData.picks) {
        const webName = playerMap[pick.element]
        if (entry.spelare.includes(webName)) {
          const pts = liveMap[pick.element] ?? 0
          // Multiplicera med captain-bonus (multiplier = 2 om captain, 3 om triple captain)
          poang[webName] = pts * pick.multiplier
        }
      }
    }

    // Kontrollera att alla 8 spelare hittades
    const allaSpelarnamn = ENTRIES.flatMap((e) => e.spelare)
    const saknade = allaSpelarnamn.filter((n) => !(n in poang))
    if (saknade.length > 0) {
      console.warn(`  VARNING: Hittade inte data för: ${saknade.join(', ')} i GW${gw}`)
      console.warn('  Kontrollera att web_name i API matchar namnen i liga.js')
    }

    omgangar.push({ omgang: gw, poang })
    console.log(`  GW${gw} tillagd: ${JSON.stringify(poang)}`)
  }

  // Sortera och skriv tillbaka
  omgangar.sort((a, b) => a.omgang - b.omgang)
  writeFileSync(jsonPath, JSON.stringify(omgangar, null, 2) + '\n')
  console.log('omgangar.json uppdaterad!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
