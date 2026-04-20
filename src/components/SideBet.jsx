import { sideBetStatus, specialBetStatus } from '../data/liga'
import PPMBet from './PPMBet'
import MalBet from './MalBet'

export default function SideBet() {
  const bets = sideBetStatus()
  const special = specialBetStatus()

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#121a16', borderColor: '#1e3a28' }}
    >
      <h2 className="text-lg font-bold text-white mb-1">Side bets</h2>
      <p className="text-slate-400 text-sm mb-6">Vinnaren tar hem allt</p>

      <div className="space-y-4">
        {bets.map(({ spelare1, spelare2, belopp, ledare, forlorare, skillnad, farg }) => (
          <div
            key={`${spelare1}-${spelare2}`}
            className="rounded-xl border p-4"
            style={{ borderColor: farg + '50', backgroundColor: farg + '10' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm">
                {spelare1} vs {spelare2}
              </span>
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#1e3a28', color: '#4ade80' }}
              >
                {belopp} kr
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="text-white font-bold">{ledare} leder</p>
                <p className="text-slate-400 text-sm">
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
            className="rounded-xl border p-4"
            style={{ borderColor: '#94a3b820', backgroundColor: '#94a3b808' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm">
                {bet.better1.namn} vs {bet.better2.namn}
              </span>
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#1e3a28', color: '#94a3b8' }}
              >
                {bet.vinst ?? (bet.belopp !== null ? `${bet.belopp} kr` : 'Insats oklar')}
              </span>
            </div>

            <p className="text-slate-500 text-xs mb-3">
              {bet.better1.backar} vs {bet.better2.backar} · {bet.beskrivning} · t.o.m. {bet.slutvillkor}
            </p>

            {bet.harData ? (
              <div className="flex items-center gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="text-white font-bold">{bet.ledare.namn} leder</p>
                  <p className="text-slate-400 text-sm">
                    {bet.better1.backar} {bet.stat1} · {bet.better2.backar} {bet.stat2}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏳</div>
                <p className="text-slate-500 text-sm">Ingen data ännu — uppdatera manuellt i liga.js</p>
              </div>
            )}
          </div>
          )
        )}
      </div>
    </div>
  )
}
