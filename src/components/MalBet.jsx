import spelarData from '../data/spelare.json'

const ABRAHAM_FARG = '#a855f7'  // lila — Oliver
const LIEN_FARG    = '#f43f5e'  // röd — Hellman

export default function MalBet() {
  const abraham = spelarData.abraham ?? []
  const lien    = spelarData.lien    ?? []

  const totAbraham = abraham.reduce((s, h) => s + h.mal, 0)
  const totLien    = lien.reduce((s, h) => s + h.mal, 0)
  const oliverLeder = totAbraham >= totLien
  const skillnad    = Math.abs(totAbraham - totLien)

  const alleGW = Array.from(
    new Set([...abraham.map((h) => h.omgang), ...lien.map((h) => h.omgang)])
  ).sort((x, y) => x - y)

  // Ackumulerade mål per GW
  let accA = 0
  let accL = 0
  const race = alleGW.map((gw) => {
    const ah = abraham.find((h) => h.omgang === gw)
    const lh = lien.find((h) => h.omgang === gw)
    accA += ah?.mal ?? 0
    accL += lh?.mal ?? 0
    return { gw, accA, accL, malA: ah?.mal ?? 0, malL: lh?.mal ?? 0 }
  })

  const maxAcc = Math.max(accA, accL, 1)

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: '#0e1420', borderColor: '#1e2a40' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-semibold text-sm">Oliver vs Hellman</span>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: '#1e2a40', color: '#94a3b8' }}
        >
          en öl
        </span>
      </div>
      <p className="text-slate-500 text-xs mb-5">
        Flest mål · Paulos Abraham vs Kristian Lien · t.o.m. säsongsslut
      </p>

      {/* Stor scoreboard */}
      <div
        className="rounded-2xl p-5 mb-5 flex items-center justify-between"
        style={{ backgroundColor: '#ffffff06', border: '1px solid #ffffff0a' }}
      >
        {/* Abraham */}
        <div className="text-center flex-1">
          <p className="text-xs mb-1" style={{ color: ABRAHAM_FARG + 'cc' }}>Oliver backar</p>
          <p className="text-white font-bold text-sm mb-2">Paulos Abraham</p>
          <div
            className="text-6xl font-black tabular-nums"
            style={{ color: ABRAHAM_FARG }}
          >
            {totAbraham}
          </div>
          <p className="text-slate-500 text-xs mt-1">mål</p>
          <div className="flex justify-center gap-1 mt-3 flex-wrap">
            {Array.from({ length: totAbraham }).map((_, i) => (
              <span key={i} className="text-base">⚽</span>
            ))}
            {totAbraham === 0 && <span className="text-slate-600 text-xs">inga mål ännu</span>}
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center px-4">
          <span className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-1">vs</span>
          {skillnad > 0 && (
            <div
              className="text-xs font-bold px-2 py-1 rounded-full mt-1"
              style={{
                backgroundColor: (oliverLeder ? ABRAHAM_FARG : LIEN_FARG) + '20',
                color: oliverLeder ? ABRAHAM_FARG : LIEN_FARG,
              }}
            >
              +{skillnad}
            </div>
          )}
          {skillnad === 0 && (
            <div className="text-xs font-bold px-2 py-1 rounded-full mt-1 bg-white/5 text-slate-400">
              Lika
            </div>
          )}
        </div>

        {/* Lien */}
        <div className="text-center flex-1">
          <p className="text-xs mb-1" style={{ color: LIEN_FARG + 'cc' }}>Hellman backar</p>
          <p className="text-white font-bold text-sm mb-2">Kristian Lien</p>
          <div
            className="text-6xl font-black tabular-nums"
            style={{ color: LIEN_FARG }}
          >
            {totLien}
          </div>
          <p className="text-slate-500 text-xs mt-1">mål</p>
          <div className="flex justify-center gap-1 mt-3 flex-wrap">
            {Array.from({ length: totLien }).map((_, i) => (
              <span key={i} className="text-base">⚽</span>
            ))}
            {totLien === 0 && <span className="text-slate-600 text-xs">inga mål ännu</span>}
          </div>
        </div>
      </div>

      {/* Ledarbanner */}
      <div
        className="rounded-xl p-3 mb-5 flex items-center gap-3"
        style={{
          backgroundColor: (oliverLeder ? ABRAHAM_FARG : LIEN_FARG) + '15',
          borderLeft: `3px solid ${oliverLeder ? ABRAHAM_FARG : LIEN_FARG}`,
        }}
      >
        <span className="text-lg">🍺</span>
        <div>
          <p className="text-white font-bold text-sm">
            {oliverLeder ? 'Oliver' : 'Hellman'} leder — {skillnad === 0 ? 'lika just nu' : `${skillnad} mål före`}
          </p>
          <p className="text-slate-400 text-xs">
            {oliverLeder ? 'Hellman' : 'Oliver'} är skyldig en öl om det håller till säsongsslut
          </p>
        </div>
      </div>

      {/* Race-bars per GW */}
      {race.length > 0 && (
        <div>
          <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-3">Ackumulerade mål</p>
          <div className="flex flex-col gap-2">
            {race.map(({ gw, accA: a, accL: l, malA, malL }) => (
              <div key={gw}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 text-[11px] w-8 shrink-0">GW{gw}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                        style={{
                          width: `${Math.max((a / maxAcc) * 100, 4)}%`,
                          backgroundColor: ABRAHAM_FARG,
                          minWidth: a > 0 ? 28 : 0,
                        }}
                      >
                        {a > 0 && <span className="text-[10px] font-bold text-white">{a}</span>}
                      </div>
                      {malA > 0 && (
                        <span className="text-[11px]" style={{ color: ABRAHAM_FARG }}>
                          +{malA} ⚽
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                        style={{
                          width: `${Math.max((l / maxAcc) * 100, 4)}%`,
                          backgroundColor: LIEN_FARG,
                          minWidth: l > 0 ? 28 : 0,
                        }}
                      >
                        {l > 0 && <span className="text-[10px] font-bold text-white">{l}</span>}
                      </div>
                      {malL > 0 && (
                        <span className="text-[11px]" style={{ color: LIEN_FARG }}>
                          +{malL} ⚽
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ABRAHAM_FARG }} />
              <span className="text-slate-400 text-xs">Abraham</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIEN_FARG }} />
              <span className="text-slate-400 text-xs">Lien</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
