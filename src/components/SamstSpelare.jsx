import { samstSpelarStats } from '../data/liga'

export default function SamstSpelare() {
  const s = samstSpelarStats()

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: '#1a0a0a', borderColor: '#4a1a1a' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">💀</span>
        <h2 className="text-lg font-bold text-white">Tveklöst sämst just nu</h2>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        i Fantasy Allsvenskan · {s.antalOmgangar} omgångar spelade
      </p>

      {/* Namn + lag */}
      <div className="text-center mb-6">
        <div
          className="inline-block text-5xl font-black tracking-tight mb-1"
          style={{ color: '#ef4444' }}
        >
          {s.namn}
        </div>
        <div
          className="text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1"
          style={{ backgroundColor: s.lag.farg + '25', color: s.lag.farg }}
        >
          {s.lag.namn}
        </div>
      </div>

      {/* Statistik-rutnät */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatKort
          etikett="Totalpoäng"
          värde={`${s.total}p`}
          under="det är det vi har att jobba med"
          farg="#ef4444"
        />
        <StatKort
          etikett="Snitt per omgång"
          värde={`${s.snitt}p`}
          under="precis inte bra nog"
          farg="#f97316"
        />
        <StatKort
          etikett="Bakom ledaren"
          värde={`-${s.bakomLedaren}p`}
          under="och det är bara GW${s.antalOmgangar}"
          farg="#ef4444"
        />
        <StatKort
          etikett="Näst sämst är"
          värde={`+${s.föraNäststämst}p bättre`}
          under="ens bottenpallen är inte säker"
          farg="#f97316"
        />
        <StatKort
          etikett="Värsta omgången"
          värde={`GW${s.värstaOmgång.gw} · ${s.värstaOmgång.poang}p`}
          under="historisk prestation, tyvärr"
          farg="#ef4444"
        />
        <StatKort
          etikett="Sistaplatser"
          värde={`${s.antalGångerSist} av ${s.antalOmgangar} GW`}
          under={s.antalGångerSist === s.antalOmgangar ? 'konsekvent i alla fall' : 'sporadisk form'}
          farg="#f97316"
        />
      </div>

      <div
        className="rounded-xl p-3 text-center text-xs"
        style={{ backgroundColor: '#ef444415', borderLeft: '3px solid #ef4444' }}
      >
        <span className="text-slate-400">
          Bättre lycka nästa omgång. Eller inte.
        </span>
      </div>
    </div>
  )
}

function StatKort({ etikett, värde, under, farg }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#ffffff05', border: '1px solid #ffffff08' }}
    >
      <p className="text-slate-500 text-xs mb-1">{etikett}</p>
      <p className="font-bold text-base" style={{ color: farg }}>{värde}</p>
      <p className="text-slate-600 text-xs mt-1">{under}</p>
    </div>
  )
}
