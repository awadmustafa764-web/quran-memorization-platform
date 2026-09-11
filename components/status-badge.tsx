import { cn } from '@/lib/utils'

type Tone = 'green' | 'gold' | 'neutral' | 'red' | 'sky'

const tones: Record<Tone, string> = {
  green: 'bg-primary-muted text-primary',
  gold: 'bg-accent-muted text-accent',
  neutral: 'bg-muted text-muted-foreground',
  red: 'bg-red-50 text-destructive',
  sky: 'bg-sky-50 text-sky-700',
}

export function StatusBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
