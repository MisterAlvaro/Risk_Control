'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisiblePages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              className={cn(
                "h-10 w-10 rounded-xl font-bold",
                currentPage === 1 && "bg-gradient-to-r from-primary/90 to-primary text-white border-primary/40"
              )}
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-5 w-5 text-text/30" />
              </span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-10 w-10 rounded-xl font-bold transition-all duration-300",
              currentPage === page 
                ? "bg-gradient-to-r from-primary/90 to-primary text-white border-primary/40 shadow-lg" 
                : "hover:border-border/60"
            )}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </span>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              className={cn(
                "h-9 w-9",
                currentPage === totalPages && "bg-primary text-primary-foreground"
              )}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-text/70">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  )
}