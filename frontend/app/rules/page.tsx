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
  type: string
  severity: string
  is_active?: boolean
  page: number
}

export default function RulesPage() {
  const [filters, setFilters] = useState<RuleFilters>({
    search: '',
    type: '',
    severity: '',
    is_active: undefined,
    page: 1,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rules', filters],
    queryFn: () => riskRulesApi.getAll(filters),
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/80">Configuración</p>
          <h1 className="text-3xl font-bold tracking-tight">Reglas de Riesgo</h1>
          <p className="text-muted-foreground">
            Configure y gestione las reglas de control de riesgo
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/rules/create">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Regla
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar reglas..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de regla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {RULE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.severity}
              onValueChange={(value) => handleFilterChange('severity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las severidades</SelectItem>
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
                  ? ''
                  : filters.is_active
                  ? 'true'
                  : 'false'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'is_active',
                  value === '' ? undefined : value === 'true'
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="true">Activas</SelectItem>
                <SelectItem value="false">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Reglas Activas"
          value={data?.data.filter(r => r.is_active).length || 0}
          icon={<Shield className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Reglas Críticas"
          value={data?.data.filter(r => r.severity === 'hard').length || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Total de Acciones"
          value={data?.data.reduce((acc, rule) => acc + (rule.actions_count || 0), 0) || 0}
          icon={<Users className="h-5 w-5" />}
          color="green"
        />
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Reglas</CardTitle>
            <p className="text-sm text-muted-foreground">Estado, severidad y acciones configuradas</p>
          </div>
        </CardHeader>
        <CardContent>
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando reglas..."
            errorMessage="Error al cargar las reglas"
          />

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto rounded-xl border border-border/70 bg-white/70 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/70">
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Nombre</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Tipo</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Severidad</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Acciones</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Incidentes</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Estado</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Creada</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((rule) => (
                      <tr key={rule.id} className="border-b border-border/60 hover:bg-primary/5 transition-colors">
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-gray-500">
                              {rule.description || 'Sin descripción'}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="bg-blue-50">
                            {formatRuleType(rule.type)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={rule.severity === 'hard' ? 'destructive' : 'outline'}
                            className={rule.severity === 'hard' ? '' : 'bg-amber-50'}
                          >
                            {formatSeverity(rule.severity)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {rule.actions_count || 0}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/rules/actions/${rule.id}`}>
                                <Eye className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="bg-gray-50">
                            {rule.incidents_count || 0}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.is_active}
                              disabled
                              className="data-[state=checked]:bg-green-500"
                            />
                            <span className="text-sm">
                              {rule.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {formatDate(rule.created_at, 'dd/MM/yyyy')}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/rules/edit/${rule.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
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
                <div className="mt-6">
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
  color = 'blue',
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green' | 'yellow'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
