import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface/60', className)}
      {...props}
    />
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4">
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-32 flex-1" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-3/4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  )
}

export { Skeleton }
