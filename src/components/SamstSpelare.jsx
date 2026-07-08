import { samstSpelarStats } from '../data/liga'
import Card from './Card'

function StatKort({ etikett, värde, under, farg }) {
  return (
    <div
      className="rounded-xl p-3 sm:p-4 border backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: farg + '20',
      }}
    >
      <p className="text-slate-500 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">{etikett}</p>
      <p className="font-bold text-sm sm:text-base" style={{ color: farg }}>{värde}</p>
      <p className="text-slate-600 text-[10px] sm:text-xs mt-1">{under}</p>
    </div>
  )
}

export default function SamstSpelare() {
  const s = samstSpelarStats()

  return (
    <Card tone="danger" glow="#ef4444">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl sm:text-2xl">💀</span>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Tveklöst sämst just nu</h2>
      </div>
      <p className="text-slate-500 text-xs sm:text-sm mb-5 sm:mb-6">
        i Fantasy Allsvenskan · {s.antalOmgangar} omgångar spelade
      </p>

      {/* Namn + lag */}
      <div className="text-center mb-5 sm:mb-6">
        <div
          className="inline-block text-4xl sm:text-6xl font-black tracking-tighter"
          style={{
            color: '#ef4444',
            textShadow: '0 0 40px rgba(239, 68, 68, 0.5)',
          }}
        >
          {s.namn}
        </div>
        <div
          className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full inline-block mt-2 border backdrop-blur-sm"
          style={{
            backgroundColor: s.lag.farg + '20',
            borderColor: s.lag.farg + '40',
            color: s.lag.farg,
          }}
        >
          {s.lag.namn}
        </div>
      </div>

      {/* Statistik-rutnät */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <StatKort etikett="Totalpoäng" värde={`${s.total}p`} under="det är det vi har att jobba med" farg="#ef4444" />
        <StatKort etikett="Snitt per omgång" värde={`${s.snitt}p`} under="precis inte bra nog" farg="#f97316" />
        <StatKort etikett="Bakom ledaren" värde={`-${s.bakomLedaren}p`} under={`och det är bara GW${s.antalOmgangar}`} farg="#ef4444" />
        <StatKort etikett="Näst sämst är" värde={`+${s.föraNäststämst}p bättre`} under="ens bottenpallen är inte säker" farg="#f97316" />
        <StatKort etikett="Värsta omgången" värde={`GW${s.värstaOmgång.gw} · ${s.värstaOmgång.poang}p`} under="historisk prestation, tyvärr" farg="#ef4444" />
        <StatKort etikett="Sistaplatser" värde={`${s.antalGångerSist} av ${s.antalOmgangar} GW`} under={s.antalGångerSist === s.antalOmgangar ? 'konsekvent i alla fall' : 'sporadisk form'} farg="#f97316" />
      </div>

      <div
        className="rounded-xl p-3 text-center text-[11px] sm:text-xs border-l-2 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: '#ef4444' }}
      >
        <span className="text-slate-400">
          Bättre lycka nästa omgång. Eller inte.
        </span>
      </div>
    </Card>
  )
}
