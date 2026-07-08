import { totalpoangLag, lag1, lag2 } from '../data/liga'

export default function Header({ antalOmgangar }) {
  const p1 = totalpoangLag(lag1)
  const p2 = totalpoangLag(lag2)
  const ledare = p1 >= p2 ? lag1 : lag2
  const skillnad = Math.abs(p1 - p2)

  return (
    <header className="text-center pt-8 pb-6 sm:pt-12 sm:pb-8 px-2">
      <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400/80 mb-3">
        <span className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-emerald-400/60" />
        Allsvenskan Fantasy 2025
        <span className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-emerald-400/60" />
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none">
        Fantasy{' '}
        <span className="bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          Liga
        </span>
      </h1>

      <p className="text-slate-400 mt-3 text-xs sm:text-sm">
        {antalOmgangar} omgångar spelade · 4 vs 4
      </p>

      <div
        className="inline-flex items-center gap-2 mt-5 px-4 sm:px-5 py-2 rounded-full backdrop-blur-xl border"
        style={{
          backgroundColor: ledare.farg + '15',
          borderColor: ledare.farg + '40',
          boxShadow: `0 0 40px -10px ${ledare.farg}66`,
        }}
      >
        <span className="text-base sm:text-lg">👑</span>
        <span className="font-bold text-white text-sm sm:text-base">{ledare.namn}</span>
        <span className="text-xs sm:text-sm font-bold tabular-nums" style={{ color: ledare.farg }}>
          +{skillnad}p
        </span>
      </div>
    </header>
  )
}
