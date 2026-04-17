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

        <p className="text-center text-slate-600 text-xs mt-8">
          Uppdatera <code className="text-slate-400">src/data/liga.js</code> efter varje omgång
        </p>
      </div>
    </div>
  )
}
