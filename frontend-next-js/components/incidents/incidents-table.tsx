"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Incident } from "@/lib/types"
import { formatDistance, format } from "date-fns"
import { ExternalLink, CheckCircle } from "lucide-react"

interface IncidentsTableProps {
  incidents: Incident[]
  onResolve: (id: number) => void
}

export function IncidentsTable({ incidents, onResolve }: IncidentsTableProps) {
  const getStatusColor = (status: Incident["status"]) => {
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

  if (incidents.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No incidents found matching your filters.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Rule</TableHead>
          <TableHead>Trade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Resolved</TableHead>
          <TableHead className="w-[150px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="font-medium">#{incident.id}</TableCell>
            <TableCell>{incident.account_login}</TableCell>
            <TableCell className="max-w-[200px] truncate">{incident.rule_name}</TableCell>
            <TableCell>{incident.trade_id ? `#${incident.trade_id}` : "-"}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(incident.status)}>
                {incident.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistance(new Date(incident.created_at), new Date(), { addSuffix: true })}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {incident.resolved_at ? format(new Date(incident.resolved_at), "MMM dd, yyyy") : "-"}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/incidents/${incident.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                {incident.status !== "resolved" && (
                  <Button variant="ghost" size="sm" onClick={() => onResolve(incident.id)}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
