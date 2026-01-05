"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTrade } from "@/lib/queries"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils"

export default function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const tradeId = Number.parseInt(resolvedParams.id)

  const { data: trade, isLoading } = useTrade(tradeId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!trade) {
    return <div className="text-center text-muted-foreground">Trade not found</div>
  }

  const isProfitable = trade.close_price && trade.close_price > trade.open_price

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/trades">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Trade #{trade.id}</h1>
          <p className="text-muted-foreground">
            {trade.type} • {trade.volume} volume
          </p>
        </div>
        <Badge variant={trade.status === "open" ? "default" : "secondary"}>{trade.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trade Information</CardTitle>
            <CardDescription>Basic trade details and pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Account</div>
                <Link href={`/accounts/${trade.account_id}`}>
                  <Button variant="link" className="h-auto p-0 mt-1 text-base">
                    {trade.account_login}
                  </Button>
                </Link>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <Badge variant="outline" className="mt-1">
                  {trade.type}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Volume</div>
                <div className="mt-1 text-xl font-bold">{trade.volume}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge variant={trade.status === "open" ? "default" : "secondary"} className="mt-1">
                  {trade.status}
                </Badge>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Open Price</div>
                  <div className="mt-1 text-2xl font-bold">{formatPrice(trade.open_price)}</div>
                </div>
                {trade.close_price && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Close Price</div>
                    <div className="mt-1 text-2xl font-bold flex items-center gap-2">
                      {formatPrice(trade.close_price)}
                      {isProfitable ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Opened At</div>
                  <div className="mt-1 font-medium">{format(new Date(trade.open_time), "MMM dd, yyyy HH:mm:ss")}</div>
                </div>
                {trade.close_time && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Closed At</div>
                    <div className="mt-1 font-medium">
                      {format(new Date(trade.close_time), "MMM dd, yyyy HH:mm:ss")}
                    </div>
                  </div>
                )}
                {trade.duration_seconds && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Duration</div>
                    <div className="mt-1 font-medium">
                      {Math.floor(trade.duration_seconds / 3600)}h {Math.floor((trade.duration_seconds % 3600) / 60)}m
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Incidents</div>
                  <div className="mt-1">
                    {trade.incidents_count > 0 ? (
                      <Badge variant="destructive">{trade.incidents_count} violations</Badge>
                    ) : (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">No violations</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Additional trade information</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(trade.metadata).length > 0 ? (
              <div className="rounded-lg bg-muted/50 p-4">
                <pre className="text-sm overflow-auto">{JSON.stringify(trade.metadata, null, 2)}</pre>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No additional metadata available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
