export default function Header({ antalOmgangar }) {
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
    </header>
  )
}
