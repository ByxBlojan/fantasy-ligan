import './index.css'
import Header from './components/Header'
import TeamBattle from './components/TeamBattle'
import PoangPerOmgang from './components/PoangPerOmgang'
import Ranking from './components/Ranking'
import SlutTabell from './components/SlutTabell'
import FunStats from './components/FunStats'
import SideBet from './components/SideBet'
import SamstSpelare from './components/SamstSpelare'
import Byten from './components/Byten'
import { omgangar } from './data/liga'
import meta from './data/meta.json'

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-12">
        <Header antalOmgangar={omgangar.length} />

        <div className="space-y-4 sm:space-y-6">
          <TeamBattle />
          <FunStats />
          <SamstSpelare />
          <SideBet />
          <Byten />
          <Ranking />
          <SlutTabell />
          <PoangPerOmgang />
        </div>

        <div className="text-center mt-10 space-y-2">
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
