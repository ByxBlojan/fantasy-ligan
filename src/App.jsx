import './index.css'
import Header from './components/Header'
import TeamBattle from './components/TeamBattle'
import PoangPerOmgang from './components/PoangPerOmgang'
import LagJamforelse from './components/LagJamforelse'
import SkillnadGraf from './components/SkillnadGraf'
import Ranking from './components/Ranking'
import FunStats from './components/FunStats'
import SideBet from './components/SideBet'
import { omgangar } from './data/liga'
import meta from './data/meta.json'

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f0d' }}>
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Header antalOmgangar={omgangar.length} />
        <TeamBattle />
        <FunStats />
        <SideBet />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <LagJamforelse />
            <SkillnadGraf />
          </div>
          <div>
            <Ranking />
          </div>
        </div>

<PoangPerOmgang />

        <div className="text-center mt-8 space-y-2">
          {meta.lastUpdated && (
            <p className="text-slate-500 text-xs">
              Senast uppdaterad:{' '}
              {new Date(meta.lastUpdated).toLocaleString('sv-SE', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
                timeZone: 'Europe/Stockholm',
              })}
            </p>
          )}
          <p className="text-slate-600 text-xs">
            Saknas info? Be <span className="text-slate-400">Lindqvist i Derbyligan</span> att uppdatera hemsidan.
          </p>
        </div>
      </div>
    </div>
  )
}
