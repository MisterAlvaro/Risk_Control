import { cn } from "@/lib/utils/cn";

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClass = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size]

  return (
    <div className="flex items-center justify-center">
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
        sizeClass
      )} />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
