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
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              className={cn(
                "h-9 w-9",
                currentPage === 1 && "bg-primary text-primary-foreground"
              )}
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
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
              "h-9 w-9",
              currentPage === page && "bg-primary text-primary-foreground"
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
      
      <div className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  )
}