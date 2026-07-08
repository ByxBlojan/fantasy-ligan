import { useState } from 'react'
import spelarData from '../data/spelare.json'

const ABRAHAM_FARG = '#a855f7'
const LIEN_FARG    = '#f43f5e'

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
  const [expanderad, setExpanderad] = useState(false)
  const synligaGW = expanderad ? race : race.slice(-1)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="text-white font-semibold text-xs sm:text-sm">Oliver vs Hellman</span>
        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border bg-white/[0.04] border-white/10 text-slate-300 shrink-0">
          en öl
        </span>
      </div>
      <p className="text-slate-500 text-[11px] sm:text-xs mb-5">
        Flest mål · Paulos Abraham vs Kristian Lien · t.o.m. säsongsslut
      </p>

      {/* Stor scoreboard */}
      <div className="rounded-2xl p-4 sm:p-5 mb-5 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex items-center justify-between gap-2">
        {/* Abraham */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs mb-1 truncate" style={{ color: ABRAHAM_FARG + 'cc' }}>Oliver backar</p>
          <p className="text-white font-bold text-[11px] sm:text-sm mb-2 truncate">Paulos Abraham</p>
          <div
            className="text-4xl sm:text-6xl font-black tabular-nums leading-none"
            style={{
              color: ABRAHAM_FARG,
              textShadow: `0 0 30px ${ABRAHAM_FARG}55`,
            }}
          >
            {totAbraham}
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs mt-1">mål</p>
          <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
            {Array.from({ length: totAbraham }).map((_, i) => (
              <span key={i} className="text-sm sm:text-base">⚽</span>
            ))}
            {totAbraham === 0 && <span className="text-slate-600 text-[10px] sm:text-xs">inga mål</span>}
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center px-1 sm:px-4 shrink-0">
          <span className="text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">vs</span>
          {skillnad > 0 && (
            <div
              className="text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full mt-1 border tabular-nums"
              style={{
                backgroundColor: (oliverLeder ? ABRAHAM_FARG : LIEN_FARG) + '20',
                borderColor: (oliverLeder ? ABRAHAM_FARG : LIEN_FARG) + '40',
                color: oliverLeder ? ABRAHAM_FARG : LIEN_FARG,
              }}
            >
              +{skillnad}
            </div>
          )}
          {skillnad === 0 && (
            <div className="text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full mt-1 bg-white/[0.05] border border-white/10 text-slate-400">
              Lika
            </div>
          )}
        </div>

        {/* Lien */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs mb-1 truncate" style={{ color: LIEN_FARG + 'cc' }}>Hellman backar</p>
          <p className="text-white font-bold text-[11px] sm:text-sm mb-2 truncate">Kristian Lien</p>
          <div
            className="text-4xl sm:text-6xl font-black tabular-nums leading-none"
            style={{
              color: LIEN_FARG,
              textShadow: `0 0 30px ${LIEN_FARG}55`,
            }}
          >
            {totLien}
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs mt-1">mål</p>
          <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
            {Array.from({ length: totLien }).map((_, i) => (
              <span key={i} className="text-sm sm:text-base">⚽</span>
            ))}
            {totLien === 0 && <span className="text-slate-600 text-[10px] sm:text-xs">inga mål</span>}
          </div>
        </div>
      </div>

      {/* Ledarbanner */}
      <div
        className="rounded-xl p-3 mb-5 flex items-center gap-3 border-l-2 backdrop-blur-sm"
        style={{
          backgroundColor: (oliverLeder ? ABRAHAM_FARG : LIEN_FARG) + '12',
          borderColor: oliverLeder ? ABRAHAM_FARG : LIEN_FARG,
        }}
      >
        <span className="text-lg">🍺</span>
        <div className="min-w-0">
          <p className="text-white font-bold text-xs sm:text-sm">
            {oliverLeder ? 'Oliver' : 'Hellman'} leder — {skillnad === 0 ? 'lika just nu' : `${skillnad} mål före`}
          </p>
          <p className="text-slate-400 text-[10px] sm:text-xs">
            {oliverLeder ? 'Hellman' : 'Oliver'} skyldig en öl om det håller
          </p>
        </div>
      </div>

      {/* Race-bars per GW */}
      {race.length > 0 && (
        <div>
          <button
            onClick={() => setExpanderad((v) => !v)}
            className="flex items-center gap-2 mb-3 w-full text-left hover:opacity-80 transition-opacity"
          >
            <p className="text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-wider">Ackumulerade mål</p>
            <span
              className="text-slate-600 text-[11px] transition-transform"
              style={{ transform: expanderad ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▼
            </span>
          </button>
          <div className="flex flex-col gap-2">
            {synligaGW.map(({ gw, accA: a, accL: l, malA, malL }) => (
              <div key={gw}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 text-[10px] sm:text-[11px] w-8 shrink-0 tabular-nums">GW{gw}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                        style={{
                          width: `${Math.max((a / maxAcc) * 100, 4)}%`,
                          background: `linear-gradient(90deg, ${ABRAHAM_FARG}cc, ${ABRAHAM_FARG})`,
                          boxShadow: `0 0 8px ${ABRAHAM_FARG}66`,
                          minWidth: a > 0 ? 28 : 0,
                        }}
                      >
                        {a > 0 && <span className="text-[10px] font-bold text-white tabular-nums">{a}</span>}
                      </div>
                      {malA > 0 && (
                        <span className="text-[10px] sm:text-[11px]" style={{ color: ABRAHAM_FARG }}>
                          +{malA} ⚽
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                        style={{
                          width: `${Math.max((l / maxAcc) * 100, 4)}%`,
                          background: `linear-gradient(90deg, ${LIEN_FARG}cc, ${LIEN_FARG})`,
                          boxShadow: `0 0 8px ${LIEN_FARG}66`,
                          minWidth: l > 0 ? 28 : 0,
                        }}
                      >
                        {l > 0 && <span className="text-[10px] font-bold text-white tabular-nums">{l}</span>}
                      </div>
                      {malL > 0 && (
                        <span className="text-[10px] sm:text-[11px]" style={{ color: LIEN_FARG }}>
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
              <span className="text-slate-400 text-[10px] sm:text-xs">Abraham</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIEN_FARG }} />
              <span className="text-slate-400 text-[10px] sm:text-xs">Lien</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
