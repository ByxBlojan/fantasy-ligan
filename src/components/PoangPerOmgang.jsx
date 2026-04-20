import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { lag1, lag2, omgangar } from '../data/liga'

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
  ...lag1.spelare.map((s) => ({ namn: s, farg: SPELARE_FARG[s] ?? lag1.farg, lag: 1 })),
  ...lag2.spelare.map((s) => ({ namn: s, farg: SPELARE_FARG[s] ?? lag2.farg, lag: 2 })),
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const sorted = [...payload].sort((a, b) => b.value - a.value)
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-xl"
      style={{ backgroundColor: '#1a2a1e', border: '1px solid #1e3a28' }}
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
  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <h2 className="text-lg font-bold text-white mb-1">Totalpoäng</h2>
      <p className="text-slate-400 text-sm mb-6">Ackumulerade poäng per spelare</p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a28" />
          <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
          />
          {ALLA_SPELARE.map(({ namn, farg }, i) => (
            <Line
              key={namn}
              type="monotone"
              dataKey={namn}
              stroke={farg}
              strokeWidth={2}
              strokeDasharray={lag2.spelare.includes(namn) ? '5 3' : undefined}
              dot={{ r: 4, fill: farg }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3 justify-center text-xs text-slate-400">
        {ALLA_SPELARE.map(({ namn, farg, lag }) => (
          <span key={namn} className="flex items-center gap-1.5">
            {lag === 2
              ? <span className="w-5 border-t-2 border-dashed inline-block" style={{ borderColor: farg }} />
              : <span className="w-5 h-0.5 inline-block" style={{ backgroundColor: farg }} />
            }
            <span style={{ color: farg }}>{namn}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
