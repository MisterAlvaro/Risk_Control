"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Account } from "@/lib/types"
import { AlertTriangle, ExternalLink } from "lucide-react"

interface RiskAccountsListProps {
  accounts: Account[]
}

export function RiskAccountsList({ accounts }: RiskAccountsListProps) {
  if (accounts.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No high-risk accounts</div>
    )
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="font-medium">{account.login}</div>
              <div className="text-sm text-muted-foreground">
                {account.active_incidents_count} active incidents • {account.open_trades_count} open trades
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={account.is_trading_enabled ? "default" : "destructive"}>
              {account.is_trading_enabled ? "Trading" : "Disabled"}
            </Badge>
            <Link href={`/accounts/${account.id}`}>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
