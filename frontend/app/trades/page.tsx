'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Eye,
  Calendar,
  DollarSign,
  Package,
  User,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/shared/pagination'
import { ApiStatus } from '@/components/shared/api-status'
import { tradesApi } from '@/lib/api/endpoints'
import { 
  formatDate, 
  formatNumber,
  formatTradeDuration,
  getStatusColor 
} from '@/lib/utils/formatters'
import { TRADE_STATUS, TRADE_TYPES } from '@/lib/utils/constants'

export default function TradesPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    type: undefined,
    account_id: undefined,
    from_date: '',
    to_date: '',
    page: 1,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trades', filters],
    queryFn: () => {
      const filtersToSend = {
        ...filters,
        account_id:
          typeof filters.account_id === 'string'
            ? filters.account_id
              ? Number(filters.account_id)
              : undefined
            : filters.account_id,
      };
      return tradesApi.getAll(filtersToSend);
    },
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === '__all__' ? undefined : value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Calculate statistics
  const calculateStats = () => {
    const trades = data?.data || []
    
    const totalTrades = trades.length
    const openTrades = trades.filter(t => t.status === 'open').length
    const closedTrades = trades.filter(t => t.status === 'closed').length
    const buyTrades = trades.filter(t => t.type === 'BUY').length
    const sellTrades = trades.filter(t => t.type === 'SELL').length
    const totalVolume = trades.reduce((sum, trade) => sum + (trade.volume || 0), 0)
    const tradesWithIncidents = trades.filter(t => (t.incidents_count || 0) > 0).length
    
    return {
      totalTrades,
      openTrades,
      closedTrades,
      buyTrades,
      sellTrades,
      totalVolume,
      tradesWithIncidents,
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-text">Trades</h1>
        <p className="text-lg text-text/70">Historial completo de operaciones de trading y seguimiento</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          icon={<TrendingUp className="h-6 w-6" />}
          change={`${stats.openTrades} abiertos`}
          color="primary"
        />
        <StatCard
          title="Volumen Total"
          value={formatNumber(stats.totalVolume)}
          icon={<Package className="h-6 w-6" />}
          change={`${stats.buyTrades} BUY, ${stats.sellTrades} SELL`}
          color="primary"
        />
        <StatCard
          title="Trades Cerrados"
          value={stats.closedTrades}
          icon={<DollarSign className="h-6 w-6" />}
          change={`${stats.openTrades} aún abiertos`}
          color="info"
        />
        <StatCard
          title="Con Incidentes"
          value={stats.tradesWithIncidents}
          icon={<AlertTriangle className="h-6 w-6" />}
          change={`${stats.totalTrades > 0 ? ((stats.tradesWithIncidents / stats.totalTrades) * 100).toFixed(1) : 0}% del total`}
          color={stats.tradesWithIncidents > 0 ? 'warning' : 'primary'}
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
                placeholder="Buscar por ID o cuenta..."
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
                {TRADE_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type ?? '__all__'}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los tipos</SelectItem>
                {TRADE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({
                search: '',
                status: undefined,
                type: undefined,
                account_id: undefined,
                from_date: '',
                to_date: '',
                page: 1,
              })}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Lista de Trades</CardTitle>
          <p className="text-sm text-text/70 mt-1">Detalle completo de todas las operaciones de trading</p>
        </CardHeader>
        <CardContent className="p-0">
          <ApiStatus
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            loadingMessage="Cargando trades..."
            errorMessage="Error al cargar los trades"
          />

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface/50 border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Cuenta</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Volumen</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Precios</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Duración</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Incidentes</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.data.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center">
                          <TrendingUp className="mx-auto h-12 w-12 text-text/30" />
                          <h3 className="mt-4 text-lg font-semibold text-text">No hay trades</h3>
                          <p className="mt-2 text-text/70">No se encontraron operaciones de trading con los filtros seleccionados</p>
                        </td>
                      </tr>
                    ) : (
                      data?.data.map((trade) => (
                        <tr key={trade.id} className="border-border hover:bg-surface/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-text">#{trade.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="text-text font-medium">{trade.account_login}</div>
                              <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                                <Link href={`/accounts/${trade.account_id}`} title="Ver cuenta">
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              className={trade.type === 'BUY' ? 'bg-primary text-white' : 'bg-surface border border-border text-text'}
                            >
                              {trade.type === 'BUY' ? 'BUY' : 'SELL'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-text">{trade.volume} lots</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm">
                              <div className="text-text">Apertura: {trade.open_price}</div>
                              {trade.close_price && (
                                <div className="text-text/70">Cierre: {trade.close_price}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(trade.status)}>
                              {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-text">
                            {trade.duration_seconds 
                              ? formatTradeDuration(trade.duration_seconds)
                              : '-'}
                          </td>
                          <td className="px-6 py-4">
                            {(trade.incidents_count || 0) > 0 ? (
                              <Badge className="bg-danger text-white">
                                {trade.incidents_count}
                              </Badge>
                            ) : (
                              <Badge className="bg-success text-white">
                                0
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-text/70">
                            {formatDate(trade.open_time, 'dd/MM/yy')}
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/trades/${trade.id}`} title="Ver detalles">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))
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
  change,
  color = 'primary',
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color?: 'primary' | 'danger' | 'warning' | 'info'
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
          {change && (
            <p className="mt-2 text-sm text-text/70">
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-2xl p-4 ${colorConfig.icon} shadow-lg transform transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  )
}