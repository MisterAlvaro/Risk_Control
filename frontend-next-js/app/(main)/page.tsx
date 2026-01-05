"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table"
import { RiskAccountsList } from "@/components/dashboard/risk-accounts-list"
import { useRiskRules, useIncidents, useAccounts } from "@/lib/queries"
import { ShieldAlert, AlertCircle, Users, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: rulesData, isLoading: rulesLoading } = useRiskRules({ is_active: "1", page: 1 })
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents({
    status: "pending",
    page: 1,
  })
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ page: 1 })

  const activeRules = rulesData?.meta?.total || 0
  const activeIncidents = incidentsData?.meta?.total || 0
  const totalAccounts = accountsData?.meta?.total || 0

  const recentIncidents = incidentsData?.data?.slice(0, 5) || []
  const highRiskAccounts = accountsData?.data?.filter((acc) => acc.active_incidents_count > 0).slice(0, 5) || []

  const isLoading = rulesLoading || incidentsLoading || accountsLoading

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your trading risk management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Active Rules"
              value={activeRules}
              description="Total risk rules configured"
              icon={ShieldAlert}
            />
            <StatCard
              title="Active Incidents"
              value={activeIncidents}
              description="Pending resolution"
              icon={AlertCircle}
            />
            <StatCard title="Total Accounts" value={totalAccounts} description="Monitored accounts" icon={Users} />
            <StatCard title="System Status" value="Operational" description="All systems running" icon={Activity} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Latest risk violations detected</CardDescription>
          </CardHeader>
          <CardContent>
            {incidentsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <RecentIncidentsTable incidents={recentIncidents} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High Risk Accounts</CardTitle>
            <CardDescription>Accounts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <RiskAccountsList accounts={highRiskAccounts} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
