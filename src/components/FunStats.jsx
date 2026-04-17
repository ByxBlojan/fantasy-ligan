import { funStats, lag1, lag2, poangPerOmgangLag, omgangar } from '../data/liga'

function StatKort({ emoji, titel, varde, sub, farg }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ backgroundColor: '#0f1e13', border: `1px solid ${farg || '#1e3a28'}30` }}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{titel}</div>
      <div className="text-white font-bold text-lg leading-tight" style={{ color: farg }}>
        {varde}
      </div>
      {sub && <div className="text-slate-500 text-xs">{sub}</div>}
    </div>
  )
}

export default function FunStats() {
  const stats = funStats()

  const lag1PerOmgang = poangPerOmgangLag(lag1)
  const lag2PerOmgang = poangPerOmgangLag(lag2)

  // Räkna omgångssegrar
  let lag1Segrar = 0
  let lag2Segrar = 0
  lag1PerOmgang.forEach((o, i) => {
    if (o.poang > lag2PerOmgang[i].poang) lag1Segrar++
    else if (o.poang < lag2PerOmgang[i].poang) lag2Segrar++
  })

  // Snittpoäng per omgång för lagen
  const snitt1 = Math.round(lag1PerOmgang.reduce((s, o) => s + o.poang, 0) / lag1PerOmgang.length)
  const snitt2 = Math.round(lag2PerOmgang.reduce((s, o) => s + o.poang, 0) / lag2PerOmgang.length)

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <h2 className="text-lg font-bold text-white mb-1">Fun stats</h2>
      <p className="text-slate-400 text-sm mb-6">Highlights från säsongen</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatKort
          emoji="👑"
          titel="Ligaledare"
          varde={stats.ledare.namn}
          sub={`${stats.ledare.total}p totalt`}
          farg={stats.ledare.farg}
        />
        <StatKort
          emoji="💀"
          titel="Sista plats"
          varde={stats.sista.namn}
          sub={`${stats.sista.total}p totalt`}
          farg="#ef4444"
        />
        <StatKort
          emoji="🔥"
          titel="Bästa omgång"
          varde={`${stats.bastaOmgang.spelare}`}
          sub={`${stats.bastaOmgang.poang}p i omg ${stats.bastaOmgang.omgang}`}
          farg="#fbbf24"
        />
        <StatKort
          emoji="🥶"
          titel="Sämsta omgång"
          varde={`${stats.samstaOmgang.spelare}`}
          sub={`${stats.samstaOmgang.poang}p i omg ${stats.samstaOmgang.omgang}`}
          farg="#94a3b8"
        />
        <StatKort
          emoji="⚔️"
          titel={`${lag1.namn} omgångssegrar`}
          varde={`${lag1Segrar} av ${omgangar.length}`}
          sub={`snitt ${snitt1}p/omg`}
          farg={lag1.farg}
        />
        <StatKort
          emoji="⚔️"
          titel={`${lag2.namn} omgångssegrar`}
          varde={`${lag2Segrar} av ${omgangar.length}`}
          sub={`snitt ${snitt2}p/omg`}
          farg={lag2.farg}
        />
        <StatKort
          emoji="🏆"
          titel="Senast vann omgången"
          varde={stats.senastVinnare.namn}
          sub={`Omgång ${omgangar.length}`}
          farg={stats.senastVinnare.farg}
        />
        <StatKort
          emoji="📊"
          titel="Omgångar spelade"
          varde={stats.antalOmgangar}
          sub="av ~30 totalt"
          farg="#22c55e"
        />
      </div>
    </div>
  )
}
