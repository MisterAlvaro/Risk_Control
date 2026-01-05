"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IncidentsFilterPanel } from "@/components/incidents/incidents-filter-panel"
import { IncidentsTable } from "@/components/incidents/incidents-table"
import { useIncidents, useResolveIncident } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Filter, Download } from "lucide-react"

export default function IncidentsPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    account_id: "",
    risk_rule_id: "",
    trade_id: "",
    from_date: "",
    to_date: "",
  })

  const queryParams: Record<string, string | number> = { page }
  if (filters.status !== "all") queryParams.status = filters.status
  if (filters.account_id) queryParams.account_id = filters.account_id
  if (filters.risk_rule_id) queryParams.risk_rule_id = filters.risk_rule_id
  if (filters.trade_id) queryParams.trade_id = filters.trade_id
  if (filters.from_date) queryParams.from_date = filters.from_date
  if (filters.to_date) queryParams.to_date = filters.to_date

  const { data, isLoading } = useIncidents(queryParams)
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

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      account_id: "",
      risk_rule_id: "",
      trade_id: "",
      from_date: "",
      to_date: "",
    })
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">Monitor and resolve risk violations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {showFilters && <IncidentsFilterPanel filters={filters} onChange={setFilters} onReset={handleResetFilters} />}

      <Card>
        <CardHeader>
          <CardTitle>Incidents List</CardTitle>
          <CardDescription>
            {data?.meta?.total || 0} total incidents • Page {page} of {data?.meta?.last_page || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <>
              <IncidentsTable incidents={data?.data || []} onResolve={handleResolve} />
              {data && data.meta.last_page > 1 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
