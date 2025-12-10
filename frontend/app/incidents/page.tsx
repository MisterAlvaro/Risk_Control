'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  User,
  Shield
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/shared/pagination'
import { ApiStatus } from '@/components/shared/api-status'
import { incidentsApi } from '@/lib/api/endpoints'
import { 
  formatDate, 
  formatRelativeTime, 
  getStatusColor,
  formatRuleType 
} from '@/lib/utils/formatters'
import { INCIDENT_STATUS } from '@/lib/utils/constants'

type IncidentFilters = {
  search: string
  status?: string
  account_id?: number
  risk_rule_id?: number
  sort_by: string
  sort_order: string
  page: number
}

export default function IncidentsPage() {
  const [filters, setFilters] = useState<IncidentFilters>({
    search: '',
    status: undefined,
    account_id: undefined,
    risk_rule_id: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentsApi.getAll(filters),
  })

  const handleFilterChange = (key: keyof IncidentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === '__all__' ? undefined : value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleResolveIncident = async (incidentId: number) => {
    // Implementar resolución de incidente
    console.log('Resolve incident:', incidentId)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-text">Incidentes</h1>
        <p className="text-lg text-text/70">Monitorice y gestione violaciones de reglas en tiempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pendientes"
          value={data?.data.filter(i => i.status === 'pending').length || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="warning"
        />
        <StatCard
          title="Procesados"
          value={data?.data.filter(i => i.status === 'processed').length || 0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Acciones Ejecutadas"
          value={data?.data.filter(i => i.status === 'action_executed').length || 0}
          icon={<Shield className="h-6 w-6" />}
          color="danger"
        />
      </div>

      {/* Filters */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/50" />
              <Input
                placeholder="Buscar incidentes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.status ?? '__all__'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los estados</SelectItem>
                {INCIDENT_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sort_by}
              onValueChange={(value) => handleFilterChange('sort_by', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Fecha de creación</SelectItem>
                <SelectItem value="account_id">Cuenta</SelectItem>
                <SelectItem value="risk_rule_id">Regla</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sort_order}
              onValueChange={(value) => handleFilterChange('sort_order', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Más reciente primero</SelectItem>
                <SelectItem value="asc">Más antiguo primero</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Incidentes</CardTitle>
            <p className="text-sm text-text/70 mt-1">Violaciones de reglas detectadas y estado actual</p>
          </div>
          <Button variant="outline" size="default" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando incidentes..."
            errorMessage="Error al cargar los incidentes"
          />

          {!isLoading && !error && (
            <>
              <div className="divide-y divide-border">
                {data?.data.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Shield className="mx-auto h-12 w-12 text-text/30" />
                    <h3 className="mt-4 text-lg font-semibold text-text">
                      No hay incidentes
                    </h3>
                    <p className="mt-2 text-text/70">
                      No se han detectado violaciones de reglas
                    </p>
                  </div>
                ) : (
                  data?.data.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      onResolve={handleResolveIncident}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {data && data.meta.last_page > 1 && (
                <div className="border-t border-border px-6 py-4">
                  <Pagination
                    currentPage={data.meta.current_page}
                    totalPages={data.meta.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color = 'primary',
}: {
  title: string
  value: number
  icon: React.ReactNode
  color?: 'primary' | 'danger' | 'warning'
}) {
  const colorConfig = {
    primary: {
      bg: 'bg-gradient-to-br from-primary/10 to-primary/5',
      border: 'border-primary/20',
      icon: 'bg-primary text-white',
      text: 'text-primary',
      label: 'text-primary/80'
    },
    danger: {
      bg: 'bg-gradient-to-br from-danger/10 to-danger/5',
      border: 'border-danger/20',
      icon: 'bg-danger text-white',
      text: 'text-danger',
      label: 'text-danger/80'
    },
    warning: {
      bg: 'bg-gradient-to-br from-warning/10 to-warning/5',
      border: 'border-warning/20',
      icon: 'bg-warning text-white',
      text: 'text-warning',
      label: 'text-warning/80'
    },
  }[color]

  return (
    <div className={`group rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:border-opacity-100 ${colorConfig.bg} ${colorConfig.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-widest ${colorConfig.label}`}>{title}</p>
          <p className={`mt-2 text-4xl font-bold ${colorConfig.text}`}>{value}</p>
        </div>
        <div className={`rounded-2xl p-4 ${colorConfig.icon} shadow-lg transform transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function IncidentCard({ 
  incident, 
  onResolve 
}: { 
  incident: any
  onResolve: (id: number) => void 
}) {
  const getViolationDetails = () => {
    const data = incident.violation_data
    
    switch (incident.rule_name?.toLowerCase()) {
      case 'duration':
        return `Duración: ${data.duration_seconds}s (Mínimo: ${data.min_duration_seconds}s)`
      
      case 'volume consistency':
        return `Volumen: ${data.current_volume} (Rango: ${data.allowed_range?.min}-${data.allowed_range?.max})`
      
      case 'open trades count':
        return `Trades abiertos: ${data.open_trades_count} (Máximo: ${data.max_open_trades})`
      
      default:
        return 'Violación detectada'
    }
  }

  return (
    <div className="rounded-lg border p-4 hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${
              incident.status === 'pending' ? 'bg-yellow-100' :
              incident.status === 'processed' ? 'bg-blue-100' :
              'bg-red-100'
            }`}>
              {incident.status === 'pending' ? (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              ) : incident.status === 'processed' ? (
                <CheckCircle className="h-4 w-4 text-blue-600" />
              ) : (
                <Shield className="h-4 w-4 text-red-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{incident.rule_name}</h3>
                <Badge className={getStatusColor(incident.status)}>
                  {incident.status === 'pending' ? 'Pendiente' :
                   incident.status === 'processed' ? 'Procesado' : 'Acción Ejecutada'}
                </Badge>
              </div>
              
              <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Cuenta: {incident.account_login}</span>
                </div>
                
                {incident.trade_id && (
                  <div className="flex items-center gap-1">
                    <span>Trade: #{incident.trade_id}</span>
                    {incident.trade_volume && (
                      <span className="text-xs">({incident.trade_volume} lots)</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatRelativeTime(incident.created_at)}</span>
                </div>
              </div>
              
              <p className="mt-2 text-sm">
                {getViolationDetails()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/incidents/${incident.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          
          {incident.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onResolve(incident.id)}
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Resolver
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}