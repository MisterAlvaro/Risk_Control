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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/80">Operación</p>
          <h1 className="text-3xl font-bold tracking-tight">Cuentas de Trading</h1>
          <p className="text-muted-foreground">
            Gestione las cuentas monitoreadas por el sistema
          </p>
        </div>
        <Button variant="outline" size="lg">
          <User className="mr-2 h-4 w-4" />
          Importar Cuentas
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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

            <div className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Cuentas"
          value={data?.meta.total || 0}
          icon={<User className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Con Incidentes"
          value={data?.data.filter(acc => (acc.active_incidents_count || 0) > 0).length || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title="Trading Activo"
          value={data?.data.filter(acc => acc.trading_status === 'enable').length || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Alto Riesgo"
          value={data?.data.filter(acc => (acc.active_incidents_count || 0) >= 3).length || 0}
          icon={<Shield className="h-5 w-5" />}
          color="red"
        />
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Cuentas</CardTitle>
            <p className="text-sm text-muted-foreground">Resumen de estado, riesgo y actividad</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-[0.08em]">
            {data?.meta.total || 0} registradas
          </Badge>
        </CardHeader>
        <CardContent>
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando cuentas..."
            errorMessage="Error al cargar las cuentas"
          />

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto rounded-xl border border-border/70 bg-white/70 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/70">
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Login</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Trades</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Incidentes</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Estado Trading</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Estado Cuenta</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Riesgo</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Última Actividad</th>
                      <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((account) => {
                      const riskLevel = 
                        (account.active_incidents_count || 0) >= 5 ? 'critical' :
                        (account.active_incidents_count || 0) >= 3 ? 'high' :
                        (account.active_incidents_count || 0) >= 1 ? 'medium' : 'low'
                      
                      return (
                        <tr key={account.id} className="border-b border-border/60 hover:bg-primary/5 transition-colors">
                          <td className="py-3">
                            <div className="font-semibold">{account.login}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {account.id}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="space-y-1">
                              <div className="text-sm">
                                Total: {account.trades_count || 0}
                              </div>
                              <div className="text-xs text-gray-500">
                                Abiertos: {account.open_trades_count || 0}
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="space-y-1">
                              <div className="text-sm">
                                Total: {account.incidents_count || 0}
                              </div>
                              <div className="text-xs">
                                <Badge className={getRiskLevelColor(riskLevel)}>
                                  Activos: {account.active_incidents_count || 0}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge className={getStatusColor(account.trading_status)}>
                              {account.trading_status === 'enable' ? 'Activo' : 'Deshabilitado'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge className={getStatusColor(account.status)}>
                              {account.status === 'enable' ? 'Activa' : 'Deshabilitada'}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge className={getRiskLevelColor(riskLevel)}>
                              {riskLevel === 'critical' ? 'Crítico' :
                               riskLevel === 'high' ? 'Alto' :
                               riskLevel === 'medium' ? 'Medio' : 'Bajo'}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm text-gray-500">
                            {formatDate(account.updated_at, 'dd/MM/yyyy')}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/accounts/${account.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/accounts/${account.id}/risk`}>
                                  <Shield className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/accounts/${account.id}/trades`}>
                                  <TrendingUp className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
