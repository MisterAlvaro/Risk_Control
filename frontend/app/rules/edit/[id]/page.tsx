'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Save, AlertTriangle, Eye, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { riskRulesApi } from '@/lib/api/endpoints'
import { RULE_TYPES, SEVERITY_TYPES } from '@/lib/utils/constants'
import { formatRuleType, formatSeverity } from '@/lib/utils/formatters'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ApiStatus } from '@/components/shared/api-status'

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

type RuleFormData = z.infer<typeof ruleSchema>

export default function EditRulePage() {
  const params = useParams()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const ruleId = parseInt(params.id as string)

  // Fetch rule data
  const { data: ruleData, isLoading, error, refetch } = useQuery({
    queryKey: ['rule', ruleId],
    queryFn: () => riskRulesApi.getById(ruleId),
    enabled: !!ruleId,
  })

  const rule = ruleData?.data

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      parameters: {},
      is_active: true,
      severity: 'soft',
    },
  })

  // Set form values when rule data is loaded
  useEffect(() => {
    if (rule) {
      reset({
        name: rule.name,
        description: rule.description || '',
        type: rule.type,
        severity: rule.severity,
        is_active: rule.is_active,
        incidents_before_action: rule.incidents_before_action || undefined,
        parameters: rule.parameters || {},
      })
    }
  }, [rule, reset])

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<RuleFormData>) => 
      riskRulesApi.update(ruleId, data),
    onSuccess: () => {
      refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => riskRulesApi.delete(ruleId),
    onSuccess: () => {
      router.push('/rules')
    },
  })

// Componente Label local
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

  const onSubmit = (data: z.infer<typeof ruleSchema>) => {
    const updateData = {
      name: data.name,
      description: data.description,
      severity: data.severity,
      incidents_before_action: data.severity === 'soft' ? data.incidents_before_action : undefined,
      is_active: data.is_active,
      parameters: data.parameters ?? {},
    }
    
    updateMutation.mutate(updateData)
  }

  const renderParameters = () => {
    if (!rule) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Parámetros Configurados</h3>
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="grid gap-3">
            {rule.type === 'duration' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duración Mínima:</span>
                <span className="font-medium">
                  {rule.parameters.min_duration_seconds} segundos
                </span>
              </div>
            )}
            
            {rule.type === 'volume_consistency' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Factor Mínimo:</span>
                  <span className="font-medium">{rule.parameters.min_factor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Factor Máximo:</span>
                  <span className="font-medium">{rule.parameters.max_factor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trades Históricos:</span>
                  <span className="font-medium">{rule.parameters.lookback_trades}</span>
                </div>
              </>
            )}
            
            {rule.type === 'open_trades_count' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ventana de Tiempo:</span>
                  <span className="font-medium">{rule.parameters.time_window_minutes} minutos</span>
                </div>
                {rule.parameters.min_open_trades && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mínimo Trades Abiertos:</span>
                    <span className="font-medium">{rule.parameters.min_open_trades}</span>
                  </div>
                )}
                {rule.parameters.max_open_trades && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Máximo Trades Abiertos:</span>
                    <span className="font-medium">{rule.parameters.max_open_trades}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Nota: Los parámetros no se pueden modificar. Crea una nueva regla para cambiar los parámetros.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ApiStatus
        isLoading={false}
        error={error}
        refetch={refetch}
        errorMessage="Error al cargar la regla"
      />
    )
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
            <h1 className="text-3xl font-bold tracking-tight">Editar Regla</h1>
            <p className="text-gray-600">
              Modifique los detalles de la regla
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Rule Info */}
      {rule && (
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard title="Tipo de Regla" value={formatRuleType(rule.type)} />
          <InfoCard 
            title="Severidad" 
            value={formatSeverity(rule.severity)} 
            isCritical={rule.severity === 'hard'}
          />
          <InfoCard 
            title="Estado" 
            value={rule.is_active ? 'Activa' : 'Inactiva'} 
            isActive={rule.is_active}
          />
        </div>
      )}

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
                    placeholder="Nombre de la regla"
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
                    <Label htmlFor="type">Tipo de Regla</Label>
                    <div className="mt-2 rounded-md border bg-gray-50 px-3 py-2 text-sm">
                      {rule ? formatRuleType(rule.type) : '-'}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      El tipo de regla no se puede modificar
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="severity">Severidad *</Label>
                    <Select
                      value={watch('severity')}
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

                {watch('severity') === 'soft' && (
                  <div>
                    <Label htmlFor="incidents_before_action">
                      Incidentes antes de la Acción *
                    </Label>
                    <Input
                      id="incidents_before_action"
                      type="number"
                      min="1"
                      max="100"
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

              {/* Parámetros */}
              {renderParameters()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configuración */}
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
                    {rule?.actions_count || 0} acciones configuradas
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/rules/actions/${ruleId}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Gestionar Acciones
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Estadísticas */}
              {rule && (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <h4 className="font-medium mb-3">Estadísticas</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incidentes Totales:</span>
                      <Badge variant="outline">{rule.incidents_count || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acciones Configuradas:</span>
                      <Badge variant="outline">{rule.actions_count || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creada:</span>
                      <span>{new Date(rule.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última Actualización:</span>
                      <span>{new Date(rule.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Errores */}
          {updateMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span className="font-medium">Error al actualizar</span>
              </div>
              <p className="mt-1 text-sm text-red-600">
                {updateMutation.error?.message || 'Ocurrió un error inesperado'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Regla</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar esta regla? Esta acción no se puede deshacer.
              {rule?.incidents_count && rule.incidents_count > 0 && (
                <p className="mt-2 text-amber-600">
                  Advertencia: Esta regla tiene {rule.incidents_count} incidentes asociados.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Regla'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoCard({ 
  title, 
  value, 
  isCritical = false,
  isActive = false 
}: { 
  title: string
  value: string
  isCritical?: boolean
  isActive?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`mt-2 text-xl font-semibold ${
          isCritical ? 'text-red-600' :
          isActive ? 'text-green-600' :
          'text-gray-900'
        }`}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}