import { spelarRanking, spelarRankingForra, formData } from '../data/liga'
import Card, { SectionHeader } from './Card'

const MEDALJER = ['🥇', '🥈', '🥉']

function FormBadge({ diff, diffProcent }) {
  if (Math.abs(diff) < 0.5) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500 tabular-nums">
        <span>→</span>
        <span>i form</span>
      </span>
    )
  }
  const positiv = diff > 0
  const farg = positiv ? '#22c55e' : '#ef4444'
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums"
      style={{ color: farg }}
    >
      <span>{positiv ? '↗' : '↘'}</span>
      <span>{positiv ? '+' : ''}{diffProcent}%</span>
    </span>
  )
}

function RankChange({ diff }) {
  if (diff === 0 || diff === null) {
    return <span className="text-[10px] text-slate-600 tabular-nums w-5 text-center inline-block">–</span>
  }
  const upp = diff > 0
  return (
    <span
      className="text-[10px] font-bold tabular-nums w-5 text-center inline-block"
      style={{ color: upp ? '#22c55e' : '#ef4444' }}
    >
      {upp ? '↑' : '↓'}{Math.abs(diff)}
    </span>
  )
}

export default function Ranking() {
  const ranking = spelarRanking()
  const forraRanking = spelarRankingForra()
  const max = ranking[0].total

  return (
    <Card>
      <SectionHeader title="Individuell ranking" sub="Totalt poäng · form senaste 3 GW" />

      <div className="space-y-3">
        {ranking.map((spelare, i) => {
          const bredd = (spelare.total / max) * 100
          const form = formData(spelare.namn, 3)
          const forraPlats = forraRanking?.find((r) => r.namn === spelare.namn)?.plats
          const platsDiff = forraPlats !== undefined ? forraPlats - (i + 1) : null

          return (
            <div key={spelare.namn}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm sm:text-base w-5 sm:w-6 text-center shrink-0">
                    {MEDALJER[i] ?? `${i + 1}.`}
                  </span>
                  <RankChange diff={platsDiff} />
                  <span className="font-semibold text-white text-sm sm:text-base truncate">{spelare.namn}</span>
                  <span
                    className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium border shrink-0"
                    style={{
                      backgroundColor: spelare.farg + '18',
                      borderColor: spelare.farg + '35',
                      color: spelare.farg,
                    }}
                  >
                    {spelare.lag}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <FormBadge diff={form.diff} diffProcent={form.diffProcent} />
                  <span className="font-bold text-white tabular-nums text-sm sm:text-base">{spelare.total}p</span>
                </div>
              </div>
              <div className="h-1.5 sm:h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${bredd}%`,
                    background: `linear-gradient(90deg, ${spelare.farg}dd, ${spelare.farg})`,
                    boxShadow: `0 0 8px ${spelare.farg}66`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span className="tabular-nums">
                  snitt {form.säsongsSnitt}p · senaste 3: {form.senasteSnitt}p
                </span>
                <span className="tabular-nums">bäst: {spelare.bastaOmgang}p</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
