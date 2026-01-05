"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActions } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Zap } from "lucide-react"
import { formatDistance } from "date-fns"

export default function ActionsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const queryParams: Record<string, string> = {}
  if (typeFilter !== "all") queryParams.type = typeFilter
  if (activeFilter !== "all") queryParams.is_active = activeFilter

  const { data: actions, isLoading } = useActions(Object.keys(queryParams).length > 0 ? queryParams : undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
          <p className="text-muted-foreground">Available actions that can be attached to risk rules</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="disable_trading">Disable Trading</SelectItem>
              <SelectItem value="close_trades">Close Trades</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="1">Active Only</SelectItem>
              <SelectItem value="0">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </>
        ) : actions && actions.length > 0 ? (
          actions.map((action) => (
            <Card key={action.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.name}</CardTitle>
                      <CardDescription>ID: {action.id}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{action.type}</Badge>
                  {action.is_active ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>

                {action.config && Object.keys(action.config).length > 0 && (
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Configuration</div>
                    <div className="space-y-1">
                      {Object.entries(action.config).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium truncate ml-2">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Created {formatDistance(new Date(action.created_at), new Date(), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex h-32 items-center justify-center text-sm text-muted-foreground">
            No actions found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}
