'use client'

import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ApiStatusProps {
  isLoading: boolean
  error: any
  refetch?: () => void
  loadingMessage?: string
  errorMessage?: string
}

export function ApiStatus({
  isLoading,
  error,
  refetch,
  loadingMessage = 'Cargando...',
  errorMessage = 'Error al cargar los datos'
}: ApiStatusProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="mb-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
        <p className="text-sm text-text/70 animate-pulse">{loadingMessage}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <XCircle className="mb-4 h-12 w-12 text-danger animate-bounce-subtle" />
        <h3 className="mb-2 text-lg font-semibold text-text">Error</h3>
        <p className="mb-4 text-sm text-text/70">
          {errorMessage}
        </p>
        {refetch && (
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        )}
      </div>
    )
  }

  return null
}
