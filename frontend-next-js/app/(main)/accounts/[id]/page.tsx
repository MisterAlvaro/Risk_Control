"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskStatusCard } from "@/components/accounts/risk-status-card"
import { IncidentsTable } from "@/components/incidents/incidents-table"
import { useAccount, useAccountRiskStatus, useIncidents, useAccountTrades, useResolveIncident } from "@/lib/queries"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistance, format } from "date-fns"

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const accountId = Number.parseInt(resolvedParams.id)
  const { toast } = useToast()
  const [incidentsPage, setIncidentsPage] = useState(1)
  const [tradesPage, setTradesPage] = useState(1)

  const { data: account, isLoading: accountLoading } = useAccount(accountId)
  const { data: riskStatusData, isLoading: riskStatusLoading } = useAccountRiskStatus(accountId)
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents({
    account_id: accountId.toString(),
    page: incidentsPage,
  })
  const { data: tradesData, isLoading: tradesLoading } = useAccountTrades(accountId, { page: tradesPage.toString() })
  const resolveMutation = useResolveIncident()

  const handleResolve = async (id: number) => {
    try {
      await resolveMutation.mutateAsync(id)
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

  if (accountLoading || riskStatusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!account || !riskStatusData) {
    return <div className="text-center text-muted-foreground">Account not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/accounts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{account.login}</h1>
          <p className="text-muted-foreground">Account ID: {account.id}</p>
        </div>
        <Badge variant={account.is_trading_enabled ? "default" : "destructive"}>
          {account.is_trading_enabled ? "Trading Enabled" : "Trading Disabled"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <Badge variant="outline" className="mt-1">
                {account.status}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Trading Status</div>
              <div className="mt-1 font-semibold">{account.trading_status}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Trades</div>
              <div className="mt-1 text-2xl font-bold">{account.trades_count}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Open Trades</div>
              <div className="mt-1 text-2xl font-bold">{account.open_trades_count}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Active Incidents</div>
              <div className="mt-1 text-2xl font-bold text-destructive">{account.active_incidents_count}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="mt-1 text-sm">{format(new Date(account.created_at), "MMM dd, yyyy")}</div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <RiskStatusCard riskStatus={riskStatusData.risk_status} />
        </div>
      </div>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incidents ({account.incidents_count})</TabsTrigger>
          <TabsTrigger value="trades">Trades ({account.trades_count})</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Incidents</CardTitle>
              <CardDescription>All risk violations for this account</CardDescription>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <>
                  <IncidentsTable incidents={incidentsData?.data || []} onResolve={handleResolve} />
                  {incidentsData && incidentsData.meta.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIncidentsPage(incidentsPage - 1)}
                        disabled={incidentsPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {incidentsPage} of {incidentsData.meta.last_page}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIncidentsPage(incidentsPage + 1)}
                        disabled={incidentsPage === incidentsData.meta.last_page}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Trades</CardTitle>
              <CardDescription>Trading history for this account</CardDescription>
            </CardHeader>
            <CardContent>
              {tradesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : tradesData && tradesData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Open Price</TableHead>
                        <TableHead>Close Price</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradesData.data.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">#{trade.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{trade.type}</Badge>
                          </TableCell>
                          <TableCell>{trade.volume}</TableCell>
                          <TableCell>
                            <Badge variant={trade.status === "open" ? "default" : "secondary"}>{trade.status}</Badge>
                          </TableCell>
                          <TableCell>{trade.open_price}</TableCell>
                          <TableCell>{trade.close_price || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistance(new Date(trade.open_time), new Date(), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Link href={`/trades/${trade.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {tradesData.meta.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTradesPage(tradesPage - 1)}
                        disabled={tradesPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {tradesPage} of {tradesData.meta.last_page}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTradesPage(tradesPage + 1)}
                        disabled={tradesPage === tradesData.meta.last_page}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No trades found for this account
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
