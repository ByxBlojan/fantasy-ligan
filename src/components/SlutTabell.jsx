import { projiceradTabell } from '../data/liga'
import Card, { SectionHeader } from './Card'

const MEDALJER = ['🥇', '🥈', '🥉']

export default function SlutTabell() {
  const rader = projiceradTabell()
  if (!rader.length) return null

  const ledare = rader[0]
  const kvar = ledare.kvar
  const max = ledare.projicerat

  return (
    <Card>
      <SectionHeader
        title="Om säsongen slutade nu"
        sub={kvar > 0 ? `Prognos efter ${kvar} kvarvarande omgångar` : 'Slutgiltig ställning'}
      />

      <div className="space-y-2">
        {rader.map((r, i) => {
          const bredd = (r.projicerat / max) * 100
          const ärLedare = i === 0
          return (
            <div
              key={r.namn}
              className="rounded-xl border p-3 backdrop-blur-sm"
              style={{
                backgroundColor: ärLedare ? r.farg + '10' : 'rgba(255,255,255,0.02)',
                borderColor: ärLedare ? r.farg + '35' : 'rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm sm:text-base w-5 text-center shrink-0">
                    {MEDALJER[i] ?? `${i + 1}.`}
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base truncate">{r.namn}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border shrink-0"
                    style={{
                      backgroundColor: r.farg + '18',
                      borderColor: r.farg + '35',
                      color: r.farg,
                    }}
                  >
                    {r.lag}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="font-black text-base sm:text-lg tabular-nums"
                    style={{ color: r.farg }}
                  >
                    {r.projicerat}p
                  </div>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    {r.total} + {Math.round(r.snitt * kvar)}
                  </div>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${bredd}%`,
                    background: `linear-gradient(90deg, ${r.farg}dd, ${r.farg})`,
                    boxShadow: `0 0 8px ${r.farg}66`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="text-slate-500 tabular-nums">
                  Snitt {r.snitt}p/omg
                </span>
                {ärLedare ? (
                  <span className="text-yellow-400 font-semibold">Favorit att vinna</span>
                ) : kvar > 0 ? (
                  <span className="text-slate-400 tabular-nums">
                    -{r.gap}p bakom · behöver {r.behöverRestenSnitt}p/omg
                  </span>
                ) : (
                  <span className="text-slate-500 tabular-nums">-{r.gap}p bakom</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {kvar > 0 && (
        <p className="text-[10px] text-slate-600 mt-4 text-center">
          Beräknat på snittpoäng × {kvar} kvarvarande omgångar
        </p>
      )}
    </Card>
  )
}
