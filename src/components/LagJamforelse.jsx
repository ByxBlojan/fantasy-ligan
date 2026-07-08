import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { lag1, lag2, poangPerOmgangLag } from '../data/liga'
import Card, { SectionHeader } from './Card'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const [l1, l2] = payload
  const diff = (l1?.value ?? 0) - (l2?.value ?? 0)
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-2xl border backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(15, 23, 25, 0.85)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 justify-between">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-bold text-white tabular-nums">{p.value}p</span>
        </div>
      ))}
      <div className="border-t border-white/10 mt-2 pt-2 text-xs text-slate-400">
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
    <Card>
      <SectionHeader title="Lag vs lag per omgång" sub="Totalt lagpoäng per omgång" />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lag1.farg} stopOpacity={1} />
              <stop offset="100%" stopColor={lag1.farg} stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lag2.farg} stopOpacity={1} />
              <stop offset="100%" stopColor={lag2.farg} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Bar dataKey={lag1.namn} fill="url(#bar1)" radius={[6, 6, 0, 0]} />
          <Bar dataKey={lag2.namn} fill="url(#bar2)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
