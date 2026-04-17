import { spelarRanking } from '../data/liga'

const MEDALJER = ['🥇', '🥈', '🥉']

export default function Ranking() {
  const ranking = spelarRanking()
  const max = ranking[0].total

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <h2 className="text-lg font-bold text-white mb-1">Individuell ranking</h2>
      <p className="text-slate-400 text-sm mb-6">Totalt poäng per spelare</p>

      <div className="space-y-3">
        {ranking.map((spelare, i) => {
          const bredd = (spelare.total / max) * 100
          return (
            <div key={spelare.namn}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base w-6 text-center">
                    {MEDALJER[i] ?? `${i + 1}.`}
                  </span>
                  <span className="font-semibold text-white">{spelare.namn}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: spelare.farg + '30', color: spelare.farg }}
                  >
                    {spelare.lag}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white tabular-nums">{spelare.total}p</span>
                  <span className="text-slate-500 text-xs ml-2">bäst: {spelare.bastaOmgang}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${bredd}%`, backgroundColor: spelare.farg }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
