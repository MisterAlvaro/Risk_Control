'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  Shield,
  Calendar,
  RefreshCw,
  Mail,
  Bell,
  Eye,
  FileText
} from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Tabs, { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { accountsApi, incidentsApi, tradesApi } from '@/lib/api/endpoints'
import { 
  formatDate, 
  getRiskLevelColor, 
  getStatusColor,
  formatNumber 
} from '@/lib/utils/formatters'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ApiStatus } from '@/components/shared/api-status'

export default function AccountDetailPage() {
  const params = useParams()
  const accountId = parseInt(params.id as string)

  // Fetch account data
  const { data: accountData, isLoading, error, refetch } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountsApi.getById(accountId),
    enabled: !!accountId,
  })

  // Fetch recent incidents
  const { data: incidentsData } = useQuery({
    queryKey: ['account-incidents', accountId],
    queryFn: () => incidentsApi.getByAccount(accountId, 1),
    enabled: !!accountId,
  })

  // Fetch recent trades
  const { data: tradesData } = useQuery({
    queryKey: ['account-trades', accountId],
    queryFn: () => accountsApi.getTrades(accountId, 1),
    enabled: !!accountId,
  })

  // Fetch risk status
  const { data: riskStatusData } = useQuery({
    queryKey: ['account-risk', accountId],
    queryFn: () => accountsApi.getRiskStatus(accountId),
    enabled: !!accountId,
  })

  const account = accountData?.data
  const recentIncidents = incidentsData?.data.slice(0, 5) || []
  const recentTrades = tradesData?.data.slice(0, 5) || []
  const riskStatus = riskStatusData?.risk_status

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !account) {
    return (
      <ApiStatus
        isLoading={false}
        error={error}
        refetch={refetch}
        errorMessage="Error al cargar la cuenta"
      />
    )
  }

  const riskLevel = riskStatus?.risk_level || 'low'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/accounts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/80">Cuenta</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Cuenta #{account.login}
              </h1>
              <Badge className={getRiskLevelColor(riskLevel)}>
                {riskLevel === 'critical' ? 'Crítico' :
                 riskLevel === 'high' ? 'Alto' :
                 riskLevel === 'medium' ? 'Medio' : 'Bajo'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Detalles y actividad de la cuenta de trading
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Trades Totales"
          value={account.trades_count || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          description={`${account.open_trades_count || 0} abiertos`}
          color="blue"
        />
        <StatCard
          title="Incidentes"
          value={account.incidents_count || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          description={`${account.active_incidents_count || 0} activos`}
          color={account.active_incidents_count ? 'yellow' : 'green'}
        />
        <StatCard
          title="Estado Trading"
          value={account.trading_status === 'enable' ? 'Activo' : 'Deshabilitado'}
          icon={<Shield className="h-5 w-5" />}
          description={account.is_trading_enabled ? 'Operativo' : 'No operativo'}
          color={account.trading_status === 'enable' ? 'green' : 'red'}
        />
        <StatCard
          title="Miembro desde"
          value={new Date(account.created_at).getFullYear().toString()}
          icon={<Calendar className="h-5 w-5" />}
          description={formatDate(account.created_at, 'dd/MM/yyyy')}
          color="gray"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="risk">Análisis de Riesgo</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoRow label="Login" value={account.login} />
                  <InfoRow label="ID" value={account.id} />
                  <InfoRow 
                    label="Estado Trading" 
                    value={
                      <Badge className={getStatusColor(account.trading_status)}>
                        {account.trading_status === 'enable' ? 'Activo' : 'Deshabilitado'}
                      </Badge>
                    } 
                  />
                  <InfoRow 
                    label="Estado Cuenta" 
                    value={
                      <Badge className={getStatusColor(account.status)}>
                        {account.status === 'enable' ? 'Activa' : 'Deshabilitada'}
                      </Badge>
                    } 
                  />
                  <InfoRow 
                    label="Trading Habilitado" 
                    value={account.is_trading_enabled ? 'Sí' : 'No'} 
                    isPositive={account.is_trading_enabled}
                  />
                  <InfoRow label="Creada" value={formatDate(account.created_at)} />
                  <InfoRow label="Última Actualización" value={formatDate(account.updated_at)} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Actividad Reciente</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/accounts/${accountId}/trades`}>
                    Ver todos
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentTrades.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No hay trades recientes
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">
                            {trade.type} • {trade.volume} lots
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(trade.open_time, 'HH:mm')} • {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                          </div>
                        </div>
                        <Badge variant={trade.type === 'BUY' ? 'default' : 'outline'}>
                          {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Incidentes Recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/accounts/${accountId}/risk`}>
                    Ver análisis completo
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentIncidents.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sin incidentes
                    </h3>
                    <p className="text-gray-600">
                      No se han detectado violaciones de reglas
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Regla</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Trade</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Detalles</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentIncidents.map((incident) => (
                          <tr key={incident.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-medium">{incident.rule_name}</div>
                            </td>
                            <td className="py-3">
                              {incident.trade_id ? (
                                <Link 
                                  href={`/trades/${incident.trade_id}`}
                                  className="text-primary hover:underline"
                                >
                                  #{incident.trade_id}
                                </Link>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {incident.violation_data?.duration_seconds && (
                                <div>Duración: {incident.violation_data.duration_seconds}s</div>
                              )}
                              {incident.violation_data?.current_volume && (
                                <div>Volumen: {incident.violation_data.current_volume}</div>
                              )}
                            </td>
                            <td className="py-3">
                              <Badge className={getStatusColor(incident.status)}>
                                {incident.status === 'pending' ? 'Pendiente' :
                                 incident.status === 'processed' ? 'Procesado' : 'Acción Ejecutada'}
                              </Badge>
                            </td>
                            <td className="py-3 text-sm text-gray-500">
                              {formatDate(incident.created_at, 'dd/MM/yy HH:mm')}
                            </td>
                            <td className="py-3">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/incidents/${incident.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <IncidentsTab accountId={accountId} />
        </TabsContent>

        {/* Trades Tab */}
        <TabsContent value="trades">
          <TradesTab accountId={accountId} />
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk">
          <RiskAnalysisTab accountId={accountId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  description,
  color = 'blue',
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
  color: 'blue' | 'red' | 'green' | 'yellow' | 'gray'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ 
  label, 
  value, 
  isPositive 
}: { 
  label: string
  value: React.ReactNode
  isPositive?: boolean
}) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${
        isPositive === true ? 'text-green-600' : 
        isPositive === false ? 'text-red-600' : 
        ''
      }`}>
        {value}
      </span>
    </div>
  )
}

// Components for tabs
function IncidentsTab({ accountId }: { accountId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['account-all-incidents', accountId],
    queryFn: () => incidentsApi.getByAccount(accountId),
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const incidents = data?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos los Incidentes</CardTitle>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No hay incidentes
            </h3>
            <p className="mt-2 text-gray-600">
              No se han detectado violaciones de reglas para esta cuenta
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Regla</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Trade</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Detalles</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">#{incident.id}</td>
                    <td className="py-3">
                      <div className="font-medium">{incident.rule_name}</div>
                    </td>
                    <td className="py-3">
                      {incident.trade_id ? (
                        <Link 
                          href={`/trades/${incident.trade_id}`}
                          className="text-primary hover:underline"
                        >
                          #{incident.trade_id}
                        </Link>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {incident.violation_data && (
                        <div className="max-w-xs">
                          {JSON.stringify(incident.violation_data)}
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status === 'pending' ? 'Pendiente' :
                         incident.status === 'processed' ? 'Procesado' : 'Acción Ejecutada'}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {formatDate(incident.created_at)}
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/incidents/${incident.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TradesTab({ accountId }: { accountId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['account-all-trades', accountId],
    queryFn: () => accountsApi.getTrades(accountId),
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const trades = data?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos los Trades</CardTitle>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="py-12 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No hay trades
            </h3>
            <p className="mt-2 text-gray-600">
              No se han registrado trades para esta cuenta
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Volumen</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Precio Apertura</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Precio Cierre</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Duración</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">#{trade.id}</td>
                    <td className="py-3">
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'outline'}>
                        {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                      </Badge>
                    </td>
                    <td className="py-3">{trade.volume} lots</td>
                    <td className="py-3">{trade.open_price}</td>
                    <td className="py-3">{trade.close_price || '-'}</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(trade.status)}>
                        {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {trade.duration_seconds 
                        ? `${trade.duration_seconds}s` 
                        : '-'}
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {formatDate(trade.open_time, 'dd/MM/yy HH:mm')}
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
        )}
      </CardContent>
    </Card>
  )
}

function RiskAnalysisTab({ accountId }: { accountId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['account-risk-analysis', accountId],
    queryFn: () => accountsApi.getRiskStatus(accountId),
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const riskStatus = data?.risk_status

  if (!riskStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No se pudo cargar el análisis de riesgo
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Riesgo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Nivel de Riesgo</h3>
                <div className="mt-2">
                  <Badge className={getRiskLevelColor(riskStatus.risk_level)}>
                    {riskStatus.risk_level === 'critical' ? 'Crítico' :
                     riskStatus.risk_level === 'high' ? 'Alto' :
                     riskStatus.risk_level === 'medium' ? 'Medio' : 'Bajo'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <InfoRow label="Incidentes Totales" value={riskStatus.total_incidents} />
                <InfoRow label="Incidentes Activos" value={riskStatus.active_incidents} />
                <InfoRow 
                  label="Trading Habilitado" 
                  value={riskStatus.trading_enabled ? 'Sí' : 'No'} 
                  isPositive={riskStatus.trading_enabled}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Reglas Violadas</h3>
              <div className="space-y-3">
                {riskStatus.rule_status
                  .filter(rule => rule.is_violated)
                  .map((rule) => (
                    <div key={rule.rule_id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{rule.rule_name}</div>
                          <div className="text-sm text-gray-500">
                            {rule.rule_type} • {rule.severity}
                          </div>
                        </div>
                        <Badge variant={rule.is_violated ? 'destructive' : 'outline'}>
                          {rule.incidents_count} violaciones
                        </Badge>
                      </div>
                    </div>
                  ))}
                
                {riskStatus.rule_status.filter(rule => rule.is_violated).length === 0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <Shield className="mx-auto h-8 w-8 text-green-600" />
                    <p className="mt-2 text-green-700">
                      No hay reglas violadas actualmente
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado por Regla</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Regla</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Severidad</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Incidentes</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {riskStatus.rule_status.map((rule) => (
                  <tr key={rule.rule_id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{rule.rule_name}</div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {rule.rule_type}
                    </td>
                    <td className="py-3">
                      <Badge variant={rule.severity === 'hard' ? 'destructive' : 'outline'}>
                        {rule.severity === 'hard' ? 'Crítica' : 'Advertencia'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rule.incidents_count}</span>
                        {rule.is_violated && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge className={rule.is_violated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {rule.is_violated ? 'Violada' : 'OK'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/rules/${rule.rule_id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
