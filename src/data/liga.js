// ============================================================
// UPPDATERA DENNA FIL EFTER VARJE OMGÅNG
// Lägg till ett nytt objekt i "omgangar"-arrayen
// ============================================================

export const lag1 = {
  namn: "Hammarby",
  farg: "#00a650",
  spelare: ["Oliver", "Alle", "Josef", "Magnus"],
}

export const lag2 = {
  namn: "Djurgården",
  farg: "#005591",
  spelare: ["Erik", "Hellman", "Manne", "Lindmark"],
}

// Poäng per omgång per spelare — uppdateras automatiskt av scripts/update-data.js
import omgangar from './omgangar.json'
export { omgangar }

// Side bets mellan spelare
export const sidebets = [
  { spelare1: "Magnus", spelare2: "Erik", belopp: 500 },
  { spelare1: "Alle", spelare2: "Hellman", belopp: 500 },
]

// Side bets med manuell data (ej API-baserade)
export const specialbets = [
  // Typ "ppm": poäng per spelad minut
  // Uppdatera data med: { omgang, asoro: { poang, minuter }, besara: { poang, minuter } }
  {
    typ: "ppm",
    better1: { namn: "Manne", backar: "Asoro" },
    better2: { namn: "Oliver", backar: "Besara" },
    beskrivning: "Flest fantasy-poäng per spelad minut",
    vinst: null,
    belopp: null,
    slutvillkor: "Asoros kontrakt löper ut",
    data: [
      // { omgang: 1, asoro: { poang: 0, minuter: 0 }, besara: { poang: 0, minuter: 0 } }
    ],
  },
  // Typ "mal": flest mål totalt
  // Uppdatera data med: { omgang, spelare1: { mal }, spelare2: { mal } }
  {
    typ: "mal",
    better1: { namn: "Oliver", backar: "Paulos Abraham" },
    better2: { namn: "Hellman", backar: "Lien" },
    beskrivning: "Flest mål",
    vinst: "en öl",
    belopp: null,
    slutvillkor: "Säsongsslut",
    data: [
      // { omgang: 1, spelare1: { mal: 0 }, spelare2: { mal: 0 } }
    ],
  },
]

// ============================================================
// Beräkningar (ändra inte dessa)
// ============================================================

export function totalpoangSpelare(namn) {
  return omgangar.reduce((sum, o) => sum + (o.poang[namn] ?? 0), 0)
}

export function totalpoangLag(lag) {
  return lag.spelare.reduce((sum, s) => sum + totalpoangSpelare(s), 0)
}

export function poangPerOmgangLag(lag) {
  return omgangar.map((o) => ({
    omgang: o.omgang,
    poang: lag.spelare.reduce((sum, s) => sum + (o.poang[s] ?? 0), 0),
  }))
}

export function ackumuleradSkillnad() {
  let diff = 0
  return omgangar.map((o) => {
    const lag1Poang = lag1.spelare.reduce((sum, s) => sum + (o.poang[s] ?? 0), 0)
    const lag2Poang = lag2.spelare.reduce((sum, s) => sum + (o.poang[s] ?? 0), 0)
    diff += lag1Poang - lag2Poang
    return { omgang: o.omgang, skillnad: diff, lag1: lag1Poang, lag2: lag2Poang }
  })
}

export function spelarRanking() {
  const alla = [...lag1.spelare, ...lag2.spelare]
  return alla
    .map((namn) => ({
      namn,
      total: totalpoangSpelare(namn),
      lag: lag1.spelare.includes(namn) ? lag1.namn : lag2.namn,
      farg: lag1.spelare.includes(namn) ? lag1.farg : lag2.farg,
      bastaOmgang: Math.max(...omgangar.map((o) => o.poang[namn] ?? 0)),
    }))
    .sort((a, b) => b.total - a.total)
}

// Ranking som den var innan senaste omgången — för att räkna platsdiff
export function spelarRankingForra() {
  if (omgangar.length < 2) return null
  const alla = [...lag1.spelare, ...lag2.spelare]
  const utomSenaste = omgangar.slice(0, -1)
  return alla
    .map((namn) => ({
      namn,
      total: utomSenaste.reduce((s, o) => s + (o.poang[namn] ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total)
    .map((r, i) => ({ namn: r.namn, plats: i + 1 }))
}

// Formsnitt: senaste N omgångarnas snitt jämfört med säsongssnitt
export function formData(namn, senasteN = 3) {
  const total = totalpoangSpelare(namn)
  const säsongsSnitt = omgangar.length > 0 ? total / omgangar.length : 0

  const senaste = omgangar.slice(-senasteN)
  const senasteTotal = senaste.reduce((s, o) => s + (o.poang[namn] ?? 0), 0)
  const senasteSnitt = senaste.length > 0 ? senasteTotal / senaste.length : 0

  const diff = senasteSnitt - säsongsSnitt
  const diffProcent = säsongsSnitt > 0 ? (diff / säsongsSnitt) * 100 : 0

  return {
    säsongsSnitt: Math.round(säsongsSnitt * 10) / 10,
    senasteSnitt: Math.round(senasteSnitt * 10) / 10,
    diff: Math.round(diff * 10) / 10,
    diffProcent: Math.round(diffProcent),
    antalOmgangar: senaste.length,
  }
}

// Projicerat sluttabell om säsongen slutade nu
export function projiceradTabell(totalGw = 30) {
  const spelade = omgangar.length
  const kvar = Math.max(totalGw - spelade, 0)
  const alla = [...lag1.spelare, ...lag2.spelare]

  const projicerat = alla
    .map((namn) => {
      const total = totalpoangSpelare(namn)
      const snitt = spelade > 0 ? total / spelade : 0
      const projicerat = Math.round(total + snitt * kvar)
      return {
        namn,
        lag: lag1.spelare.includes(namn) ? lag1.namn : lag2.namn,
        farg: lag1.spelare.includes(namn) ? lag1.farg : lag2.farg,
        total,
        snitt: Math.round(snitt * 10) / 10,
        projicerat,
        kvar,
      }
    })
    .sort((a, b) => b.projicerat - a.projicerat)

  // Räkna ut vad varje spelare behöver snitta för att komma ikapp ledaren
  const ledare = projicerat[0]
  return projicerat.map((s) => {
    if (s.namn === ledare.namn || kvar === 0) return { ...s, behöverSnitt: null, gap: 0 }
    const gap = ledare.projicerat - s.projicerat
    const behöverSnitt = kvar > 0 ? Math.ceil((s.total + gap) / spelade * 10) / 10 : null
    // Snitt spelaren behöver hålla RESTEN för att komma ikapp:
    const behöverRestenSnitt = kvar > 0 ? Math.ceil(((ledare.projicerat - s.total) / kvar) * 10) / 10 : null
    return { ...s, gap, behöverRestenSnitt }
  })
}

export function specialBetStatus() {
  return specialbets.map((bet) => {
    if (bet.typ === 'ppm') {
      const p1 = bet.data.reduce((s, d) => s + d.asoro.poang, 0)
      const m1 = bet.data.reduce((s, d) => s + d.asoro.minuter, 0)
      const p2 = bet.data.reduce((s, d) => s + d.besara.poang, 0)
      const m2 = bet.data.reduce((s, d) => s + d.besara.minuter, 0)
      const ppm1 = m1 > 0 ? p1 / m1 : null
      const ppm2 = m2 > 0 ? p2 / m2 : null
      const ettaleder = ppm1 !== null && ppm2 !== null && ppm1 >= ppm2
      return {
        ...bet,
        stat1: ppm1 !== null ? `${ppm1.toFixed(3)} ppm` : null,
        stat2: ppm2 !== null ? `${ppm2.toFixed(3)} ppm` : null,
        ledare: ettaleder ? bet.better1 : bet.better2,
        forlorare: ettaleder ? bet.better2 : bet.better1,
        harData: bet.data.length > 0,
      }
    }

    if (bet.typ === 'mal') {
      const mal1 = bet.data.reduce((s, d) => s + d.spelare1.mal, 0)
      const mal2 = bet.data.reduce((s, d) => s + d.spelare2.mal, 0)
      const ettaleder = mal1 >= mal2
      return {
        ...bet,
        stat1: `${mal1} mål`,
        stat2: `${mal2} mål`,
        ledare: ettaleder ? bet.better1 : bet.better2,
        forlorare: ettaleder ? bet.better2 : bet.better1,
        harData: bet.data.length > 0,
      }
    }

    return { ...bet, harData: false }
  })
}

export function sideBetStatus() {
  return sidebets
    .map(({ spelare1, spelare2, belopp }) => {
      const p1 = totalpoangSpelare(spelare1)
      const p2 = totalpoangSpelare(spelare2)
      const ledare = p1 >= p2 ? spelare1 : spelare2
      const forlorare = p1 >= p2 ? spelare2 : spelare1
      const skillnad = Math.abs(p1 - p2)
      const lag1vinner = lag1.spelare.includes(ledare)
      return { spelare1, spelare2, belopp, ledare, forlorare, skillnad, farg: lag1vinner ? lag1.farg : lag2.farg, ledarPoang: Math.max(p1, p2) }
    })
    .sort((a, b) => b.ledarPoang - a.ledarPoang)
}

export function samstSpelarStats() {
  const alla = [...lag1.spelare, ...lag2.spelare]
  const ranking = alla
    .map((namn) => ({ namn, total: totalpoangSpelare(namn) }))
    .sort((a, b) => a.total - b.total)

  const sämst = ranking[0]
  const näststämst = ranking[1]
  const bäst = ranking[ranking.length - 1]

  const snitt = sämst.total / omgangar.length
  const bakomLedaren = bäst.total - sämst.total
  const föraNäststämst = näststämst.total - sämst.total

  const värstaOmgång = omgangar.reduce(
    (min, o) => (o.poang[sämst.namn] < min.poang ? { gw: o.omgang, poang: o.poang[sämst.namn] } : min),
    { gw: 0, poang: Infinity }
  )

  const antalGångerSist = omgangar.filter((o) => {
    const minPoang = Math.min(...alla.map((n) => o.poang[n] ?? 0))
    return (o.poang[sämst.namn] ?? 0) === minPoang
  }).length

  const lag = lag1.spelare.includes(sämst.namn) ? lag1 : lag2

  return {
    namn: sämst.namn,
    total: sämst.total,
    snitt: snitt.toFixed(1),
    bakomLedaren,
    föraNäststämst,
    värstaOmgång,
    antalGångerSist,
    antalOmgangar: omgangar.length,
    lag,
  }
}

export function funStats() {
  const ranking = spelarRanking()
  const senastOmgang = omgangar[omgangar.length - 1]

  const bastaOmgangTotalt = omgangar
    .flatMap((o) =>
      [...lag1.spelare, ...lag2.spelare].map((s) => ({
        spelare: s,
        omgang: o.omgang,
        poang: o.poang[s] ?? 0,
      }))
    )
    .sort((a, b) => b.poang - a.poang)[0]

  const samstaOmgangTotalt = omgangar
    .flatMap((o) =>
      [...lag1.spelare, ...lag2.spelare].map((s) => ({
        spelare: s,
        omgang: o.omgang,
        poang: o.poang[s] ?? 0,
      }))
    )
    .sort((a, b) => a.poang - b.poang)[0]

  const senastVinnare =
    lag1.spelare.reduce((s, n) => s + (senastOmgang.poang[n] ?? 0), 0) >
    lag2.spelare.reduce((s, n) => s + (senastOmgang.poang[n] ?? 0), 0)
      ? lag1
      : lag2

  return {
    ledare: ranking[0],
    sista: ranking[ranking.length - 1],
    bastaOmgang: bastaOmgangTotalt,
    samstaOmgang: samstaOmgangTotalt,
    senastVinnare,
    antalOmgangar: omgangar.length,
  }
}
