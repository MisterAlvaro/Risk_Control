"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIncident, useResolveIncident } from "@/lib/queries"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const incidentId = Number.parseInt(resolvedParams.id)
  const { toast } = useToast()

  const { data: incident, isLoading } = useIncident(incidentId)
  const resolveMutation = useResolveIncident()

  const handleResolve = async () => {
    try {
      await resolveMutation.mutateAsync(incidentId)
      toast({
        title: "Incident resolved",
        description: "The incident has been marked as resolved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve incident",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!incident) {
    return <div className="text-center text-muted-foreground">Incident not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/incidents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Incident #{incident.id}</h1>
          <p className="text-muted-foreground">Violation detected on {incident.account_login}</p>
        </div>
        {incident.status !== "resolved" && (
          <Button onClick={handleResolve} disabled={resolveMutation.isPending}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Resolved
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Basic information about the violation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge variant="outline" className={`mt-1 ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Account</div>
                <Link href={`/accounts/${incident.account_id}`}>
                  <Button variant="link" className="h-auto p-0 mt-1 text-base">
                    {incident.account_login}
                  </Button>
                </Link>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Risk Rule</div>
                <Link href={`/risk-rules/${incident.risk_rule_id}`}>
                  <Button variant="link" className="h-auto p-0 mt-1 text-base">
                    {incident.rule_name}
                  </Button>
                </Link>
              </div>
              {incident.trade_id && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Trade</div>
                  <Link href={`/trades/${incident.trade_id}`}>
                    <Button variant="link" className="h-auto p-0 mt-1 text-base">
                      #{incident.trade_id}
                    </Button>
                  </Link>
                </div>
              )}
              {incident.trade_volume && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Trade Volume</div>
                  <div className="mt-1 font-semibold">{incident.trade_volume}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="mt-1 font-medium">{format(new Date(incident.created_at), "MMM dd, yyyy HH:mm:ss")}</div>
              </div>
              {incident.resolved_at && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Resolved At</div>
                  <div className="mt-1 font-medium">
                    {format(new Date(incident.resolved_at), "MMM dd, yyyy HH:mm:ss")}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violation Data</CardTitle>
            <CardDescription>Detailed information about the violation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4">
              <pre className="text-sm overflow-auto">{JSON.stringify(incident.violation_data, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
