import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || value === '') return "-"

  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return "-"

  return `$${num.toFixed(decimals)}`
}
