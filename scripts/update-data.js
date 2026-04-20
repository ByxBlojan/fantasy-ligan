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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJSON(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      if (attempt === retries) throw new Error(`${e.message} för ${url} (efter ${retries} försök)`)
      console.warn(`  Försök ${attempt} misslyckades — försöker igen om ${attempt}s`)
      await sleep(attempt * 1000)
    }
  }
}

function readJSON(path, fallback) {
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return fallback }
}

async function main() {
  let hadErrors = false

  // --- Bootstrap ---
  console.log('Hämtar bootstrap-data...')
  const bootstrap = await fetchJSON(`${BASE}/bootstrap-static/`)
  if (!bootstrap?.events || !bootstrap?.elements) {
    throw new Error('Bootstrap saknar förväntade fält (events/elements)')
  }

  const avslutade = bootstrap.events.filter((e) => e.finished)
  if (avslutade.length === 0) {
    console.log('Inga avslutade omgångar ännu.')
    return
  }
  const sistaGW = avslutade.at(-1).id
  console.log(`Senaste avslutade omgång: GW${sistaGW}`)

  // --- omgangar.json ---
  try {
    const omgangarPath = join(__dirname, '../src/data/omgangar.json')
    const omgangar = readJSON(omgangarPath, [])
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
        try {
          const poang = {}
          for (const spelare of SPELARE) {
            const picks = await fetchJSON(`${BASE}/entry/${spelare.id}/event/${gw}/picks/`)
            poang[spelare.namn] = picks?.entry_history?.points ?? 0
            console.log(`  ${spelare.namn} GW${gw}: ${poang[spelare.namn]}p`)
          }
          omgangar.push({ omgang: gw, poang })
        } catch (e) {
          console.error(`  Fel GW${gw}: ${e.message} — hoppar över`)
          hadErrors = true
        }
      }
      omgangar.sort((a, b) => a.omgang - b.omgang)
      writeFileSync(omgangarPath, JSON.stringify(omgangar, null, 2) + '\n')
      console.log('omgangar.json uppdaterad!')
    }
  } catch (e) {
    console.error(`omgangar.json misslyckades: ${e.message}`)
    hadErrors = true
  }

  // --- spelare.json ---
  try {
    const spelarePath = join(__dirname, '../src/data/spelare.json')
    const spelarData = readJSON(spelarePath, {})
    const elements = bootstrap.elements
    let uppdaterad = false

    for (const { key, sokNamn } of SPECIAL_SPELARE) {
      try {
        const element = elements.find(
          (e) =>
            e.web_name?.toLowerCase().includes(sokNamn.toLowerCase()) ||
            `${e.first_name} ${e.second_name}`.toLowerCase().includes(sokNamn.toLowerCase())
        )
        if (!element) { console.warn(`Hittade inte ${sokNamn} i API`); continue }

        const summary = await fetchJSON(`${BASE}/element-summary/${element.id}/`)
        const history = summary?.history ?? []
        const befintliga = new Set((spelarData[key] ?? []).map((h) => h.omgang))

        for (const h of history) {
          if (h.round > sistaGW || befintliga.has(h.round)) continue
          if (!spelarData[key]) spelarData[key] = []
          spelarData[key].push({
            omgang: h.round,
            poang: h.total_points ?? 0,
            minuter: h.minutes ?? 0,
            mal: h.goals_scored ?? 0,
            assist: h.assists ?? 0,
          })
          console.log(`  ${sokNamn} GW${h.round}: ${h.total_points}p`)
          uppdaterad = true
        }
        if (spelarData[key]) spelarData[key].sort((a, b) => a.omgang - b.omgang)
      } catch (e) {
        console.error(`  Fel för ${sokNamn}: ${e.message}`)
        hadErrors = true
      }
    }

    if (uppdaterad) {
      writeFileSync(spelarePath, JSON.stringify(spelarData, null, 2) + '\n')
      console.log('spelare.json uppdaterad!')
    } else {
      console.log('spelare.json: Allt är redan uppdaterat.')
    }
  } catch (e) {
    console.error(`spelare.json misslyckades: ${e.message}`)
    hadErrors = true
  }

  // --- fria-byten.json ---
  try {
    const friaBytenPath = join(__dirname, '../src/data/fria-byten.json')
    const friaCachePath = join(__dirname, '../src/data/fria-byten-cache.json')
    const cap = (bootstrap.game_settings?.max_extra_free_transfers ?? 4) + 1
    const friaData = readJSON(friaCachePath, [])
    const friaMap = Object.fromEntries(friaData.map((d) => [d.manager, d]))
    const friaByten = []

    for (const spelare of SPELARE) {
      const cache = { ...(friaMap[spelare.namn]?.cache ?? {}) }
      let free = 1
      let nyaHamtningar = 0

      for (let gw = 1; gw <= sistaGW; gw++) {
        if (cache[gw] !== undefined) { free = cache[gw]; continue }
        try {
          const picks = await fetchJSON(`${BASE}/entry/${spelare.id}/event/${gw}/picks/`)
          const used = picks?.entry_history?.event_transfers ?? 0
          const paid = (picks?.entry_history?.event_transfers_cost ?? 0) / 4
          free = Math.min(cap, free - (used - paid) + 1)
        } catch (e) {
          console.warn(`  Varning GW${gw} ${spelare.namn}: ${e.message} — antar 0 byten`)
          free = Math.min(cap, free + 1)
          hadErrors = true
        }
        cache[gw] = free
        nyaHamtningar++
      }

      if (nyaHamtningar > 0) console.log(`  ${spelare.namn}: hämtade ${nyaHamtningar} nya GW`)
      friaByten.push({ manager: spelare.namn, fria: Math.max(0, cache[sistaGW] - 1), cache })
    }

    writeFileSync(friaCachePath, JSON.stringify(friaByten, null, 2) + '\n')
    writeFileSync(friaBytenPath, JSON.stringify(
      friaByten.map(({ manager, fria }) => ({ manager, fria })), null, 2) + '\n')
    console.log('fria-byten.json uppdaterad!')
  } catch (e) {
    console.error(`fria-byten misslyckades: ${e.message}`)
    hadErrors = true
  }

  // --- transfers.json ---
  try {
    const transfersPath = join(__dirname, '../src/data/transfers.json')
    const elementMap = Object.fromEntries(
      bootstrap.elements.map((e) => [e.id, e.web_name || `${e.first_name} ${e.second_name}`])
    )
    const alleByten = []
    for (const spelare of SPELARE) {
      try {
        const byten = await fetchJSON(`${BASE}/entry/${spelare.id}/transfers/`)
        for (const t of byten) {
          alleByten.push({
            manager: spelare.namn,
            gw: t.event,
            time: t.time,
            in: elementMap[t.element_in] ?? `#${t.element_in}`,
            inCost: t.element_in_cost / 10,
            out: elementMap[t.element_out] ?? `#${t.element_out}`,
            outCost: t.element_out_cost / 10,
          })
        }
      } catch (e) {
        console.error(`  Transfers ${spelare.namn}: ${e.message}`)
        hadErrors = true
      }
    }
    alleByten.sort((a, b) => a.gw - b.gw || a.manager.localeCompare(b.manager))
    writeFileSync(transfersPath, JSON.stringify(alleByten, null, 2) + '\n')
    console.log(`transfers.json uppdaterad! (${alleByten.length} byten)`)
  } catch (e) {
    console.error(`transfers.json misslyckades: ${e.message}`)
    hadErrors = true
  }

  // --- meta.json ---
  const metaPath = join(__dirname, '../src/data/meta.json')
  writeFileSync(metaPath, JSON.stringify({ lastUpdated: new Date().toISOString(), hadErrors }, null, 2) + '\n')

  if (hadErrors) {
    console.warn('\n⚠️  Körningen slutfördes med fel — se logg ovan.')
    process.exit(1)
  } else {
    console.log('\n✓ Allt klart utan fel.')
  }
}

main().catch((err) => {
  console.error('Kritiskt fel:', err.message)
  process.exit(1)
})
