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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        </div>
        <p className="text-sm text-gray-600">{loadingMessage}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <XCircle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Error</h3>
        <p className="mb-4 text-sm text-gray-600">
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
