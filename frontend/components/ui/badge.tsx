import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus:outline-none',
        {
          'border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 text-[color:var(--primary)] hover:bg-[color:var(--primary)]/15': variant === 'default',
          'border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--muted)]': variant === 'secondary',
          'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/15': variant === 'destructive',
          'border border-[color:var(--border)] text-[color:var(--muted-foreground)] bg-[color:var(--muted)]/30 hover:bg-[color:var(--muted)]/50': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
