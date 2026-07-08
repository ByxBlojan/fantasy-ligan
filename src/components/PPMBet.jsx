import { useState } from 'react'
import spelarData from '../data/spelare.json'

const ASORO_FARG  = '#f97316'
const BESARA_FARG = '#3b82f6'

function ppm(spelare) {
  const totMin = spelare.reduce((s, h) => s + h.minuter, 0)
  const totPoa = spelare.reduce((s, h) => s + h.poang, 0)
  return { totMin, totPoa, ppm: totMin > 0 ? totPoa / totMin : 0 }
}

export default function PPMBet() {
  const asoro  = spelarData.asoro  ?? []
  const besara = spelarData.besara ?? []

  const a = ppm(asoro)
  const b = ppm(besara)

  const maxPPM  = Math.max(a.ppm, b.ppm, 0.001)
  const aBredd  = Math.round((a.ppm / maxPPM) * 100)
  const bBredd  = Math.round((b.ppm / maxPPM) * 100)
  const aLeder  = a.ppm >= b.ppm

  const alleGW = Array.from(
    new Set([...asoro.map((h) => h.omgang), ...besara.map((h) => h.omgang)])
  ).sort((x, y) => x - y)

  const [expanderad, setExpanderad] = useState(false)
  const synligaGW = expanderad ? alleGW : alleGW.slice(-1)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="text-white font-semibold text-xs sm:text-sm">Manne vs Oliver</span>
        <span
          className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border shrink-0"
          style={{
            backgroundColor: 'rgba(74, 222, 128, 0.15)',
            borderColor: 'rgba(74, 222, 128, 0.3)',
            color: '#4ade80',
          }}
        >
          PPM-bet
        </span>
      </div>
      <p className="text-slate-500 text-[11px] sm:text-xs mb-5">
        Flest fantasy-poäng per spelad minut · t.o.m. Asoros kontrakt löper ut
      </p>

      {/* Duell-kort */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5">
        {[
          { label: 'Manne backar', namn: 'Joel Asoro', stats: a, farg: ASORO_FARG, data: asoro },
          { label: 'Oliver backar', namn: 'Nahir Besara', stats: b, farg: BESARA_FARG, data: besara },
        ].map(({ label, namn, stats, farg, data }) => (
          <div
            key={namn}
            className="rounded-xl p-3 sm:p-4 border backdrop-blur-sm"
            style={{ backgroundColor: farg + '10', borderColor: farg + '30' }}
          >
            <p className="text-[10px] sm:text-xs mb-0.5" style={{ color: farg + 'cc' }}>{label}</p>
            <p className="text-white font-bold text-xs sm:text-sm mb-3 truncate">{namn}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-slate-400">Poäng</span>
                <span className="text-white font-semibold tabular-nums">{stats.totPoa}p</span>
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-slate-400">Minuter</span>
                <span className="text-white font-semibold tabular-nums">{stats.totMin} min</span>
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-slate-400">Mål / Ass</span>
                <span className="text-white font-semibold tabular-nums">
                  {data.reduce((s, h) => s + h.mal, 0)} / {data.reduce((s, h) => s + h.assist, 0)}
                </span>
              </div>
              <div
                className="mt-1 rounded-full px-2 py-0.5 text-center text-[11px] sm:text-xs font-bold border tabular-nums"
                style={{
                  backgroundColor: farg + '20',
                  borderColor: farg + '35',
                  color: farg,
                }}
              >
                {stats.totMin > 0 ? stats.ppm.toFixed(3) : '–'} ppm
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PPM-bar */}
      <div className="mb-5">
        <p className="text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-wider mb-2">Poäng per minut</p>
        <div className="flex flex-col gap-2">
          {[
            { namn: 'Asoro', bredd: aBredd, ppm: a.ppm, farg: ASORO_FARG },
            { namn: 'Besara', bredd: bBredd, ppm: b.ppm, farg: BESARA_FARG },
          ].map(({ namn, bredd, ppm: v, farg }) => (
            <div key={namn} className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] sm:text-xs w-12 sm:w-14 shrink-0">{namn}</span>
              <div className="flex-1 h-5 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${bredd}%`,
                    background: `linear-gradient(90deg, ${farg}cc, ${farg})`,
                    boxShadow: `0 0 12px ${farg}88`,
                  }}
                >
                  {bredd > 25 && (
                    <span className="text-[10px] font-bold text-white/95 tabular-nums">
                      {v.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ledare-banner */}
      <div
        className="rounded-xl p-3 mb-5 flex items-center gap-3 border-l-2 backdrop-blur-sm"
        style={{
          backgroundColor: (aLeder ? ASORO_FARG : BESARA_FARG) + '12',
          borderColor: aLeder ? ASORO_FARG : BESARA_FARG,
        }}
      >
        <span className="text-lg">🏆</span>
        <div className="min-w-0">
          <p className="text-white font-bold text-xs sm:text-sm">
            {aLeder ? 'Manne' : 'Oliver'} leder
          </p>
          <p className="text-slate-400 text-[10px] sm:text-xs tabular-nums truncate">
            {aLeder ? 'Asoro' : 'Besara'} {aLeder ? a.ppm.toFixed(3) : b.ppm.toFixed(3)}
            {' · '}
            {aLeder ? 'Besara' : 'Asoro'} {aLeder ? b.ppm.toFixed(3) : a.ppm.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Per omgång */}
      {alleGW.length > 0 && (
        <div>
          <button
            onClick={() => setExpanderad((v) => !v)}
            className="flex items-center gap-2 mb-2 w-full text-left hover:opacity-80 transition-opacity"
          >
            <p className="text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-wider">Per omgång</p>
            <span
              className="text-slate-600 text-[11px] transition-transform"
              style={{ transform: expanderad ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▼
            </span>
          </button>
          <div className="rounded-xl overflow-hidden border border-white/[0.05]">
            <table className="w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="text-left px-2 sm:px-3 py-2 text-slate-500 font-medium">GW</th>
                  <th className="px-2 sm:px-3 py-2 text-right font-medium" style={{ color: ASORO_FARG }}>Asoro</th>
                  <th className="px-2 sm:px-3 py-2 text-right font-medium" style={{ color: ASORO_FARG }}>Min</th>
                  <th className="px-2 sm:px-3 py-2 text-right font-medium" style={{ color: BESARA_FARG }}>Besara</th>
                  <th className="px-2 sm:px-3 py-2 text-right font-medium" style={{ color: BESARA_FARG }}>Min</th>
                </tr>
              </thead>
              <tbody>
                {synligaGW.map((gw, i) => {
                  const ah = asoro.find((h) => h.omgang === gw)
                  const bh = besara.find((h) => h.omgang === gw)
                  return (
                    <tr key={gw} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                      <td className="px-2 sm:px-3 py-2 text-slate-400">GW{gw}</td>
                      <td className="px-2 sm:px-3 py-2 text-right text-white font-medium tabular-nums">{ah ? `${ah.poang}p` : '–'}</td>
                      <td className="px-2 sm:px-3 py-2 text-right text-slate-400 tabular-nums">{ah ? `${ah.minuter}'` : '–'}</td>
                      <td className="px-2 sm:px-3 py-2 text-right text-white font-medium tabular-nums">{bh ? `${bh.poang}p` : '–'}</td>
                      <td className="px-2 sm:px-3 py-2 text-right text-slate-400 tabular-nums">{bh ? `${bh.minuter}'` : '–'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
