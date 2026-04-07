import { lag1, lag2, totalpoangLag, totalpoangSpelare } from '../data/liga'

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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {lag1.spelare.map((s) => (
            <SpelarKort key={s} namn={s} farg={lag1.farg} />
          ))}
        </div>
        <div className="space-y-2">
          {lag2.spelare.map((s) => (
            <SpelarKort key={s} namn={s} farg={lag2.farg} />
          ))}
        </div>
      </div>
    </div>
  )
}
