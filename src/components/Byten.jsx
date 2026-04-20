import { useState } from 'react'
import transfers from '../data/transfers.json'
import friaByten from '../data/fria-byten.json'
import { lag1, lag2 } from '../data/liga'

const SPELARE_FARG = {}
for (const s of lag1.spelare) SPELARE_FARG[s] = lag1.farg
for (const s of lag2.spelare) SPELARE_FARG[s] = lag2.farg

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

  const toggleGW = (gw) =>
    setOppna((prev) => {
      const next = new Set(prev)
      next.has(gw) ? next.delete(gw) : next.add(gw)
      return next
    })

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Spelarbyten</h2>
          <p className="text-slate-400 text-sm">Vem köpte och sålde vad per omgång</p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
          {friaByten.map(({ manager, fria }) => {
            const farg = SPELARE_FARG[manager] ?? '#6b7280'
            return (
              <div key={manager} className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ backgroundColor: '#0e1712' }}>
                <span className="text-xs font-medium" style={{ color: farg }}>{manager}</span>
                <span className="text-xs font-bold text-white">{fria}</span>
                <span className="text-xs text-slate-600">ft</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        {gws.map((gw) => {
          const managers = Object.entries(perGW[gw])
          const oppet = oppna.has(gw)
          const totalByten = managers.reduce((s, [, b]) => s + b.length, 0)

          return (
            <div key={gw} className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e3a28' }}>
              <button
                onClick={() => toggleGW(gw)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                style={{ backgroundColor: oppet ? '#0e1712' : '#0a0f0d' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">GW{gw}</span>
                  <span className="text-xs text-slate-500">{totalByten} byte{totalByten !== 1 ? 'n' : ''}</span>
                </div>
                <span className="text-slate-500 text-xs">{oppet ? '▲' : '▼'}</span>
              </button>

              {oppet && (
                <div className="px-4 pb-4 pt-2 space-y-2" style={{ backgroundColor: '#0e1712' }}>
                  {managers.map(([manager, byten]) => {
                    const farg = SPELARE_FARG[manager] ?? '#6b7280'
                    return (
                      <div key={manager} className="rounded-lg p-3" style={{ backgroundColor: '#121a16' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: farg + '25', color: farg }}
                          >
                            {manager}
                          </span>
                          <span className="text-slate-600 text-xs">{byten.length} byte{byten.length > 1 ? 'n' : ''}</span>
                        </div>
                        <div className="space-y-1.5">
                          {byten.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="text-red-400 font-medium truncate max-w-[140px]" title={b.out}>{b.out}</span>
                              <span className="text-slate-600 text-xs shrink-0">{b.outCost}M</span>
                              <span className="text-slate-500 shrink-0">→</span>
                              <span className="text-green-400 font-medium truncate max-w-[140px]" title={b.in}>{b.in}</span>
                              <span className="text-slate-600 text-xs shrink-0">{b.inCost}M</span>
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
    </div>
  )
}
