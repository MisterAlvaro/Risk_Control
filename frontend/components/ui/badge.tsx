import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm',
        {
          'border-primary/40 bg-gradient-to-r from-primary/15 to-primary/10 text-primary hover:from-primary/20 hover:to-primary/15 hover:shadow-md': variant === 'default',
          'border-surface bg-surface text-text hover:bg-surface/80 hover:shadow-sm': variant === 'secondary',
          'border-danger/40 bg-gradient-to-r from-danger/15 to-danger/10 text-danger hover:from-danger/20 hover:to-danger/15 hover:shadow-md': variant === 'destructive',
          'border border-border/40 text-text/80 bg-surface/30 hover:bg-surface/50 hover:border-border/60': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

