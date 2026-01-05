"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RiskRule } from "@/lib/types"
import { ExternalLink, Pencil, Trash2 } from "lucide-react"
import { formatDistance } from "date-fns"

interface RulesTableProps {
  rules: RiskRule[]
  onEdit: (rule: RiskRule) => void
  onDelete: (rule: RiskRule) => void
}

export function RulesTable({ rules, onEdit, onDelete }: RulesTableProps) {
  if (rules.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No risk rules found. Create one to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Incidents</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[150px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-medium">{rule.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{rule.type_label}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={rule.severity === "hard" ? "destructive" : "secondary"}>{rule.severity}</Badge>
            </TableCell>
            <TableCell>
              {rule.is_active ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </TableCell>
            <TableCell>{rule.incidents_count}</TableCell>
            <TableCell>{rule.actions_count}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistance(new Date(rule.created_at), new Date(), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/risk-rules/${rule.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onEdit(rule)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(rule)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
