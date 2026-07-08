import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { ackumuleradSkillnad, lag1, lag2 } from '../data/liga'
import Card, { SectionHeader } from './Card'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-2xl border backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(15, 23, 25, 0.85)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      <p className="text-slate-300">
        {lag1.namn}: <span className="font-bold tabular-nums" style={{ color: lag1.farg }}>{d.lag1}p</span>
      </p>
      <p className="text-slate-300">
        {lag2.namn}: <span className="font-bold tabular-nums" style={{ color: lag2.farg }}>{d.lag2}p</span>
      </p>
      <div className="border-t border-white/10 mt-2 pt-2">
        <p className={d.skillnad >= 0 ? 'text-blue-400' : 'text-red-400'}>
          Skillnad: {d.skillnad > 0 ? '+' : ''}{d.skillnad}p ({d.skillnad >= 0 ? lag1.namn : lag2.namn} leder)
        </p>
      </div>
    </div>
  )
}

export default function SkillnadGraf() {
  const data = ackumuleradSkillnad().map((d) => ({
    ...d,
    name: `Omg ${d.omgang}`,
    pos: d.skillnad >= 0 ? d.skillnad : 0,
    neg: d.skillnad < 0 ? d.skillnad : 0,
  }))

  return (
    <Card>
      <SectionHeader
        title="Ackumulerad skillnad"
        sub={`Positiv = ${lag1.namn} leder · Negativ = ${lag2.namn} leder`}
      />
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lag1.farg} stopOpacity={0.5} />
              <stop offset="95%" stopColor={lag1.farg} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lag2.farg} stopOpacity={0} />
              <stop offset="95%" stopColor={lag2.farg} stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="pos"
            stroke={lag1.farg}
            strokeWidth={2}
            fill="url(#posGrad)"
            name={lag1.namn}
          />
          <Area
            type="monotone"
            dataKey="neg"
            stroke={lag2.farg}
            strokeWidth={2}
            fill="url(#negGrad)"
            name={lag2.namn}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
