import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { lag1, lag2, omgangar } from '../data/liga'
import Card, { SectionHeader } from './Card'

const SPELARE_FARG = {
  Oliver:  '#4ade80',
  Alle:    '#a3e635',
  Josef:   '#34d399',
  Magnus:  '#2dd4bf',
  Erik:    '#60a5fa',
  Hellman: '#a78bfa',
  Manne:   '#f472b6',
  Lindmark:'#fb923c',
}

const ALLA_SPELARE = [
  ...lag1.spelare.map((s) => ({ namn: s, farg: SPELARE_FARG[s] ?? lag1.farg, lag: lag1.namn })),
  ...lag2.spelare.map((s) => ({ namn: s, farg: SPELARE_FARG[s] ?? lag2.farg, lag: lag2.namn })),
]

const ackumulerat = {}
ALLA_SPELARE.forEach(({ namn }) => { ackumulerat[namn] = 0 })

const chartData = omgangar.map((o) => {
  const row = { name: `Omg ${o.omgang}` }
  ALLA_SPELARE.forEach(({ namn }) => {
    ackumulerat[namn] += o.poang[namn] ?? 0
    row[namn] = ackumulerat[namn]
  })
  return row
})

const CustomTooltip = ({ active, payload, label, synliga }) => {
  if (!active || !payload?.length) return null
  const filtered = payload.filter((p) => synliga.has(p.dataKey))
  if (!filtered.length) return null
  const sorted = [...filtered].sort((a, b) => b.value - a.value)
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-2xl border backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(15, 23, 25, 0.85)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      {sorted.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 justify-between">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="font-bold text-white tabular-nums">{p.value}p</span>
        </div>
      ))}
    </div>
  )
}

export default function PoangPerOmgang() {
  const [synliga, setSynliga] = useState(() => new Set(ALLA_SPELARE.map((s) => s.namn)))

  const toggleSpelare = (namn) => {
    setSynliga((prev) => {
      const next = new Set(prev)
      next.has(namn) ? next.delete(namn) : next.add(namn)
      return next
    })
  }

  const toggleLag = (lagNamn) => {
    const lagSpelare = ALLA_SPELARE.filter((s) => s.lag === lagNamn).map((s) => s.namn)
    const allaSynliga = lagSpelare.every((n) => synliga.has(n))
    setSynliga((prev) => {
      const next = new Set(prev)
      lagSpelare.forEach((n) => {
        if (allaSynliga) next.delete(n)
        else next.add(n)
      })
      return next
    })
  }

  const lag1Alla = lag1.spelare.every((n) => synliga.has(n))
  const lag2Alla = lag2.spelare.every((n) => synliga.has(n))

  return (
    <Card>
      <SectionHeader title="Totalpoäng" sub="Ackumulerade poäng per spelare" />

      {/* Lag-snabbfilter */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => toggleLag(lag1.namn)}
          className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
          style={{
            backgroundColor: lag1Alla ? lag1.farg + '25' : 'transparent',
            borderColor: lag1.farg + '40',
            color: lag1Alla ? lag1.farg : lag1.farg + 'aa',
          }}
        >
          {lag1Alla ? '✓' : '○'} {lag1.namn}
        </button>
        <button
          onClick={() => toggleLag(lag2.namn)}
          className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
          style={{
            backgroundColor: lag2Alla ? lag2.farg + '25' : 'transparent',
            borderColor: lag2.farg + '40',
            color: lag2Alla ? lag2.farg : lag2.farg + 'aa',
          }}
        >
          {lag2Alla ? '✓' : '○'} {lag2.namn}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip synliga={synliga} />} />
          {ALLA_SPELARE.map(({ namn, farg }) => (
            <Line
              key={namn}
              type="monotone"
              dataKey={namn}
              stroke={farg}
              strokeWidth={synliga.has(namn) ? 2 : 0}
              strokeDasharray={lag2.spelare.includes(namn) ? '5 3' : undefined}
              dot={synliga.has(namn) ? { r: 3, fill: farg } : false}
              activeDot={synliga.has(namn) ? { r: 5, fill: farg, strokeWidth: 2, stroke: 'rgba(255,255,255,0.2)' } : false}
              hide={!synliga.has(namn)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Klickbara spelar-chips */}
      <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
        {ALLA_SPELARE.map(({ namn, farg, lag }) => {
          const synlig = synliga.has(namn)
          return (
            <button
              key={namn}
              onClick={() => toggleSpelare(namn)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] sm:text-xs transition-all"
              style={{
                backgroundColor: synlig ? farg + '18' : 'transparent',
                borderColor: synlig ? farg + '40' : 'rgba(255,255,255,0.08)',
                color: synlig ? farg : 'rgba(148, 163, 184, 0.6)',
                opacity: synlig ? 1 : 0.5,
              }}
            >
              {lag === lag2.namn
                ? <span className="w-3 border-t-2 border-dashed inline-block" style={{ borderColor: synlig ? farg : '#64748b' }} />
                : <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: synlig ? farg : '#64748b' }} />
              }
              <span>{namn}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
