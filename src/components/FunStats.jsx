import { funStats, lag1, lag2, poangPerOmgangLag, omgangar } from '../data/liga'
import Card, { SectionHeader } from './Card'

function HeroKort({ emoji, titel, spelare, poang, omgang, farg }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 border backdrop-blur-sm"
      style={{
        backgroundColor: farg + '08',
        borderColor: farg + '30',
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: farg }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl sm:text-2xl">{emoji}</span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">{titel}</span>
        </div>
        <div
          className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-1"
          style={{ color: farg, textShadow: `0 0 24px ${farg}44` }}
        >
          {poang}p
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold text-sm sm:text-base">{spelare}</span>
          <span className="text-slate-500 text-[10px] sm:text-xs tabular-nums">omg {omgang}</span>
        </div>
      </div>
    </div>
  )
}

function MiniRad({ emoji, label, varde, sub, farg }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <span className="text-base sm:text-lg shrink-0">{emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider leading-none mb-0.5">{label}</div>
        <div className="font-bold text-xs sm:text-sm truncate" style={{ color: farg }}>
          {varde}
        </div>
      </div>
      {sub && (
        <span className="text-[10px] sm:text-xs text-slate-500 tabular-nums shrink-0">{sub}</span>
      )}
    </div>
  )
}

export default function FunStats() {
  const stats = funStats()

  const lag1PerOmgang = poangPerOmgangLag(lag1)
  const lag2PerOmgang = poangPerOmgangLag(lag2)

  let lag1Segrar = 0
  let lag2Segrar = 0
  let oavgjort = 0
  lag1PerOmgang.forEach((o, i) => {
    if (o.poang > lag2PerOmgang[i].poang) lag1Segrar++
    else if (o.poang < lag2PerOmgang[i].poang) lag2Segrar++
    else oavgjort++
  })

  const totalMatcher = lag1Segrar + lag2Segrar + oavgjort
  const lag1Andel = totalMatcher > 0 ? (lag1Segrar / totalMatcher) * 100 : 50

  return (
    <Card>
      <SectionHeader title="Fun stats" sub="Highlights från säsongen" />

      {/* Hero: bästa/sämsta omgången */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
        <HeroKort
          emoji="🔥"
          titel="Bästa omgång"
          spelare={stats.bastaOmgang.spelare}
          poang={stats.bastaOmgang.poang}
          omgang={stats.bastaOmgang.omgang}
          farg="#fbbf24"
        />
        <HeroKort
          emoji="🥶"
          titel="Sämsta omgång"
          spelare={stats.samstaOmgang.spelare}
          poang={stats.samstaOmgang.poang}
          omgang={stats.samstaOmgang.omgang}
          farg="#94a3b8"
        />
      </div>

      {/* Omgångssegrar - VS bar */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Omgångssegrar</span>
          <span className="text-[10px] text-slate-500 tabular-nums">{omgangar.length} spelade</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base tabular-nums shrink-0" style={{ color: lag1.farg }}>
            {lag1Segrar}
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden flex">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${lag1Andel}%`,
                background: `linear-gradient(90deg, ${lag1.farg}, ${lag1.farg}cc)`,
                boxShadow: `0 0 8px ${lag1.farg}66`,
              }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${100 - lag1Andel}%`,
                background: `linear-gradient(90deg, ${lag2.farg}cc, ${lag2.farg})`,
                boxShadow: `0 0 8px ${lag2.farg}66`,
              }}
            />
          </div>
          <span className="font-bold text-sm sm:text-base tabular-nums shrink-0" style={{ color: lag2.farg }}>
            {lag2Segrar}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-500">{lag1.namn}</span>
          {oavgjort > 0 && <span className="text-[10px] text-slate-600">{oavgjort} oavgj.</span>}
          <span className="text-[10px] text-slate-500">{lag2.namn}</span>
        </div>
      </div>

      {/* Kompakta rader */}
      <div className="space-y-1.5">
        <MiniRad
          emoji="👑"
          label="Ligaledare"
          varde={stats.ledare.namn}
          sub={`${stats.ledare.total}p`}
          farg={stats.ledare.farg}
        />
        <MiniRad
          emoji="💀"
          label="Sista plats"
          varde={stats.sista.namn}
          sub={`${stats.sista.total}p`}
          farg="#ef4444"
        />
        <MiniRad
          emoji="🏆"
          label="Senast vann omgången"
          varde={stats.senastVinnare.namn}
          sub={`omg ${omgangar.length}`}
          farg={stats.senastVinnare.farg}
        />
      </div>
    </Card>
  )
}
