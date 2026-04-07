import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { lag1, lag2, poangPerOmgangLag } from '../data/liga'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const [l1, l2] = payload
  const diff = (l1?.value ?? 0) - (l2?.value ?? 0)
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-xl"
      style={{ backgroundColor: '#1a2a1e', border: '1px solid #1e3a28' }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 justify-between">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-bold text-white tabular-nums">{p.value}p</span>
        </div>
      ))}
      <div className="border-t border-slate-700 mt-2 pt-2 text-xs text-slate-400">
        Differens: {diff > 0 ? '+' : ''}{diff}p
      </div>
    </div>
  )
}

export default function LagJamforelse() {
  const data1 = poangPerOmgangLag(lag1)
  const data2 = poangPerOmgangLag(lag2)

  const data = data1.map((d, i) => ({
    name: `Omg ${d.omgang}`,
    [lag1.namn]: d.poang,
    [lag2.namn]: data2[i].poang,
  }))

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <h2 className="text-lg font-bold text-white mb-1">Lag vs lag per omgång</h2>
      <p className="text-slate-400 text-sm mb-6">Totalt lagpoäng per omgång</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a28" />
          <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
          <Bar dataKey={lag1.namn} fill={lag1.farg} radius={[4, 4, 0, 0]} />
          <Bar dataKey={lag2.namn} fill={lag2.farg} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
