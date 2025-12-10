// app/incidents/[id]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  User,
  Shield,
  TrendingUp,
  Calendar,
  RefreshCw,
  Mail,
  Bell,
  FileText
} from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { incidentsApi } from '@/lib/api/endpoints'
import { 
  formatDate, 
  getStatusColor,
  formatRelativeTime,
  formatRuleType,
  formatSeverity
} from '@/lib/utils/formatters'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ApiStatus } from '@/components/shared/api-status'
import { useState } from 'react'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const incidentId = parseInt(params.id as string)

  // Fetch incident data
  const { data: incidentData, isLoading, error, refetch } = useQuery({
    queryKey: ['incident', incidentId],
    queryFn: () => incidentsApi.getById(incidentId),
    enabled: !!incidentId,
  })

  const incident = incidentData?.data

  // Mutation for resolving incident
  const resolveMutation = useMutation({
    mutationFn: () => incidentsApi.resolve(incidentId),
    onSuccess: () => {
      refetch()
      setShowResolveDialog(false)
    },
  })

  const getViolationDetails = () => {
    if (!incident?.violation_data) return null

    const data = incident.violation_data
    const details = []

    if (data.duration_seconds !== undefined) {
      details.push({
        label: 'Duración del Trade',
        value: `${data.duration_seconds} segundos`,
        expected: `Mínimo requerido: ${data.min_duration_seconds} segundos`,
      })
    }

    if (data.current_volume !== undefined) {
      details.push({
        label: 'Volumen Actual',
        value: `${data.current_volume} lots`,
        expected: data.allowed_range 
          ? `Rango permitido: ${data.allowed_range.min} - ${data.allowed_range.max} lots`
          : `Promedio histórico: ${data.average_volume} lots`,
      })
    }

    if (data.open_trades_count !== undefined) {
      details.push({
        label: 'Trades Abiertos',
        value: `${data.open_trades_count} trades`,
        expected: `Máximo permitido: ${data.max_open_trades} trades en ${data.time_window_minutes} minutos`,
      })
    }

    return details
  }

  const getActionTaken = () => {
    if (!incident) return null

    if (incident.status === 'action_executed') {
      return 'Acciones de riesgo ejecutadas automáticamente'
    } else if (incident.status === 'processed') {
      return 'Incidente procesado manualmente'
    }
    return 'Pendiente de acción'
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !incident) {
    return (
      <ApiStatus
        isLoading={false}
        error={error}
        refetch={refetch}
        errorMessage="Error al cargar el incidente"
      />
    )
  }

  const violationDetails = getViolationDetails()
  const actionTaken = getActionTaken()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/incidents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Incidente #{incident.id}
              </h1>
              <Badge className={getStatusColor(incident.status)}>
                {incident.status === 'pending' ? 'Pendiente' :
                 incident.status === 'processed' ? 'Procesado' : 'Acción Ejecutada'}
              </Badge>
            </div>
            <p className="text-gray-600">
              Detalles de la violación de regla
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {incident.status === 'pending' && (
            <Button onClick={() => setShowResolveDialog(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar como Procesado
            </Button>
          )}
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <InfoCard
          title="Cuenta"
          value={incident.account_login?.toString() || '-'}
          icon={<User className="h-5 w-5" />}
          href={`/accounts/${incident.account_id}`}
        />
        <InfoCard
          title="Regla"
          value={incident.rule_name || '-'}
          icon={<Shield className="h-5 w-5" />}
          href={incident.risk_rule_id ? `/rules/${incident.risk_rule_id}` : undefined}
        />
        <InfoCard
          title="Trade"
          value={incident.trade_id ? `#${incident.trade_id}` : 'No asociado'}
          icon={<TrendingUp className="h-5 w-5" />}
          href={incident.trade_id ? `/trades/${incident.trade_id}` : undefined}
        />
        <InfoCard
          title="Fecha"
          value={formatDate(incident.created_at, 'dd/MM/yyyy')}
          icon={<Calendar className="h-5 w-5" />}
          description={formatRelativeTime(incident.created_at)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Incident Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Violación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Violation Summary */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Resumen</h3>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">
                        Violación de regla detectada
                      </p>
                      <p className="mt-1 text-sm text-amber-700">
                        {actionTaken}
                      </p>
                      <p className="mt-2 text-sm text-amber-600">
                        Detectado: {formatDate(incident.created_at)}
                        {incident.resolved_at && (
                          <> • Resuelto: {formatDate(incident.resolved_at)}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Violation Parameters */}
              {violationDetails && violationDetails.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Parámetros de Violación</h3>
                  <div className="space-y-4">
                    {violationDetails.map((detail, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{detail.label}</div>
                            <div className="mt-1 text-sm text-gray-600">{detail.expected}</div>
                          </div>
                          <div className="text-lg font-semibold text-red-600">
                            {detail.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Data */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Datos Técnicos</h3>
                <div className="rounded-lg border bg-gray-50 p-4">
                  <pre className="overflow-x-auto text-sm">
                    {JSON.stringify(incident.violation_data, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Estado y Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Estado Actual</h4>
                  <div className="mt-2">
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status === 'pending' ? 'Pendiente' :
                       incident.status === 'processed' ? 'Procesado' : 'Acción Ejecutada'}
                    </Badge>
                  </div>
                </div>

                {incident.status === 'action_executed' && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Acciones Ejecutadas</p>
                        <p className="mt-1 text-sm text-red-700">
                          Se han ejecutado acciones automáticas según la configuración de la regla
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {incident.status === 'pending' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Acciones Disponibles</h4>
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => setShowResolveDialog(true)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marcar como Procesado
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Notificar al Usuario
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Historial</h4>
                <div className="space-y-3">
                  <TimelineItem
                    date={incident.created_at}
                    title="Incidente Detectado"
                    description="Violación de regla identificada"
                    isCurrent={true}
                  />
                  {incident.updated_at !== incident.created_at && (
                    <TimelineItem
                      date={incident.updated_at}
                      title="Actualizado"
                      description="Estado modificado"
                    />
                  )}
                  {incident.resolved_at && (
                    <TimelineItem
                      date={incident.resolved_at}
                      title="Resuelto"
                      description="Incidente procesado"
                      isCompleted={true}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <CardTitle>Enlaces Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/accounts/${incident.account_id}`}>
                  <User className="mr-2 h-4 w-4" />
                  Ver Cuenta #{incident.account_login}
                </Link>
              </Button>
              
              {incident.risk_rule_id && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/rules/${incident.risk_rule_id}`}>
                    <Shield className="mr-2 h-4 w-4" />
                    Ver Regla: {incident.rule_name}
                  </Link>
                </Button>
              )}
              
              {incident.trade_id && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/trades/${incident.trade_id}`}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Ver Trade #{incident.trade_id}
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/accounts/${incident.account_id}/risk`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Análisis de Riesgo de la Cuenta
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Procesado</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea marcar este incidente como procesado?
              Esta acción actualizará el estado del incidente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveDialog(false)}
              disabled={resolveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => resolveMutation.mutate()}
              disabled={resolveMutation.isPending}
            >
              {resolveMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar
                </>
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
  icon, 
  description,
  href 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  description?: string
  href?: string
}) {
  const content = (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:scale-[1.02]">
        {content}
      </Link>
    )
  }

  return content
}

function TimelineItem({ 
  date, 
  title, 
  description, 
  isCurrent = false,
  isCompleted = false 
}: { 
  date: string
  title: string
  description: string
  isCurrent?: boolean
  isCompleted?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${
          isCurrent ? 'bg-primary' :
          isCompleted ? 'bg-green-500' :
          'bg-gray-300'
        }`} />
        <div className="mt-1 h-full w-px bg-gray-200" />
      </div>
      <div className="flex-1 pb-3">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-1 text-xs text-gray-500">
          {formatDate(date, 'dd/MM/yyyy HH:mm')}
        </p>
      </div>
    </div>
  )
}