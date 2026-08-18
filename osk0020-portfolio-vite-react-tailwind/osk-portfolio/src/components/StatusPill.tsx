import type { Status } from '../data/projects'

const styles: Record<Status, { border: string; text: string; dot: string; label: string }> = {
  live: { border: 'border-green-dim', text: 'text-green', dot: 'bg-green shadow-[0_0_6px_var(--color-green)]', label: 'LIVE' },
  running: { border: 'border-[#7a5a1f]', text: 'text-amber', dot: 'bg-amber shadow-[0_0_6px_var(--color-amber)]', label: 'RUNNING' },
  archived: { border: 'border-line', text: 'text-text-faint', dot: 'bg-text-faint', label: 'ARCHIVED' },
}

export function StatusPill({ status, label }: { status: Status; label?: string }) {
  const s = styles[status]
  return (
    <span
      className={`mb-4 inline-flex items-center gap-1.5 border ${s.border} px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 ${s.dot}`} />
      {label ?? s.label}
    </span>
  )
}
