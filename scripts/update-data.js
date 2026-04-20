import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://fantasy.allsvenskan.se/api'

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

const SPECIAL_SPELARE = [
  { key: 'asoro',   sokNamn: 'Asoro' },
  { key: 'besara',  sokNamn: 'Besara' },
  { key: 'abraham', sokNamn: 'Abraham' },
  { key: 'lien',    sokNamn: 'Lien' },
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

  // --- Uppdatera omgangar.json ---
  const omgangarPath = join(__dirname, '../src/data/omgangar.json')
  const omgangar = JSON.parse(readFileSync(omgangarPath, 'utf8'))
  const befintligaGW = new Set(omgangar.map((o) => o.omgang))

  const saknasGW = []
  for (let gw = 1; gw <= sistaGW; gw++) {
    if (!befintligaGW.has(gw)) saknasGW.push(gw)
  }

  if (saknasGW.length === 0) {
    console.log('omgangar.json: Allt är redan uppdaterat.')
  } else {
    console.log(`Hämtar omgångsdata för GW: ${saknasGW.join(', ')}`)
    for (const gw of saknasGW) {
      const poang = {}
      for (const spelare of SPELARE) {
        const picksData = await fetchJSON(`${BASE}/entry/${spelare.id}/event/${gw}/picks/`)
        poang[spelare.namn] = picksData.entry_history.points
        console.log(`  ${spelare.namn} GW${gw}: ${poang[spelare.namn]}p`)
      }
      omgangar.push({ omgang: gw, poang })
    }
    omgangar.sort((a, b) => a.omgang - b.omgang)
    writeFileSync(omgangarPath, JSON.stringify(omgangar, null, 2) + '\n')
    console.log('omgangar.json uppdaterad!')
  }

  // --- Uppdatera spelare.json ---
  const spelarePath = join(__dirname, '../src/data/spelare.json')
  const spelarData = JSON.parse(readFileSync(spelarePath, 'utf8'))
  const elements = bootstrap.elements
  let spelarUppdaterad = false

  for (const { key, sokNamn } of SPECIAL_SPELARE) {
    const element = elements.find(
      (e) =>
        e.web_name?.toLowerCase().includes(sokNamn.toLowerCase()) ||
        `${e.first_name} ${e.second_name}`.toLowerCase().includes(sokNamn.toLowerCase())
    )

    if (!element) {
      console.log(`Kunde inte hitta spelare i API: ${sokNamn}`)
      continue
    }

    const summary = await fetchJSON(`${BASE}/element-summary/${element.id}/`)
    const history = summary.history ?? []
    const befintliga = new Set((spelarData[key] ?? []).map((h) => h.omgang))

    for (const h of history) {
      const gw = h.round
      if (gw > sistaGW) continue
      if (!befintliga.has(gw)) {
        if (!spelarData[key]) spelarData[key] = []
        spelarData[key].push({
          omgang: gw,
          poang: h.total_points,
          minuter: h.minutes,
          mal: h.goals_scored,
          assist: h.assists,
        })
        console.log(`  ${sokNamn} GW${gw}: ${h.total_points}p ${h.minutes}min ${h.goals_scored}mål`)
        spelarUppdaterad = true
      }
    }

    if (spelarData[key]) {
      spelarData[key].sort((a, b) => a.omgang - b.omgang)
    }
  }

  if (spelarUppdaterad) {
    writeFileSync(spelarePath, JSON.stringify(spelarData, null, 2) + '\n')
    console.log('spelare.json uppdaterad!')
  } else {
    console.log('spelare.json: Allt är redan uppdaterat.')
  }

  // --- Uppdatera meta.json med senaste körningstid ---
  const metaPath = join(__dirname, '../src/data/meta.json')
  writeFileSync(metaPath, JSON.stringify({ lastUpdated: new Date().toISOString() }, null, 2) + '\n')
  console.log('meta.json uppdaterad!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
