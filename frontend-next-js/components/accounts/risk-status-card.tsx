"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { RiskStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

interface RiskStatusCardProps {
  riskStatus: RiskStatus["risk_status"]
}

export function RiskStatusCard({ riskStatus }: RiskStatusCardProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1">
            <AlertTriangle className="h-3 w-3" />
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
            <CheckCircle className="h-3 w-3" />
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Overall risk level and status</CardDescription>
          </div>
          {getRiskLevelBadge(riskStatus.risk_level)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Incidents</div>
            <div className="text-2xl font-bold">{riskStatus.total_incidents}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Active Incidents</div>
            <div className="text-2xl font-bold text-destructive">{riskStatus.active_incidents}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Trading Status</div>
            <div className="text-2xl font-bold">
              {riskStatus.trading_enabled ? (
                <span className="text-green-500">ON</span>
              ) : (
                <span className="text-red-500">OFF</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Rule Status Breakdown</h4>
          {riskStatus.rule_status && riskStatus.rule_status.length > 0 ? (
            <div className="space-y-3">
              {riskStatus.rule_status.map((rule) => (
                <div key={rule.rule_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{rule.rule_name}</span>
                      {rule.is_active ? (
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs opacity-50">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-semibold">{rule.incidents_count} incidents</span>
                  </div>
                  <Progress
                    value={Math.min((rule.incidents_count / 10) * 100, 100)}
                    className={`h-2 ${rule.incidents_count > 5 ? getRiskLevelColor("critical") : ""}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No rule violations detected</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
