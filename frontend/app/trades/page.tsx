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
  ArrowDownRight
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
    status: '',
    type: '',
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
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
          <p className="text-gray-600">
            Historial completo de operaciones de trading
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por ID o cuenta..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {TRADE_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {TRADE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({
                  search: '',
                  status: '',
                  type: '',
                  account_id: undefined,
                  from_date: '',
                  to_date: '',
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
          title="Total Trades"
          value={stats.totalTrades}
          icon={<TrendingUp className="h-5 w-5" />}
          change={`${stats.openTrades} abiertos`}
          color="blue"
        />
        <StatCard
          title="Volumen Total"
          value={formatNumber(stats.totalVolume)}
          icon={<Package className="h-5 w-5" />}
          change={`${stats.buyTrades} compras, ${stats.sellTrades} ventas`}
          color="green"
        />
        <StatCard
          title="Trades Cerrados"
          value={stats.closedTrades}
          icon={<DollarSign className="h-5 w-5" />}
          change={`${stats.openTrades} aún abiertos`}
          color="purple"
        />
        <StatCard
          title="Con Incidentes"
          value={stats.tradesWithIncidents}
          icon={<User className="h-5 w-5" />}
          change={`${((stats.tradesWithIncidents / stats.totalTrades) * 100).toFixed(1)}% del total`}
          color={stats.tradesWithIncidents > 0 ? 'yellow' : 'gray'}
        />
      </div>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Trades</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <tr className="border-b">
                      <th className="py-3 text-left text-sm font-medium text-gray-500">ID</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Cuenta</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Volumen</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Precios</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Duración</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Incidentes</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                      <th className="py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((trade) => (
                      <tr key={trade.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">#{trade.id}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{trade.account_login}</div>
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link href={`/accounts/${trade.account_id}`}>
                                <Eye className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={trade.type === 'BUY' ? 'default' : 'outline'}>
                            {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="font-medium">{trade.volume} lots</div>
                        </td>
                        <td className="py-3">
                          <div className="text-sm">
                            <div>Apertura: {trade.open_price}</div>
                            {trade.close_price && (
                              <div>Cierre: {trade.close_price}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={getStatusColor(trade.status)}>
                            {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {trade.duration_seconds 
                            ? formatTradeDuration(trade.duration_seconds)
                            : '-'}
                        </td>
                        <td className="py-3">
                          {(trade.incidents_count || 0) > 0 ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              {trade.incidents_count}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              0
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {formatDate(trade.open_time, 'dd/MM/yy')}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/trades/${trade.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
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
  change,
  color = 'blue',
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'gray'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  const isPositive = !change.includes('-')

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <div className="mt-2 flex items-center text-sm">
              {change && (
                <>
                  {isPositive ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                    {change}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}