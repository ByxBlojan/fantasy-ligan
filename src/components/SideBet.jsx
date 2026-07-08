import { sideBetStatus, specialBetStatus } from '../data/liga'
import PPMBet from './PPMBet'
import MalBet from './MalBet'
import Card, { SectionHeader } from './Card'

export default function SideBet() {
  const bets = sideBetStatus()
  const special = specialBetStatus()

  return (
    <Card>
      <SectionHeader title="Side bets" sub="Vinnaren tar hem allt" />

      <div className="space-y-3 sm:space-y-4">
        {bets.map(({ spelare1, spelare2, belopp, ledare, forlorare, skillnad, farg }) => (
          <div
            key={`${spelare1}-${spelare2}`}
            className="rounded-2xl border p-3 sm:p-4 backdrop-blur-sm"
            style={{ borderColor: farg + '40', backgroundColor: farg + '10' }}
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-white font-semibold text-xs sm:text-sm truncate">
                {spelare1} vs {spelare2}
              </span>
              <span
                className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border shrink-0"
                style={{
                  backgroundColor: 'rgba(74, 222, 128, 0.15)',
                  borderColor: 'rgba(74, 222, 128, 0.3)',
                  color: '#4ade80',
                }}
              >
                {belopp} kr
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xl sm:text-2xl">💰</div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm sm:text-base">{ledare} leder</p>
                <p className="text-slate-400 text-xs sm:text-sm truncate">
                  {forlorare} är skyldig {belopp} kr · {skillnad}p skillnad
                </p>
              </div>
            </div>
          </div>
        ))}

        {special.map((bet) =>
          bet.typ === 'ppm' ? (
            <PPMBet key={`${bet.better1.namn}-${bet.better2.namn}`} />
          ) : bet.typ === 'mal' ? (
            <MalBet key={`${bet.better1.namn}-${bet.better2.namn}`} />
          ) : (
            <div
              key={`${bet.better1.namn}-${bet.better2.namn}`}
              className="rounded-2xl border p-3 sm:p-4 backdrop-blur-sm"
              style={{ borderColor: 'rgba(148, 163, 184, 0.2)', backgroundColor: 'rgba(148, 163, 184, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-white font-semibold text-xs sm:text-sm truncate">
                  {bet.better1.namn} vs {bet.better2.namn}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 bg-white/[0.04] border-white/10 text-slate-300"
                >
                  {bet.vinst ?? (bet.belopp !== null ? `${bet.belopp} kr` : 'Insats oklar')}
                </span>
              </div>

              <p className="text-slate-500 text-[10px] sm:text-xs mb-3">
                {bet.better1.backar} vs {bet.better2.backar} · {bet.beskrivning} · t.o.m. {bet.slutvillkor}
              </p>

              {bet.harData ? (
                <div className="flex items-center gap-3">
                  <div className="text-xl sm:text-2xl">📊</div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm sm:text-base">{bet.ledare.namn} leder</p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">
                      {bet.better1.backar} {bet.stat1} · {bet.better2.backar} {bet.stat2}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-xl sm:text-2xl">⏳</div>
                  <p className="text-slate-500 text-xs sm:text-sm">Ingen data ännu — uppdatera manuellt i liga.js</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </Card>
  )
}
