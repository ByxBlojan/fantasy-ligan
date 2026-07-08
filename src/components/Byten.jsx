import { useState } from 'react'
import transfers from '../data/transfers.json'
import friaByten from '../data/fria-byten.json'
import { lag1, lag2 } from '../data/liga'
import Card from './Card'

const SPELARE_FARG = {}
for (const s of lag1.spelare) SPELARE_FARG[s] = lag1.farg
for (const s of lag2.spelare) SPELARE_FARG[s] = lag2.farg

const SYNLIGA_GW_DEFAULT = 1

export default function Byten() {
  if (!transfers.length) return null

  const perGW = transfers.reduce((acc, t) => {
    if (!acc[t.gw]) acc[t.gw] = {}
    if (!acc[t.gw][t.manager]) acc[t.gw][t.manager] = []
    acc[t.gw][t.manager].push(t)
    return acc
  }, {})

  const gws = Object.keys(perGW).map(Number).sort((a, b) => b - a)
  const sistaGW = gws[0]

  const [oppna, setOppna] = useState(new Set([sistaGW]))
  const [visaAlla, setVisaAlla] = useState(false)

  const synligaGws = visaAlla ? gws : gws.slice(0, SYNLIGA_GW_DEFAULT)
  const doldaAntal = gws.length - synligaGws.length

  const toggleGW = (gw) =>
    setOppna((prev) => {
      const next = new Set(prev)
      next.has(gw) ? next.delete(gw) : next.add(gw)
      return next
    })

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Spelarbyten</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Vem köpte och sålde vad</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-end shrink-0 max-w-[60%]">
          {friaByten.map(({ manager, fria }) => {
            const farg = SPELARE_FARG[manager] ?? '#6b7280'
            return (
              <div
                key={manager}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 border backdrop-blur-sm"
                style={{ backgroundColor: farg + '10', borderColor: farg + '25' }}
              >
                <span className="text-[10px] font-medium" style={{ color: farg }}>{manager}</span>
                <span className="text-[10px] font-bold text-white tabular-nums">{fria}</span>
                <span className="text-[9px] text-slate-600">ft</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        {synligaGws.map((gw) => {
          const managers = Object.entries(perGW[gw])
          const oppet = oppna.has(gw)
          const totalByten = managers.reduce((s, [, b]) => s + b.length, 0)
          const arSenaste = gw === sistaGW

          return (
            <div
              key={gw}
              className="rounded-xl overflow-hidden border transition-colors"
              style={{
                borderColor: arSenaste ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.06)',
                backgroundColor: oppet ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
              }}
            >
              <button
                onClick={() => toggleGW(gw)}
                className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white tabular-nums">GW{gw}</span>
                  {arSenaste && (
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Senaste
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {totalByten} byte{totalByten !== 1 ? 'n' : ''}
                  </span>
                </div>
                <span
                  className="text-slate-500 text-[10px] transition-transform"
                  style={{ transform: oppet ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▼
                </span>
              </button>

              {oppet && (
                <div className="px-3 pb-3 pt-1 space-y-1.5">
                  {managers.map(([manager, byten]) => {
                    const farg = SPELARE_FARG[manager] ?? '#6b7280'
                    return (
                      <div
                        key={manager}
                        className="rounded-lg p-2.5 border backdrop-blur-sm"
                        style={{ backgroundColor: farg + '08', borderColor: farg + '20' }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold border"
                            style={{
                              backgroundColor: farg + '20',
                              borderColor: farg + '35',
                              color: farg,
                            }}
                          >
                            {manager}
                          </span>
                          <span className="text-slate-600 text-[10px]">
                            {byten.length} byte{byten.length > 1 ? 'n' : ''}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {byten.map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs">
                              <span className="text-red-400/90 font-medium truncate flex-1" title={b.out}>{b.out}</span>
                              <span className="text-slate-600 text-[10px] shrink-0 tabular-nums">{b.outCost}M</span>
                              <span className="text-slate-500 shrink-0 text-[10px]">→</span>
                              <span className="text-emerald-400/90 font-medium truncate flex-1" title={b.in}>{b.in}</span>
                              <span className="text-slate-600 text-[10px] shrink-0 tabular-nums">{b.inCost}M</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {doldaAntal > 0 && !visaAlla && (
        <button
          onClick={() => setVisaAlla(true)}
          className="mt-3 w-full text-xs sm:text-sm text-slate-400 hover:text-white transition-colors py-2 rounded-lg border border-white/[0.06] hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
        >
          Visa {doldaAntal} äldre omgång{doldaAntal !== 1 ? 'ar' : ''}
        </button>
      )}
      {visaAlla && gws.length > SYNLIGA_GW_DEFAULT && (
        <button
          onClick={() => setVisaAlla(false)}
          className="mt-3 w-full text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
        >
          Fäll ihop
        </button>
      )}
    </Card>
  )
}
