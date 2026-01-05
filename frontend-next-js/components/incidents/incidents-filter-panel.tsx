"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface IncidentsFilterPanelProps {
  filters: {
    status: string
    account_id: string
    risk_rule_id: string
    trade_id: string
    from_date: string
    to_date: string
  }
  onChange: (filters: Record<string, string>) => void
  onReset: () => void
}

export function IncidentsFilterPanel({ filters, onChange, onReset }: IncidentsFilterPanelProps) {
  const updateFilter = (key: string, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <Label htmlFor="risk_rule_id">Rule ID</Label>
          <Input
            id="risk_rule_id"
            placeholder="Filter by rule..."
            value={filters.risk_rule_id}
            onChange={(e) => updateFilter("risk_rule_id", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trade_id">Trade ID</Label>
          <Input
            id="trade_id"
            placeholder="Filter by trade..."
            value={filters.trade_id}
            onChange={(e) => updateFilter("trade_id", e.target.value)}
          />
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
      </div>
    </Card>
  )
}
