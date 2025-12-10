'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  AlertTriangle,
  Users,
  Eye
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Pagination } from '@/components/shared/pagination'
import { ApiStatus } from '@/components/shared/api-status'
import { riskRulesApi } from '@/lib/api/endpoints'
import { formatDate, formatRuleType, formatSeverity } from '@/lib/utils/formatters'
import { RULE_TYPES, SEVERITY_TYPES } from '@/lib/utils/constants'

type RuleFilters = {
  search: string
  type?: string
  severity?: string
  is_active?: boolean
  page: number
}

export default function RulesPage() {
  const [filters, setFilters] = useState<RuleFilters>({
    search: '',
    type: undefined,
    severity: undefined,
    is_active: undefined,
    page: 1,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rules', filters],
    queryFn: () => riskRulesApi.getAll(filters),
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === '__all__' ? undefined : value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-text">Reglas de Riesgo</h1>
        <p className="text-lg text-text/70">Configure y gestione las reglas de control de riesgo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Reglas Activas"
          value={data?.data.filter(r => r.is_active).length || 0}
          icon={<Shield className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Reglas Críticas"
          value={data?.data.filter(r => r.severity === 'hard').length || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="danger"
        />
        <StatCard
          title="Total de Acciones"
          value={data?.data.reduce((acc, rule) => acc + (rule.actions_count || 0), 0) || 0}
          icon={<Users className="h-6 w-6" />}
          color="info"
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
                placeholder="Buscar reglas..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.type ?? '__all__'}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de regla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los tipos</SelectItem>
                {RULE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.severity ?? '__all__'}
              onValueChange={(value) => handleFilterChange('severity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas las severidades</SelectItem>
                {SEVERITY_TYPES.map((severity) => (
                  <SelectItem key={severity.value} value={severity.value}>
                    {severity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                filters.is_active === undefined
                  ? '__all__'
                  : filters.is_active
                  ? 'true'
                  : 'false'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'is_active',
                  value === '__all__' ? undefined : value === 'true'
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los estados</SelectItem>
                <SelectItem value="true">Activas</SelectItem>
                <SelectItem value="false">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Reglas</CardTitle>
            <p className="text-sm text-text/70 mt-1">Configuración, severidad y acciones asociadas</p>
          </div>
          <Button asChild size="default">
            <Link href="/rules/create">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Regla
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando reglas..."
            errorMessage="Error al cargar las reglas"
          />

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Severidad</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Acciones</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Incidentes</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Creada</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-text/70 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((rule) => (
                      <tr key={rule.id} className="border-b border-border hover:bg-surface/40 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-text">{rule.name}</div>
                            <div className="text-sm text-text/60">
                              {rule.description?.slice(0, 50) || 'Sin descripción'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">
                            {formatRuleType(rule.type)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={rule.severity === 'hard' ? 'destructive' : 'outline'}
                          >
                            {formatSeverity(rule.severity)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {rule.actions_count || 0}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                              <Link href={`/rules/actions/${rule.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">
                            {rule.incidents_count || 0}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${rule.is_active ? 'bg-success' : 'bg-text/30'}`} />
                            <span className="text-sm text-text/80">
                              {rule.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text/70">
                          {formatDate(rule.created_at, 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                              <Link href={`/rules/edit/${rule.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:bg-danger/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
  color?: 'primary' | 'danger' | 'info'
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
    info: {
      bg: 'bg-gradient-to-br from-info/10 to-info/5',
      border: 'border-info/20',
      icon: 'bg-info text-white',
      text: 'text-info',
      label: 'text-info/80'
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
