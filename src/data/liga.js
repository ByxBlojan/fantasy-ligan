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
  return sidebets.map(({ spelare1, spelare2, belopp }) => {
    const p1 = totalpoangSpelare(spelare1)
    const p2 = totalpoangSpelare(spelare2)
    const ledare = p1 >= p2 ? spelare1 : spelare2
    const forlorare = p1 >= p2 ? spelare2 : spelare1
    const skillnad = Math.abs(p1 - p2)
    const lag1vinner = lag1.spelare.includes(ledare)
    return { spelare1, spelare2, belopp, ledare, forlorare, skillnad, farg: lag1vinner ? lag1.farg : lag2.farg }
  })
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
