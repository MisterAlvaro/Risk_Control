"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTrades } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, ExternalLink } from "lucide-react"
import { formatDistance } from "date-fns"
import { formatPrice } from "@/lib/utils"

export default function TradesPage() {
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    account_id: "",
    status: "all",
    type: "all",
    from_date: "",
    to_date: "",
    min_volume: "",
    max_volume: "",
  })

  const queryParams: Record<string, string | number> = { page }
  if (filters.account_id) queryParams.account_id = filters.account_id
  if (filters.status !== "all") queryParams.status = filters.status
  if (filters.type !== "all") queryParams.type = filters.type
  if (filters.from_date) queryParams.from_date = filters.from_date
  if (filters.to_date) queryParams.to_date = filters.to_date
  if (filters.min_volume) queryParams.min_volume = filters.min_volume
  if (filters.max_volume) queryParams.max_volume = filters.max_volume

  const { data, isLoading } = useTrades(queryParams)

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
          <p className="text-muted-foreground">View and analyze trading activity</p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID</Label>
              <Input
                id="account_id"
                placeholder="Filter by account..."
                value={filters.account_id}
                onChange={(e) => updateFilter("account_id", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_date">From Date</Label>
              <Input
                id="from_date"
                type="date"
                value={filters.from_date}
                onChange={(e) => updateFilter("from_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_date">To Date</Label>
              <Input
                id="to_date"
                type="date"
                value={filters.to_date}
                onChange={(e) => updateFilter("to_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_volume">Min Volume</Label>
              <Input
                id="min_volume"
                type="number"
                step="0.01"
                placeholder="Minimum volume"
                value={filters.min_volume}
                onChange={(e) => updateFilter("min_volume", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_volume">Max Volume</Label>
              <Input
                id="max_volume"
                type="number"
                step="0.01"
                placeholder="Maximum volume"
                value={filters.max_volume}
                onChange={(e) => updateFilter("max_volume", e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Trades List</CardTitle>
          <CardDescription>
            {data?.meta?.total || 0} total trades • Page {page} of {data?.meta?.last_page || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : data && data.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Price</TableHead>
                    <TableHead>Close Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Incidents</TableHead>
                    <TableHead>Opened</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">#{trade.id}</TableCell>
                      <TableCell>
                        <Link href={`/accounts/${trade.account_id}`}>
                          <Button variant="link" className="h-auto p-0">
                            {trade.account_login}
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trade.type}</Badge>
                      </TableCell>
                      <TableCell>{trade.volume}</TableCell>
                      <TableCell>
                        <Badge variant={trade.status === "open" ? "default" : "secondary"}>{trade.status}</Badge>
                      </TableCell>
                      <TableCell>{formatPrice(trade.open_price)}</TableCell>
                      <TableCell>{formatPrice(trade.close_price)}</TableCell>
                      <TableCell>
                        {trade.duration_seconds ? `${Math.floor(trade.duration_seconds / 60)}m` : "-"}
                      </TableCell>
                      <TableCell>
                        {trade.incidents_count > 0 ? <Badge variant="destructive">{trade.incidents_count}</Badge> : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistance(new Date(trade.open_time), new Date(), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Link href={`/trades/${trade.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {data.meta.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.meta.last_page}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No trades found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
