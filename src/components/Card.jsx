export default function Card({
  children,
  className = '',
  tone = 'default',
  padding = 'md',
  glow,
  as: Tag = 'div',
}) {
  const tones = {
    default: 'bg-white/[0.03] border-white/[0.06]',
    danger:  'bg-red-500/[0.05] border-red-500/20',
    accent:  'bg-emerald-500/[0.04] border-emerald-500/20',
  }
  const pads = {
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }
  return (
    <Tag
      className={`relative rounded-2xl border backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] ${tones[tone]} ${pads[padding]} ${className}`}
      style={glow ? { boxShadow: `0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 0 ${glow}22, 0 0 0 1px ${glow}18` } : undefined}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="relative">{children}</div>
    </Tag>
  )
}

export function SectionHeader({ title, sub, icon, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
        </div>
        {sub && <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
