import { lag1, lag2, totalpoangLag, totalpoangSpelare, omgangar } from '../data/liga'

const TOTAL_GW = 30

function beraknaOdds() {
  const spelade = omgangar.length
  if (spelade === 0) return null
  const kvar = TOTAL_GW - spelade

  function projekteradTotal(spelare) {
    const total = totalpoangSpelare(spelare)
    const snitt = total / spelade
    return total + snitt * kvar
  }

  const proj1 = lag1.spelare.reduce((s, n) => s + projekteradTotal(n), 0)
  const proj2 = lag2.spelare.reduce((s, n) => s + projekteradTotal(n), 0)
  const sum = proj1 + proj2
  const prob1 = proj1 / sum
  const prob2 = proj2 / sum

  return {
    kvar,
    spelade,
    proj1: Math.round(proj1),
    proj2: Math.round(proj2),
    odds1: (1 / prob1).toFixed(2),
    odds2: (1 / prob2).toFixed(2),
    favorit: prob1 >= prob2 ? 1 : 2,
  }
}

function SpelarKort({ namn, farg }) {
  const poang = totalpoangSpelare(namn)
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
      style={{ backgroundColor: farg + '18', borderLeft: `3px solid ${farg}` }}
    >
      <span className="font-medium text-slate-200">{namn}</span>
      <span className="font-bold tabular-nums" style={{ color: farg }}>
        {poang}p
      </span>
    </div>
  )
}

export default function TeamBattle() {
  const odds = beraknaOdds()
  const poang1 = totalpoangLag(lag1)
  const poang2 = totalpoangLag(lag2)
  const leder = poang1 > poang2 ? 1 : poang2 > poang1 ? 2 : 0
  const max = Math.max(poang1, poang2)
  const bar1 = (poang1 / max) * 100
  const bar2 = (poang2 / max) * 100

  return (
    <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}>
      {/* Laget vs laget */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6">
        {/* Lag 1 */}
        <div className="text-center">
          <div
            className="text-5xl font-black tabular-nums"
            style={{ color: lag1.farg }}
          >
            {poang1}
          </div>
          <div className="font-bold text-white mt-1">{lag1.namn}</div>
          {leder === 1 && (
            <span className="text-xs text-yellow-400 font-semibold">👑 Leder</span>
          )}
        </div>

        {/* VS */}
        <div className="text-center">
          <div className="text-2xl font-black text-slate-500">VS</div>
          <div className="text-xs text-slate-500 mt-1">Totalt</div>
        </div>

        {/* Lag 2 */}
        <div className="text-center">
          <div
            className="text-5xl font-black tabular-nums"
            style={{ color: lag2.farg }}
          >
            {poang2}
          </div>
          <div className="font-bold text-white mt-1">{lag2.namn}</div>
          {leder === 2 && (
            <span className="text-xs text-yellow-400 font-semibold">👑 Leder</span>
          )}
        </div>
      </div>

      {/* Progressbar */}
      <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-6">
        <div
          className="rounded-l-full transition-all"
          style={{ width: `${bar1}%`, backgroundColor: lag1.farg }}
        />
        <div
          className="rounded-r-full transition-all"
          style={{ width: `${bar2}%`, backgroundColor: lag2.farg }}
        />
      </div>

      {/* Spelarlista */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          {[...lag1.spelare]
            .sort((a, b) => totalpoangSpelare(b) - totalpoangSpelare(a))
            .map((s) => (
              <SpelarKort key={s} namn={s} farg={lag1.farg} />
            ))}
        </div>
        <div className="space-y-2">
          {[...lag2.spelare]
            .sort((a, b) => totalpoangSpelare(b) - totalpoangSpelare(a))
            .map((s) => (
              <SpelarKort key={s} namn={s} farg={lag2.farg} />
            ))}
        </div>
      </div>

      {/* Live odds */}
      {odds && (
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: '#0d1f18', borderColor: '#1e3a28' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live odds — Vinnare 2025</span>
            <span className="text-xs text-slate-500">{odds.spelade}/{TOTAL_GW} omg. spelade</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Lag 1 */}
            <div
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: lag1.farg + '15', border: `1px solid ${lag1.farg}40` }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: lag1.farg }}>{lag1.namn}</p>
              <p
                className="text-3xl font-black tabular-nums"
                style={{ color: lag1.farg }}
              >
                {odds.odds1}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Proj. {odds.proj1}p</p>
              {odds.favorit === 1 && (
                <span className="text-[10px] font-bold text-yellow-400 mt-1 block">FAVORIT</span>
              )}
            </div>

            {/* Lag 2 */}
            <div
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: lag2.farg + '15', border: `1px solid ${lag2.farg}40` }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: lag2.farg }}>{lag2.namn}</p>
              <p
                className="text-3xl font-black tabular-nums"
                style={{ color: lag2.farg }}
              >
                {odds.odds2}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Proj. {odds.proj2}p</p>
              {odds.favorit === 2 && (
                <span className="text-[10px] font-bold text-yellow-400 mt-1 block">FAVORIT</span>
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-600 mt-3 text-center">
            Beräknat på snittpoäng × {odds.kvar} kvar. Uppdateras varje omgång.
          </p>
        </div>
      )}
    </div>
  )
}
