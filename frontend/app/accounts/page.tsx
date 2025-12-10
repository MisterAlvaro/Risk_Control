'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Search, 
  User, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Filter,
  Shield
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/shared/pagination'
import { ApiStatus } from '@/components/shared/api-status'
import { accountsApi } from '@/lib/api/endpoints'
import { 
  formatDate, 
  getRiskLevelColor, 
  getStatusColor,
  formatNumber 
} from '@/lib/utils/formatters'

export default function AccountsPage() {
  const [filters, setFilters] = useState({
    search: '',
    trading_status: '',
    status: '',
    page: 1,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => accountsApi.getAll(filters),
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-text">Cuentas de Trading</h1>
        <p className="text-lg text-text/70">Gestione y monitoree todas las cuentas del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cuentas"
          value={data?.meta.total || 0}
          icon={<User className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Con Incidentes"
          value={data?.data.filter(acc => (acc.active_incidents_count || 0) > 0).length || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="warning"
        />
        <StatCard
          title="Trading Activo"
          value={data?.data.filter(acc => acc.trading_status === 'enable').length || 0}
          icon={<TrendingUp className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Alto Riesgo"
          value={data?.data.filter(acc => (acc.active_incidents_count || 0) >= 3).length || 0}
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
                placeholder="Buscar por login..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filters.trading_status || 'all'}
              onValueChange={(value) => handleFilterChange('trading_status', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado de Trading" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enable">Trading Activo</SelectItem>
                <SelectItem value="disable">Trading Deshabilitado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado de Cuenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enable">Cuenta Activa</SelectItem>
                <SelectItem value="disable">Cuenta Deshabilitada</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({
                search: '',
                trading_status: '',
                status: '',
                page: 1,
              })}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Cuentas</CardTitle>
            <p className="text-sm text-text/70 mt-1">Resumen de estado, riesgo y actividad</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {data?.meta.total || 0} registradas
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando cuentas..."
            errorMessage="Error al cargar las cuentas"
          />

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface/50 border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Login</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Trades</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Incidentes</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Estado Trading</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Estado Cuenta</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Riesgo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Última Actividad</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <User className="mx-auto h-12 w-12 text-text/30" />
                          <h3 className="mt-4 text-lg font-semibold text-text">No hay cuentas</h3>
                          <p className="mt-2 text-text/70">Comience importando cuentas de trading</p>
                        </td>
                      </tr>
                    ) : (
                      data?.data.map((account) => {
                        const riskLevel = 
                          (account.active_incidents_count || 0) >= 5 ? 'critical' :
                          (account.active_incidents_count || 0) >= 3 ? 'high' :
                          (account.active_incidents_count || 0) >= 1 ? 'medium' : 'low'
                        
                        return (
                          <tr key={account.id} className="border-border hover:bg-surface/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-text">{account.login}</div>
                              <div className="text-xs text-text/70">
                                ID: {account.id}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="text-sm text-text">
                                  Total: {account.trades_count || 0}
                                </div>
                                <div className="text-xs text-text/70">
                                  Abiertos: {account.open_trades_count || 0}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="text-sm text-text">
                                  Total: {account.incidents_count || 0}
                                </div>
                                <div className="text-xs">
                                  <Badge className={getRiskLevelColor(riskLevel)}>
                                    Activos: {account.active_incidents_count || 0}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={getStatusColor(account.trading_status)}>
                                {account.trading_status === 'enable' ? 'Activo' : 'Deshabilitado'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={getStatusColor(account.status)}>
                                {account.status === 'enable' ? 'Activa' : 'Deshabilitada'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={getRiskLevelColor(riskLevel)}>
                                {riskLevel === 'critical' ? 'Crítico' :
                                 riskLevel === 'high' ? 'Alto' :
                                 riskLevel === 'medium' ? 'Medio' : 'Bajo'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-text/70">
                              {formatDate(account.updated_at, 'dd/MM/yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/accounts/${account.id}`} title="Ver detalles">
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/accounts/${account.id}/risk`} title="Ver riesgo">
                                    <Shield className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/accounts/${account.id}/trades`} title="Ver trades">
                                    <TrendingUp className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
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
