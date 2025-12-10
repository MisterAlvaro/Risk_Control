'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { riskRulesApi } from '@/lib/api/endpoints'
import { RULE_TYPES, SEVERITY_TYPES } from '@/lib/utils/constants'
import Link from 'next/link'

// Schema de validación
const ruleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  description: z.string().optional(),
  type: z.enum(['duration', 'volume_consistency', 'open_trades_count']),
  severity: z.enum(['hard', 'soft']),
  is_active: z.boolean().default(true),
  incidents_before_action: z.number().min(1).max(100).optional(),
  parameters: z.object({}).passthrough().default({}),
})

export default function CreateRulePage() {
  const router = useRouter()
  const [ruleType, setRuleType] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      is_active: true,
      severity: 'soft',
      parameters: {},
    },
  })

  const severity = watch('severity')

  // Mutation para crear regla
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof ruleSchema>) => riskRulesApi.create(data),
    onSuccess: () => {
      router.push('/rules')
    },
  })

  const onSubmit = (data: z.infer<typeof ruleSchema>) => {
    // Preparar datos según el tipo de regla
    const ruleData = {
      ...data,
      is_active: data.is_active,
      parameters: getParametersByType(ruleType) ?? data.parameters ?? {},
      incidents_before_action: data.severity === 'soft' ? data.incidents_before_action : undefined,
    }
    createMutation.mutate(ruleData)
  }

  // Renderizar parámetros según el tipo de regla
  const renderParameters = () => {
    switch (ruleType) {
      case 'duration':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="min_duration_seconds">Duración Mínima (segundos)</Label>
              <Input
                id="min_duration_seconds"
                type="number"
                min="1"
                placeholder="60"
                onChange={(e) => setValue('parameters.min_duration_seconds', parseInt(e.target.value))}
              />
              {errors.parameters?.min_duration_seconds && (
                <p className="text-sm text-red-600">{errors.parameters.min_duration_seconds.message}</p>
              )}
            </div>
          </div>
        )

      case 'volume_consistency':
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="min_factor">Factor Mínimo</Label>
              <Input
                id="min_factor"
                type="number"
                step="0.1"
                min="0"
                max="1"
                placeholder="0.5"
                onChange={(e) => setValue('parameters.min_factor', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="max_factor">Factor Máximo</Label>
              <Input
                id="max_factor"
                type="number"
                step="0.1"
                min="1"
                max="10"
                placeholder="2.0"
                onChange={(e) => setValue('parameters.max_factor', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="lookback_trades">Trades Históricos</Label>
              <Input
                id="lookback_trades"
                type="number"
                min="1"
                max="100"
                placeholder="10"
                onChange={(e) => setValue('parameters.lookback_trades', parseInt(e.target.value))}
              />
            </div>
          </div>
        )

      case 'open_trades_count':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="time_window_minutes">Ventana de Tiempo (minutos)</Label>
              <Input
                id="time_window_minutes"
                type="number"
                min="1"
                max="1440"
                placeholder="60"
                onChange={(e) => setValue('parameters.time_window_minutes', parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="min_open_trades">Mínimo Trades Abiertos (opcional)</Label>
                <Input
                  id="min_open_trades"
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={(e) => setValue('parameters.min_open_trades', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_open_trades">Máximo Trades Abiertos (opcional)</Label>
                <Input
                  id="max_open_trades"
                  type="number"
                  min="1"
                  placeholder="5"
                  onChange={(e) => setValue('parameters.max_open_trades', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getParametersByType = (type: string) => {
    const params: any = {}
    
    switch (type) {
      case 'duration':
        const durationEl = document.getElementById('min_duration_seconds') as HTMLInputElement
        if (durationEl?.value) params.min_duration_seconds = parseInt(durationEl.value)
        break
        
      case 'volume_consistency':
        const minFactorEl = document.getElementById('min_factor') as HTMLInputElement
        const maxFactorEl = document.getElementById('max_factor') as HTMLInputElement
        const lookbackEl = document.getElementById('lookback_trades') as HTMLInputElement
        
        if (minFactorEl?.value) params.min_factor = parseFloat(minFactorEl.value)
        if (maxFactorEl?.value) params.max_factor = parseFloat(maxFactorEl.value)
        if (lookbackEl?.value) params.lookback_trades = parseInt(lookbackEl.value)
        break
        
      case 'open_trades_count':
        const windowEl = document.getElementById('time_window_minutes') as HTMLInputElement
        const minOpenEl = document.getElementById('min_open_trades') as HTMLInputElement
        const maxOpenEl = document.getElementById('max_open_trades') as HTMLInputElement
        
        if (windowEl?.value) params.time_window_minutes = parseInt(windowEl.value)
        if (minOpenEl?.value) params.min_open_trades = parseInt(minOpenEl.value)
        if (maxOpenEl?.value) params.max_open_trades = parseInt(maxOpenEl.value)
        break
    }
    
    return params
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/rules">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nueva Regla</h1>
            <p className="text-gray-600">
              Configure una nueva regla de control de riesgo
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Regla
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulario Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Regla</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre de la Regla *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ej: Detección de Trades Rápidos"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe el propósito de esta regla..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="type">Tipo de Regla *</Label>
                    <Select
                      value={ruleType}
                      onValueChange={(value) => {
                        setRuleType(value)
                        setValue('type', value as any)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {RULE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="severity">Severidad *</Label>
                    <Select
                      {...register('severity')}
                      onValueChange={(value) => setValue('severity', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITY_TYPES.map((severity) => (
                          <SelectItem key={severity.value} value={severity.value}>
                            <div>
                              <div className="font-medium">{severity.label}</div>
                              <div className="text-xs text-gray-500">{severity.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.severity && (
                      <p className="text-sm text-red-600">{errors.severity.message}</p>
                    )}
                  </div>
                </div>

                {severity === 'soft' && (
                  <div>
                    <Label htmlFor="incidents_before_action">
                      Incidentes antes de la Acción *
                    </Label>
                    <Input
                      id="incidents_before_action"
                      type="number"
                      min="1"
                      max="100"
                      defaultValue="3"
                      {...register('incidents_before_action', { valueAsNumber: true })}
                      placeholder="3"
                    />
                    <p className="text-sm text-gray-500">
                      Número de violaciones necesarias antes de ejecutar las acciones
                    </p>
                    {errors.incidents_before_action && (
                      <p className="text-sm text-red-600">{errors.incidents_before_action.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Parámetros específicos */}
              {ruleType && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parámetros de la Regla</h3>
                  {renderParameters()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Configuración adicional */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active" className="font-medium">
                      Estado de la Regla
                    </Label>
                    <p className="text-sm text-gray-500">
                      Activar/desactivar la regla
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                </div>

                <div>
                  <Label className="font-medium">Acciones Asociadas</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Agregue acciones a ejecutar cuando se viola la regla
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Acción
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Preview de la regla */}
              {ruleType && (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <h4 className="font-medium mb-2">Vista Previa</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">
                        {RULE_TYPES.find(t => t.value === ruleType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severidad:</span>
                      <span className={`font-medium ${
                        severity === 'hard' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {SEVERITY_TYPES.find(s => s.value === severity)?.label}
                      </span>
                    </div>
                    {severity === 'soft' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Acción después de:</span>
                        <span className="font-medium">
                          {watch('incidents_before_action') || 3} incidentes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Errores del servidor */}
      {createMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span className="font-medium">Error al crear la regla</span>
          </div>
          <p className="mt-1 text-sm text-red-600">
            {createMutation.error?.message || 'Ocurrió un error inesperado'}
          </p>
        </div>
      )}
    </div>
  )
}

// Componente Label (local)
function Label({ 
  htmlFor, 
  children, 
  className 
}: { 
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
}

