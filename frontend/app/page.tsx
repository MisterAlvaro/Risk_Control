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
      <div className="space-y-12">
        {/* DASHBOARD HEADER */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-text">Dashboard</h1>
          <p className="text-lg text-text/70">Monitoreo general de riesgo y actividad del sistema</p>
        </div>

        {/* STATS GRID - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Reglas Activas"
            value={totalRules}
            icon={<Shield className="h-6 w-6" />}
            color="primary"
          />
          <StatCard
            title="Cuentas Monitoreadas"
            value={totalAccounts}
            icon={<Users className="h-6 w-6" />}
            color="info"
          />
          <StatCard
            title="Incidentes Activos"
            value={activeIncidents}
            icon={<AlertTriangle className="h-6 w-6" />}
            color="danger"
          />
          <StatCard
            title="Cuentas en Riesgo"
            value={accountsWithIncidents}
            icon={<TrendingUp className="h-6 w-6" />}
            color="warning"
          />
        </div>

        {/* ACTIVITY SECTION */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle>Actividad de Incidentes</CardTitle>
            <p className="text-sm text-text/70 mt-1">Últimos 30 días</p>
          </CardHeader>
          <CardContent className="min-h-[240px] flex items-center justify-center text-text/50">
            <p className="text-sm">Gráfico de actividad (integración con Recharts próximamente)</p>
          </CardContent>
        </Card>

        {/* TWO COLUMN LAYOUT: INCIDENTS + RULES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Incidentes Recientes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/incidents">Ver todos →</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {incidentsData?.data.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-text/50 text-sm">
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

          {/* Active Rules */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Reglas Activas</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/rules">Ver todas →</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {rulesData?.data.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-text/50 text-sm">
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

        {/* ACCOUNTS AT RISK TABLE */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cuentas con Mayor Riesgo</CardTitle>
                <p className="text-sm text-text/70 mt-1">Top 5 por incidentes activos</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/accounts">Ver todas →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Cuenta</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Incidentes</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Estado Trading</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text/70 uppercase tracking-wide">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsData?.data
                    .filter(acc => (acc.active_incidents_count || 0) > 0)
                    .slice(0, 5)
                    .map((account) => (
                      <tr key={account.id} className="border-b border-border hover:bg-surface/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-text">{account.login}</td>
                        <td className="px-6 py-4">
                          <Badge className={getRiskLevelColor(
                            (account.active_incidents_count || 0) >= 5 ? 'critical' :
                            (account.active_incidents_count || 0) >= 3 ? 'high' :
                            (account.active_incidents_count || 0) >= 1 ? 'medium' : 'low'
                          )}>
                            {account.active_incidents_count} activos
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={account.trading_status === 'enable' ? 'default' : 'destructive'}>
                            {account.trading_status === 'enable' ? 'Activo' : 'Deshabilitado'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary-light/10">
                            <Link href={`/accounts/${account.id}/risk`}>Detalles</Link>
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
    </QueryProvider>
  )
}

// STAT CARD with better styling
function StatCard({
  title,
  value,
  icon,
  color = 'primary',
}: {
  title: string
  value: number
  icon: React.ReactNode
  color?: 'primary' | 'info' | 'danger' | 'warning'
}) {
  const colorClass = {
    primary: 'bg-primary text-white',
    info: 'bg-info text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-white',
  }[color]

  return (
    <Card className="border border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-text/70 uppercase tracking-wide">{title}</p>
            <p className="mt-3 text-3xl font-bold text-text">{formatNumber(value)}</p>
          </div>
          <div className={`rounded-lg p-3 ${colorClass} shadow-md`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IncidentItem({ incident }: { incident: any }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-surface/40 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 rounded-lg bg-danger/10 p-2">
          <AlertTriangle className="h-4 w-4 text-danger" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text truncate">{incident.rule_name}</p>
          <p className="text-sm text-text/60 truncate">
            {incident.account_login}
          </p>
        </div>
      </div>
      <Badge variant="outline">Pendiente</Badge>
    </div>
  )
}

function RuleItem({ rule }: { rule: any }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-surface/40 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text truncate">{rule.name}</p>
          <p className="text-sm text-text/60">
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

// Remove old MiniStatCard component - no longer used