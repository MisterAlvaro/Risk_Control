'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { riskRulesApi, incidentsApi, accountsApi } from '@/lib/api/endpoints'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatNumber, getRiskLevelColor, getStatusColor } from '@/lib/utils/formatters'
import Link from 'next/link'
import { QueryProvider } from '@/components/providers/query-provider'

export default function DashboardPage() {
  // Fetch data
  const { data: rulesData, isLoading: isLoadingRules } = useQuery({
    queryKey: ['dashboard', 'rules'],
    queryFn: () => riskRulesApi.getAll({ is_active: true, page: 1 })
  })

  const { data: incidentsData, isLoading: isLoadingIncidents } = useQuery({
    queryKey: ['dashboard', 'incidents'],
    queryFn: () => incidentsApi.getAll({ status: 'pending', page: 1 })
  })

  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['dashboard', 'accounts'],
    queryFn: () => accountsApi.getAll({ page: 1 })
  })

  const isLoading = isLoadingRules || isLoadingIncidents || isLoadingAccounts

  if (isLoading) {
    return (
      <QueryProvider>
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </QueryProvider>
    )
  }

  const totalRules = rulesData?.meta.total || 0
  const totalAccounts = accountsData?.meta.total || 0
  const activeIncidents = incidentsData?.meta.total || 0
  
  // Calculate metrics
  const accountsWithIncidents = accountsData?.data.filter(
    acc => (acc.active_incidents_count || 0) > 0
  ).length || 0

  const disabledAccounts = accountsData?.data.filter(
    acc => !acc.is_trading_enabled
  ).length || 0

  return (
    <QueryProvider>
      <div className="space-y-10 px-2 max-w-7xl mx-auto">
        {/* DASHBOARD HEADER */}
        <div className="mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary">Dashboard</h1>
          <p className="mt-1 text-lg text-muted-foreground">Panel general y monitoreo de riesgo del sistema</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
          <MiniStatCard
            title="Reglas Activas"
            value={totalRules}
            icon={<Shield className="h-7 w-7" />}
            color="primary"
          />
          <MiniStatCard
            title="Cuentas Monitoreadas"
            value={totalAccounts}
            icon={<Users className="h-7 w-7" />}
            color="secondary"
          />
          <MiniStatCard
            title="Incidentes Activos"
            value={activeIncidents}
            icon={<AlertTriangle className="h-7 w-7" />}
            color="red"
          />
          <MiniStatCard
            title="Cuentas con Riesgo"
            value={accountsWithIncidents}
            icon={<TrendingUp className="h-7 w-7" />}
            color="amber"
          />
        </div>

        {/* ACTIVITY CHART / PLACEHOLDER */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/80 shadow flex flex-col items-start justify-between gap-6 p-8 min-h-[260px]">
          {/* Aquí integraría un chart con recharts || chart.js || nivo,
          utilizando incidentsApi.getAll({from_date, to_date}) para obtener
          la serie de incidentes por día/mes. Ejemplo de configuración con datos luego.
          */}
          <h2 className="text-xl font-semibold mb-4">Actividad de Incidentes (próximamente gráfico)</h2>
          <div className="flex-1 w-full flex items-center justify-center text-xl text-secondary/60">
            (Widget visual de actividad por fecha, integra chart.js aquí)
          </div>
        </div>

        {/* INCIDENTES Y REGLAS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
          {/* Incidentes recientes */}
          <Card className="h-full">
            <CardHeader className="border-b bg-white/95 rounded-t-xl">
              <div className="flex flex-row justify-between items-center">
                <CardTitle className="text-base">Incidentes recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/incidents">Ver todos</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto p-1">
                {incidentsData?.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground italic">
                    No hay incidentes recientes
                  </div>
                ) : (
                  incidentsData?.data.slice(0, 5).map((incident) => (
                    <IncidentItem key={incident.id} incident={incident} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reglas más activas */}
          <Card className="h-full">
            <CardHeader className="border-b bg-white/95 rounded-t-xl">
              <div className="flex flex-row justify-between items-center">
                <CardTitle className="text-base">Reglas más activas</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/rules">Ver todas</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto p-1">
                {rulesData?.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground italic">
                    No hay reglas activas
                  </div>
                ) : (
                  rulesData?.data.slice(0, 5).map((rule) => (
                    <RuleItem key={rule.id} rule={rule} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE: Cuentas con Mayor Riesgo */}
        <div className="mt-10 rounded-2xl border border-border/70 bg-white/80 shadow-sm">
          <div className="flex items-center justify-between px-8 pt-6">
            <h2 className="text-base font-semibold text-secondary">Cuentas con Mayor Riesgo</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/accounts">Ver todas</Link>
            </Button>
          </div>
          <div className="overflow-x-auto px-8 pb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/70">
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Cuenta</th>
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Incidentes</th>
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Estado</th>
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Último Incidente</th>
                  <th className="py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accountsData?.data
                  .filter(acc => (acc.active_incidents_count || 0) > 0)
                  .slice(0, 5)
                  .map((account) => (
                    <tr key={account.id} className="border-b border-border/60 hover:bg-primary/10 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold">{account.login}</div>
                      </td>
                      <td className="py-3">
                        <Badge className={getRiskLevelColor(
                          (account.active_incidents_count || 0) >= 5 ? 'critical' :
                          (account.active_incidents_count || 0) >= 3 ? 'high' :
                          (account.active_incidents_count || 0) >= 1 ? 'medium' : 'low'
                        )}>
                          {account.active_incidents_count} activos
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(account.trading_status)}>
                          {account.trading_status === 'enable' ? 'Trading Activo' : 'Trading Deshabilitado'}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-500">Hace 2 horas</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/accounts/${account.id}/risk`}>Ver Detalles</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </QueryProvider>
  )
}

// Helper Components
function StatCard({
  title,
  value,
  icon,
  change,
  trend,
  href,
  isCritical = false,
  isWarning = false,
}: {
  title: string
  value: number
  icon: React.ReactNode
  change: string
  trend: 'up' | 'down' | 'neutral'
  href?: string
  isCritical?: boolean
  isWarning?: boolean
}) {
  const content = (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${
              isCritical ? 'text-red-600' : 
              isWarning ? 'text-amber-600' : 
              'text-gray-900'
            }`}>
              {formatNumber(value)}
            </p>
            <div className="mt-2 flex items-center text-sm">
              {trend === 'up' && <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />}
              {trend === 'down' && <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />}
              <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                {change}
              </span>
            </div>
          </div>
          <div className={`rounded-lg p-3 ${
            isCritical ? 'bg-red-100' : 
            isWarning ? 'bg-amber-100' : 
            'bg-primary/10'
          }`}>
            <div className={isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-primary'}>
              {icon}
            </div>
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

function IncidentItem({ incident }: { incident: any }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-100 p-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <p className="font-medium">Regla: {incident.rule_name}</p>
          <p className="text-sm text-gray-500">
            Cuenta: {incident.account_login}
          </p>
        </div>
      </div>
      <Badge variant="outline" className="bg-yellow-50">
        Pendiente
      </Badge>
    </div>
  )
}

function RuleItem({ rule }: { rule: any }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2">
          <Shield className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{rule.name}</p>
          <p className="text-sm text-gray-500">
            {rule.incidents_count || 0} incidentes • {rule.severity === 'hard' ? 'Crítica' : 'Advertencia'}
          </p>
        </div>
      </div>
      <Badge variant={rule.is_active ? 'default' : 'outline'}>
        {rule.is_active ? 'Activa' : 'Inactiva'}
      </Badge>
    </div>
  )
}

// Nuevo componente de métricas mini-dashboard estilo widget
function MiniStatCard({title, value, icon, color}: {title: string, value: number, icon: JSX.Element, color: 'primary'|'secondary'|'amber'|'red'}) {
  const colors: any = {
    primary: 'bg-primary/90 text-secondary',
    secondary: 'bg-secondary/90 text-primary',
    amber: 'bg-amber-200 text-amber-900',
    red: 'bg-red-200 text-red-900',
  }
  return (
    <div className={`rounded-2xl shadow-md flex flex-col items-center justify-center h-36 min-h-[132px] p-4 gap-2 ${colors[color]}`} style={{minWidth:120}}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow">{icon}</div>
      <span className="mt-2 text-[2.15rem] font-extrabold tabular-nums">{value}</span>
      <span className="text-xs font-medium text-secondary uppercase tracking-wide mt-1 text-center">{title}</span>
    </div>
  )
}