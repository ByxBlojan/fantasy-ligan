import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { lag1, lag2, totalpoangLag, totalpoangSpelare, ackumuleradSkillnad } from '../data/liga'
import Card from './Card'

function SkillnadInlineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div
      className="rounded-lg p-2 text-xs shadow-2xl border backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(15, 23, 25, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <p className="font-bold text-white mb-1">{label}</p>
      <p className={d.skillnad >= 0 ? 'font-semibold' : 'font-semibold'} style={{ color: d.skillnad >= 0 ? lag1.farg : lag2.farg }}>
        {d.skillnad > 0 ? '+' : ''}{d.skillnad}p
      </p>
    </div>
  )
}

function SkillnadCenter() {
  const rader = ackumuleradSkillnad()
  if (rader.length < 2) {
    return (
      <div className="text-center px-1">
        <div className="text-lg sm:text-2xl font-black text-slate-500/80">VS</div>
      </div>
    )
  }

  const data = rader.map((d) => ({
    ...d,
    name: `GW${d.omgang}`,
    pos: d.skillnad >= 0 ? d.skillnad : 0,
    neg: d.skillnad < 0 ? d.skillnad : 0,
  }))

  const senaste = rader[rader.length - 1].skillnad
  const ledare = senaste >= 0 ? lag1 : lag2

  return (
    <div className="flex flex-col items-center gap-1 w-24 sm:w-36 shrink-0 px-1">
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Skillnad
      </span>
      <div className="w-full h-12 sm:h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id="skillnadPosCenter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lag1.farg} stopOpacity={0.7} />
                <stop offset="95%" stopColor={lag1.farg} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="skillnadNegCenter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lag2.farg} stopOpacity={0} />
                <stop offset="95%" stopColor={lag2.farg} stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip content={<SkillnadInlineTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            <Area type="monotone" dataKey="pos" stroke={lag1.farg} strokeWidth={1.5} fill="url(#skillnadPosCenter)" />
            <Area type="monotone" dataKey="neg" stroke={lag2.farg} strokeWidth={1.5} fill="url(#skillnadNegCenter)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <span
        className="text-[10px] sm:text-xs font-bold tabular-nums"
        style={{ color: ledare.farg }}
      >
        {senaste > 0 ? '+' : ''}{senaste}p
      </span>
    </div>
  )
}

function SpelarRacing() {
  const alla = [...lag1.spelare, ...lag2.spelare]
    .map((namn) => ({
      namn,
      poang: totalpoangSpelare(namn),
      farg: lag1.spelare.includes(namn) ? lag1.farg : lag2.farg,
      lag: lag1.spelare.includes(namn) ? lag1.namn : lag2.namn,
    }))
    .sort((a, b) => b.poang - a.poang)

  const ledarePoang = alla[0].poang

  return (
    <div className="mb-5 sm:mb-6 space-y-1.5 sm:space-y-2">
      {alla.map((s, i) => {
        const bredd = (s.poang / ledarePoang) * 100
        const diffTillLedare = ledarePoang - s.poang
        const ärLedare = i === 0

        return (
          <div key={s.namn} className="flex items-center gap-2 sm:gap-3">
            {/* Rank + namn */}
            <div className="flex items-center gap-1.5 sm:gap-2 w-20 sm:w-24 shrink-0">
              <span
                className="text-[11px] sm:text-xs font-bold tabular-nums w-4 text-center shrink-0"
                style={{ color: ärLedare ? '#fbbf24' : 'rgba(148,163,184,0.7)' }}
              >
                {ärLedare ? '👑' : i + 1}
              </span>
              <span className="font-semibold text-white text-xs sm:text-sm truncate">
                {s.namn}
              </span>
            </div>

            {/* Stapel */}
            <div className="flex-1 h-7 sm:h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2 relative overflow-hidden"
                style={{
                  width: `${bredd}%`,
                  background: `linear-gradient(90deg, ${s.farg}bb, ${s.farg})`,
                  boxShadow: ärLedare
                    ? `0 0 16px ${s.farg}88, inset 0 1px 0 rgba(255,255,255,0.15)`
                    : `0 0 8px ${s.farg}44, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
                  }}
                />
                {bredd > 20 && (
                  <span className="relative font-black text-[11px] sm:text-xs text-white tabular-nums drop-shadow">
                    {s.poang}p
                  </span>
                )}
              </div>
              {bredd <= 20 && (
                <span
                  className="absolute top-1/2 -translate-y-1/2 font-black text-[11px] sm:text-xs tabular-nums"
                  style={{ color: s.farg, left: `calc(${bredd}% + 6px)` }}
                >
                  {s.poang}p
                </span>
              )}
            </div>

            {/* Diff till ledare */}
            <div className="w-10 sm:w-12 text-right shrink-0">
              {diffTillLedare > 0 ? (
                <span className="text-[10px] sm:text-xs text-slate-500 tabular-nums">
                  −{diffTillLedare}
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-bold text-yellow-400">
                  LED
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function TeamBattle() {
  const poang1 = totalpoangLag(lag1)
  const poang2 = totalpoangLag(lag2)
  const leder = poang1 > poang2 ? 1 : poang2 > poang1 ? 2 : 0
  const max = Math.max(poang1, poang2)
  const bar1 = (poang1 / max) * 100
  const bar2 = (poang2 / max) * 100

  return (
    <Card padding="md">
      {/* Laget vs laget */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 mb-5 sm:mb-6">
        <div className="text-center min-w-0">
          <div
            className="text-5xl sm:text-7xl font-black tabular-nums leading-none"
            style={{
              color: lag1.farg,
              textShadow: `0 0 30px ${lag1.farg}55`,
            }}
          >
            {poang1}
          </div>
          <div className="font-bold text-white mt-2 text-sm sm:text-base truncate">{lag1.namn}</div>
          {leder === 1 && (
            <span className="inline-block text-[10px] sm:text-xs text-yellow-400 font-semibold mt-1">
              👑 Leder
            </span>
          )}
        </div>

        <SkillnadCenter />

        <div className="text-center min-w-0">
          <div
            className="text-5xl sm:text-7xl font-black tabular-nums leading-none"
            style={{
              color: lag2.farg,
              textShadow: `0 0 30px ${lag2.farg}55`,
            }}
          >
            {poang2}
          </div>
          <div className="font-bold text-white mt-2 text-sm sm:text-base truncate">{lag2.namn}</div>
          {leder === 2 && (
            <span className="inline-block text-[10px] sm:text-xs text-yellow-400 font-semibold mt-1">
              👑 Leder
            </span>
          )}
        </div>
      </div>

      {/* Progressbar */}
      <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-5 sm:mb-6 bg-white/5">
        <div
          className="rounded-l-full transition-all duration-500"
          style={{
            width: `${bar1}%`,
            background: `linear-gradient(90deg, ${lag1.farg}dd, ${lag1.farg})`,
            boxShadow: `0 0 12px ${lag1.farg}88`,
          }}
        />
        <div
          className="rounded-r-full transition-all duration-500"
          style={{
            width: `${bar2}%`,
            background: `linear-gradient(90deg, ${lag2.farg}, ${lag2.farg}dd)`,
            boxShadow: `0 0 12px ${lag2.farg}88`,
          }}
        />
      </div>

      {/* Spelarnas racing bars */}
      <SpelarRacing />
    </Card>
  )
}
