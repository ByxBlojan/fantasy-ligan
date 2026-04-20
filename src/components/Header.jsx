import { totalpoangLag, lag1, lag2 } from '../data/liga'

export default function Header({ antalOmgangar }) {
  const p1 = totalpoangLag(lag1)
  const p2 = totalpoangLag(lag2)
  const ledare = p1 >= p2 ? lag1 : lag2
  const skillnad = Math.abs(p1 - p2)

  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-green-500 mb-3">
        <span className="w-8 h-px bg-green-500 inline-block" />
        Allsvenskan Fantasy 2025
        <span className="w-8 h-px bg-green-500 inline-block" />
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
        Fantasy <span className="text-green-400">Liga</span>
      </h1>
      <p className="text-slate-400 mt-2 text-sm">
        {antalOmgangar} omgångar spelade · 4 vs 4
      </p>
      <div className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full" style={{ backgroundColor: ledare.farg + '18', border: `1px solid ${ledare.farg}40` }}>
        <span className="text-lg">👑</span>
        <span className="font-bold text-white">{ledare.namn}</span>
        <span className="text-sm font-semibold" style={{ color: ledare.farg }}>+{skillnad}p</span>
      </div>
    </header>
  )
}
