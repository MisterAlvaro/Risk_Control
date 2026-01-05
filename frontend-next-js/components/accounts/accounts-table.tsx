"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Account } from "@/lib/types"
import { ExternalLink, AlertTriangle } from "lucide-react"
import { formatDistance } from "date-fns"

interface AccountsTableProps {
  accounts: Account[]
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const getRiskBadge = (account: Account) => {
    if (account.active_incidents_count >= 5) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      )
    } else if (account.active_incidents_count >= 3) {
      return (
        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1">
          <AlertTriangle className="h-3 w-3" />
          High
        </Badge>
      )
    } else if (account.active_incidents_count > 0) {
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>
    }
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>
  }

  if (accounts.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No accounts found matching your filters.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Login</TableHead>
          <TableHead>Trading Status</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Active Incidents</TableHead>
          <TableHead>Open Trades</TableHead>
          <TableHead>Total Trades</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">{account.login}</TableCell>
            <TableCell>
              <Badge variant={account.is_trading_enabled ? "default" : "destructive"}>
                {account.is_trading_enabled ? "Enabled" : "Disabled"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{account.status}</Badge>
            </TableCell>
            <TableCell>{getRiskBadge(account)}</TableCell>
            <TableCell className="font-semibold">{account.active_incidents_count}</TableCell>
            <TableCell>{account.open_trades_count}</TableCell>
            <TableCell>{account.trades_count}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistance(new Date(account.created_at), new Date(), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <Link href={`/accounts/${account.id}`}>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
